CREATE DATABASE IF NOT EXISTS `db`
  CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

USE `db`;

-- Relations -------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `rec` (
  `recId`       BIGINT NOT NULL AUTO_INCREMENT,
  `url`         VARCHAR(2048) NOT NULL,
  `regexp`      VARCHAR(1024) NOT NULL,
  `period`      INT NOT NULL, -- minutes!
  `label`       VARCHAR(1024) NOT NULL,
  `active`      INT NOT NULL,
  `tags`        JSON NOT NULL,
  PRIMARY KEY (`recId`),
  CHECK (`active` >= 0 AND `active` <= 1)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `exe` (
  `exeId`       BIGINT NOT NULL AUTO_INCREMENT,
  `recId`       BIGINT NOT NULL,
  `status`      ENUM('WAITING', 'PLANNED', 'CRAWLING', 'FAILURE', 'SUCCESS')
                NOT NULL,
  `createTime`  DATETIME(3) NOT NULL,
  `finishTime`  DATETIME(3),
  `sitesCrawl`  INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`exeId`),
  FOREIGN KEY (`recId`) REFERENCES `rec`(`recId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `nod` (
  `nodId`       BIGINT NOT NULL AUTO_INCREMENT,
  `exeId`       BIGINT NOT NULL,
  `url`         VARCHAR(2048) NOT NULL,
  `title`       VARCHAR(1024),
  `crawlTime`   DATETIME(3),
  PRIMARY KEY (`nodId`),
  FOREIGN KEY (`exeId`) REFERENCES `exe`(`exeId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `lnk` (
  `nodFr`       BIGINT NOT NULL,
  `nodTo`       BIGINT NOT NULL,
  PRIMARY KEY (`nodFr`, `nodTo`),
  FOREIGN KEY (`nodFr`) REFERENCES `nod`(`nodId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`nodTo`) REFERENCES `nod`(`nodId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- OpenAPI stored procedures ---------------------------------------------------

DELIMITER $

/**
 * Get all records with the status, create / finish time of the last execution.
 * https://stackoverflow.com/a/28090544
 */
CREATE PROCEDURE IF NOT EXISTS `getAllRecords` ()
BEGIN
  SELECT
    `r`.`recId`       AS `recId`,
    `r`.`url`         AS `url`,
    `r`.`regexp`      AS `regexp`,
    `r`.`period`      AS `period`,
    `r`.`label`       AS `label`,
    `r`.`active`      AS `active`,
    `r`.`tags`        AS `tags`,
    `e`.`status`      AS `lastExecStatus`,
    `e`.`createTime`  AS `lastExecCreateTime`,
    `e`.`finishTime`  AS `lastExecFinishTime`
  FROM `rec` AS `r` LEFT JOIN (
    SELECT
      -- `e0`.`exeId`,
      `e0`.`recId`,
      `e0`.`status`,
      `e0`.`createTime`,
      `e0`.`finishTime`
    FROM `exe` AS `e0` LEFT JOIN `exe` AS `e1`
      ON `e0`.`recId` = `e1`.`recId` AND (
        `e0`.`createTime` < `e1`.`createTime` OR (
          `e0`.`createTime` = `e1`.`createTime` AND `e0`.`exeId` < `e1`.`exeId`))
    WHERE `e1`.`createTime` IS NULL
  ) AS `e`
  ON `r`.`recId` = `e`.`recId`;
END$

/**
 * Create new record. For active records, also create a planned execution.
 */
CREATE PROCEDURE IF NOT EXISTS `createRecord` (
  IN  `i_url`         VARCHAR(2048),
  IN  `i_regexp`      VARCHAR(1024),
  IN  `i_period`      INT,
  IN  `i_label`       VARCHAR(1024),
  IN  `i_active`      INT,
  IN  `i_tags`        JSON,
  IN  `i_createTime`  DATETIME(3),
  OUT `o_recId`       BIGINT,
  OUT `o_exeId`       BIGINT)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;
    INSERT INTO `rec` (`url`, `regexp`, `period`, `label`, `active`, `tags`) VALUES
      (`i_url`, `i_regexp`, `i_period`, `i_label`, `i_active`, `i_tags`);
    SELECT LAST_INSERT_ID () INTO `o_recId`;

    IF (`i_active` = 1) THEN
      INSERT INTO `exe` (`recId`, `status`, `createTime`) VALUES
        (`o_recId`, 'PLANNED', `i_createTime`);
      SELECT LAST_INSERT_ID () INTO `o_exeId`;
    END IF;
  COMMIT;
END$

/**
 * Ensure new state of the target record. Create new execution if the record
 * is active and no ongoing execution exists. Remove waiting executions if the
 * record has been deactivated.
 */
CREATE PROCEDURE IF NOT EXISTS `updateRecord` (
  IN  `i_recId`       BIGINT,
  IN  `i_url`         VARCHAR(2048),
  IN  `i_regexp`      VARCHAR(1024),
  IN  `i_period`      INT,
  IN  `i_label`       VARCHAR(1024),
  IN  `i_active`      INT,
  IN  `i_tags`        JSON,
  IN  `i_createTime`  DATETIME(3),
  OUT `o_count`       INT,
  OUT `o_exeId`       BIGINT)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;
    SELECT COUNT(*) INTO `o_count` FROM `rec` WHERE `recId` = `i_recId`;
    UPDATE `rec`
      SET
        `url`    = `i_url`,
        `regexp` = `i_regexp`,
        `period` = `i_period`,
        `label`  = `i_label`,
        `active` = `i_active`,
        `tags`   = `i_tags`
      WHERE `recId` = `i_recId`;

    -- incomplete statuses mean the record will be repeated
    IF (
      `i_active` = 1 AND `o_count` > 0 AND
      NOT EXISTS (
        SELECT * FROM `exe`
        WHERE `recId` = `i_recId` AND `status` NOT IN ('FAILURE', 'SUCCESS'))
    ) THEN
      INSERT INTO `exe` (`recId`, `status`, `createTime`) VALUES
        (`i_recId`, 'PLANNED', `i_createTime`);
      SELECT LAST_INSERT_ID () INTO `o_exeId`;
    END IF;

    IF (`i_active` = 0 AND `o_count` > 0) THEN
      DELETE FROM `exe` WHERE `recId` = `i_recId` AND `status` = 'WAITING';
    END IF;
  COMMIT;
END$

/**
 * Delete a record and all associated information.
 */
CREATE PROCEDURE IF NOT EXISTS `deleteRecord` (
  IN  `i_recId`   BIGINT,
  OUT `o_count`   INT)
BEGIN
  DELETE FROM `rec` WHERE `recId` = `i_recId`;
  SELECT ROW_COUNT () INTO `o_count`;
END$

/**
 * Get all executions with node count and label.
 */
CREATE PROCEDURE IF NOT EXISTS `getAllExecutions` ()
BEGIN
  SELECT
    `rec`.`recId`,
    `exe`.`exeId`,
    `rec`.`label`,
    `exe`.`status`,
    `exe`.`createTime`,
    `exe`.`finishTime`,
    `exe`.`sitesCrawl`
  FROM `rec` INNER JOIN `exe` ON `rec`.`recId` = `exe`.`recId`;
END$

/**
 * Delete incomplete executions for easier server startup.
 */
CREATE PROCEDURE IF NOT EXISTS `deleteIncompleteExecutions` ()
BEGIN
  DELETE FROM `exe` WHERE `status` NOT IN ('FAILURE', 'SUCCESS');
END$

/**
 * Find an execution with the smallest identifier and expired timer. Covers
 * transition from 'WAITING' to 'PLANNED'.
 */
CREATE PROCEDURE IF NOT EXISTS `resumeExecution` (
  IN  `i_actualTime`  DATETIME(3),
  OUT `o_exeId`       BIGINT)
BEGIN
  UPDATE `exe` AS `e0`
  SET
    `e0`.`exeId`  = LAST_INSERT_ID (`e0`.`exeId`), -- (!)
    `e0`.`status` = 'PLANNED'
  WHERE `e0`.`exeId` IN (
    SELECT `exeId` FROM (
      SELECT `exe`.`exeId`
      FROM `rec` INNER JOIN `exe` ON `rec`.`recId` = `exe`.`recId`
      WHERE `exe`.`status` = 'WAITING'
        AND DATE_ADD(`exe`.`createTime`, INTERVAL `rec`.`period` MINUTE) <= `i_actualTime`
      ORDER BY `exe`.`exeId` ASC LIMIT 1
    ) AS `e1`
  );

  IF (ROW_COUNT () > 0) THEN
    SELECT LAST_INSERT_ID () INTO `o_exeId`;
  END IF;
END$

/**
 * Create prioritized execution upon user command, removes all waiting
 * executions corresponding to the provided `recId`.
 */
CREATE PROCEDURE IF NOT EXISTS `createExecution` (
  IN  `i_recId`       BIGINT,
  IN  `i_createTime`  DATETIME(3),
  OUT `o_exeId`       BIGINT)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;
    INSERT INTO `exe` (`recId`, `status`, `createTime`)
      SELECT `recId` , 'PLANNED', `i_createTime` FROM `rec`
        WHERE `recId` = `i_recId`;

    IF (ROW_COUNT () > 0) THEN
      SELECT LAST_INSERT_ID () INTO `o_exeId`;
    END IF;

    DELETE FROM `exe` WHERE `recId` = `i_recId` AND `status` = 'WAITING';
  COMMIT;
END$

/**
 * Update execution status (e.g. 'PLANNED' to 'CRAWLING' before passing to
 * a crawler).
 */
CREATE PROCEDURE IF NOT EXISTS `updateExecutionStatus` (
  IN  `i_exeId`       BIGINT,
  IN  `i_status`      ENUM('WAITING', 'PLANNED', 'CRAWLING', 'FAILURE', 'SUCCESS'),
  OUT `o_count`       INT)
BEGIN
  UPDATE `exe` SET `status` = `i_status` WHERE `exeId` = `i_exeId`;
  SELECT ROW_COUNT () INTO `o_count`;
END$

/**
 * Counter of sites crawled.
 */
CREATE PROCEDURE IF NOT EXISTS `updateExecutionSitesCrawl` (
  IN  `i_exeId`       BIGINT,
  IN  `i_sitesCrawl`  BIGINT)
BEGIN
  UPDATE `exe` SET `sitesCrawl` = `i_sitesCrawl` WHERE `exeId` = `i_exeId`;
END$

/**
 * Create waiting execution if the record is still active, and no other incom-
 * plete executions exist. Covers transition from 'FAILURE' or 'SUCCESS' to
 * a new 'WAITING' execution.
 */
CREATE PROCEDURE IF NOT EXISTS `repeatExecution` (
  IN  `i_exeId`       BIGINT,
  IN  `i_createTime`  DATETIME(3),
  OUT `o_exeId`       BIGINT)
BEGIN
  INSERT INTO `exe` (`recId`, `status`, `createTime`)
    SELECT `r1`.`recId`, 'WAITING', `i_createTime` FROM (
      SELECT `recId` FROM `rec` AS `r0`
      WHERE `r0`.`active` = 1
	    AND EXISTS (
        SELECT `recId` FROM `exe` WHERE `r0`.`recId` = `exe`.`recId` AND `exe`.`exeId` = `i_exeId`)
      AND NOT EXISTS (
        SELECT `recId` FROM `exe` WHERE `r0`.`recId` = `exe`.`recId` AND `exe`.`status` NOT IN ('FAILURE', 'SUCCESS'))
    ) AS `r1`;

  IF (ROW_COUNT () > 0) THEN
    SELECT LAST_INSERT_ID () INTO `o_exeId`;
  END IF;
END$

/**
 * Get `url` and `regexp` associated with an execution.
 */
CREATE PROCEDURE IF NOT EXISTS `getExecutionBoundary` (
  IN  `i_exeId`       BIGINT)
BEGIN
  SELECT `rec`.`url`, `rec`.`regexp` 
  FROM `rec` INNER JOIN `exe`
    ON `rec`.`recId` = `exe`.`recId`
  WHERE `exe`.`exeId` = `i_exeId`;
END$

/**
 * Create new node.
 */
CREATE PROCEDURE IF NOT EXISTS `createNode` (
  IN  `i_exeId`       BIGINT,
  IN  `i_url`         VARCHAR(2048),
  OUT `o_nodId`       BIGINT)
BEGIN
  INSERT INTO `nod` (`exeId`, `url`, `title`, `crawlTime`)
    SELECT `exeId`, `i_url`, `i_title`, `i_crawlTime` FROM `exe`
      WHERE `exeId` = `i_exeId`;
  
  IF (ROW_COUNT () > 0) THEN
    SELECT LAST_INSERT_ID () INTO `o_nodId`;
  END IF;
END$

/**
 * Create a node, the procedure may throw.
 */
CREATE PROCEDURE IF NOT EXISTS `createNodeUnsafe` (
  IN  `i_exeId`       BIGINT,
  IN  `i_url`         VARCHAR(2048),
  OUT `o_nodId`       BIGINT)
BEGIN
  INSERT INTO `nod` (`exeId`, `url`) VALUES (`i_exeId`, `i_url`);
  SELECT LAST_INSERT_ID () INTO `o_nodId`;
END$

/**
 * Update a node.
 */
CREATE PROCEDURE IF NOT EXISTS `updateNode` (
  IN  `i_nodId`       BIGINT,
  IN  `i_title`       VARCHAR(1024),
  IN  `i_crawlTime`   DATETIME(3),
  OUT `o_count`       INT)
BEGIN
  UPDATE `nod` SET `title` = `i_title`, `crawlTime` = `i_crawlTime` WHERE `nodId` = `i_nodId`;
  SELECT ROW_COUNT() INTO `o_count`;
END$

/**
 * Create directed link between two crawled nodes.
 */
CREATE PROCEDURE IF NOT EXISTS `createLink` (
  IN  `i_nodFr`       BIGINT,
  IN  `i_nodTo`       BIGINT,
  OUT `o_count`       INT)
BEGIN
  INSERT INTO `lnk` (`nodFr`, `nodTo`)
    SELECT
      `n0`.`nodId` AS `nodFr`,
      `n1`.`nodId` AS `nodTo`
    FROM
      (SELECT `nodId` FROM `nod` WHERE `nodId` = `i_nodFr`) AS `n0`
    CROSS JOIN
      (SELECT `nodId` FROM `nod` WHERE `nodId` = `i_nodTo`) AS `n1`;

  SELECT ROW_COUNT () INTO `o_count`;
END$

/**
 * Create a directed link, can throw upon record removal.
 */
CREATE PROCEDURE IF NOT EXISTS `createLinkUnsafe` (
  IN  `i_nodFr`       BIGINT,
  IN  `i_nodTo`       BIGINT)
BEGIN
  INSERT INTO `lnk` (`nodFr`, `nodTo`) VALUES (`i_nodFr`, `i_nodTo`);
END$

/**
 * Finish a possibly existing execution with provided time and status.
 */
CREATE PROCEDURE IF NOT EXISTS `finishExecution` (
  IN  `i_exeId`       BIGINT,
  IN  `i_status`      ENUM('WAITING', 'PLANNED', 'CRAWLING', 'FAILURE', 'SUCCESS'),
  IN  `i_finishTime`  DATETIME(3),
  OUT `o_count`       INT)
BEGIN
  UPDATE `exe` SET `status` = `i_status`, `finishTime` = `i_finishTime` WHERE `exeId` = `i_exeId`;
  SELECT ROW_COUNT () INTO `o_count`;
END$

/**
 * Delete all nodes associated with the same record that are associated
 * with hierarchically earlier executions.
 */
CREATE PROCEDURE IF NOT EXISTS `deleteNodes` (
  IN `i_exeId`        BIGINT)
BEGIN
  DELETE FROM `nod` WHERE `nodId` IN (
  SELECT `nodId` FROM (
    SELECT
      `nod`.`nodId` AS `nodId`
    FROM `nod` INNER JOIN `exe`
      ON `nod`.`exeId` = `exe`.`exeId`
    WHERE `nod`.`exeId` < `i_exeId`
      AND `recId` IN (
        SELECT `recId` FROM `exe` WHERE `exeId` = `i_exeId`)) AS `tab`);
END$

DELIMITER ;

-- GraphQL stored procedures ---------------------------------------------------

DELIMITER $

/**
 * Get all webpage records available in the database.
 */
CREATE PROCEDURE IF NOT EXISTS `getAllWebPages` ()
BEGIN
  SELECT `recId` AS `identifier`, `label`, `url`, `regexp`, `tags`, `active` FROM `rec`;
END$

/**
 * Get webpage by identifier.
 */
CREATE PROCEDURE IF NOT EXISTS `getWebPage` (
  `i_recId`           BIGINT)
BEGIN
  SELECT `recId` AS `identifier`, `label`, `url`, `regexp`, `tags`, `active`
  FROM `rec` WHERE `recId` = `i_recId`;
END$

/**
 * Get nodes of the latest execution corresponding to a provided record.
 */
CREATE PROCEDURE IF NOT EXISTS `getLatestNodes` (
  IN  `i_recId`       BIGINT)
BEGIN
  SELECT
    `n1`.`nodId`,
    `n1`.`title`,
    `n1`.`url`,
    `n1`.`crawlTime`
  FROM `nod` AS `n1` INNER JOIN (
    SELECT `e0`.`exeId`
      FROM `rec` AS `r0` INNER JOIN `exe` AS `e0` ON `r0`.`recId` = `e0`.`recId`
      WHERE `r0`.`recId` = `i_recId` AND `e0`.`status` IN ('CRAWLING', 'SUCCESS')
      ORDER BY `e0`.`exeId` DESC LIMIT 1
  ) AS `e1`
  ON `n1`.`exeId` = `e1`.`exeId`;
END$

/**
 * Get node by identifier.
 */
CREATE PROCEDURE IF NOT EXISTS `getNode` (
  IN `i_nodId`        BIGINT)
BEGIN
  SELECT `nodId`, `title`, `url`, `crawlTime` FROM `nod` WHERE `nodId` = `i_nodId`;
END$

/**
 * Get out-edges for a given node.
 */
CREATE PROCEDURE IF NOT EXISTS `getNodeLinks` (
  IN `i_nodFr`        BIGINT)
BEGIN
  SELECT `nodTo` FROM `lnk` WHERE `nodFr` = `i_nodFr`;
END$

DELIMITER ;
