CREATE DATABASE IF NOT EXISTS `db`
  CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

USE `db`;

-- Create relations ------------------------------------------------------------

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
  `status`      ENUM('WAITING', 'PLANNED', 'FAILURE', 'CRAWLING', 'FINISHED')
                NOT NULL,
  `createTime`  DATETIME NOT NULL,
  `finishTime`  DATETIME,
  PRIMARY KEY (`exeId`),
  FOREIGN KEY (`recId`) REFERENCES `rec`(`recId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CHECK (ISNULL(`finishTime`) OR `createTime` < `finishTime`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `nod` (
  `nodId`       BIGINT NOT NULL AUTO_INCREMENT,
  `exeId`       BIGINT NOT NULL,
  `url`         VARCHAR(2048) NOT NULL,
  `title`       VARCHAR(1024) NOT NULL,
  `crawlTime`   DATETIME,
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

-- Stored procedures -----------------------------------------------------------

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
  IN  `i_createTime`  DATETIME,
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
  IN  `i_createTime`  DATETIME,
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

    -- statuses other than 'FINISHED' mean the record will be repeated
    IF (
      `i_active` = 1 AND `o_count` > 0 AND
      NOT EXISTS (
        SELECT * FROM `exe`
        WHERE `recId` = `i_recId` AND (`status` != 'FAILURE' OR `status` != 'FINISHED'))
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
    `r0`.`recId`,
    `e1`.`exeId`,
    `r0`.`label`,
    `e1`.`status`,
    `e1`.`createTime`,
    `e1`.`finishTime`,
    `e1`.`nodCount`
  FROM `rec` AS `r0` INNER JOIN (
    SELECT
      `e0`.*,
      `n0`.`nodCount`
    FROM `exe` AS `e0` INNER JOIN (
      SELECT
        `nod`.`exeId`,
        COUNT(`nod`.`nodId`) AS `nodCount`
      FROM `nod`
      GROUP BY `exeId`
    ) AS `n0`
    ON `e0`.`exeId` = `n0`.`exeId`
  ) AS `e1`
  ON `r0`.`recId` = `e1`.`recId`;
END$

/**
 * Delete incomplete executions for easier server startup.
 */
CREATE PROCEDURE IF NOT EXISTS `deleteIncompleteExecutions` ()
BEGIN
  DELETE FROM `exe` WHERE (`status` != 'FAILURE' OR `status` != 'FINISHED');
END$

/**
 * Create prioritized execution upon user command, removes all waiting
 * executions corresponding to the provided `recId`.
 */
CREATE PROCEDURE IF NOT EXISTS `createExecution` (
  IN  `i_recId`       BIGINT,
  IN  `i_createTime`  DATETIME,
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
 * Update execution status (e.g. set 'CRAWLING' before passing to a crawler).
 */
CREATE PROCEDURE IF NOT EXISTS `updateExecutionStatus` (
  IN  `i_exeId`       BIGINT,
  IN  `i_status`      ENUM('WAITING', 'PLANNED', 'FAILURE', 'CRAWLING', 'FINISHED'),
  OUT `o_count`       INT)
BEGIN
  UPDATE `exe` SET `status` = `i_status` WHERE `exeId` = `i_exeId`;
  SELECT ROW_COUNT () INTO `o_count`;
END$

/**
 * Create new crawled node.
 */
CREATE PROCEDURE IF NOT EXISTS `createNode` (
  IN  `i_exeId`       BIGINT,
  IN  `i_url`         VARCHAR(2048),
  IN  `i_title`       VARCHAR(1024),
  IN  `i_crawlTime`   DATETIME,
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

DELIMITER ;
