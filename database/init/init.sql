CREATE DATABASE IF NOT EXISTS `db`
  CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

USE `db`;

-- Create relations ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `record` (
  `recId`     BIGINT NOT NULL AUTO_INCREMENT,
  `url`       VARCHAR(2048) NOT NULL,
  `regexp`    VARCHAR(1024) NOT NULL,
  `period`    INT NOT NULL, -- minutes!
  `label`     VARCHAR(1024) NOT NULL,
  `active`    TINYINT NOT NULL,
  `tags`      JSON NOT NULL,
  PRIMARY KEY (`recId`)
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `execution` (
  `exeId`     BIGINT NOT NULL AUTO_INCREMENT,
  `recId`     BIGINT NOT NULL,
  `status`    ENUM('CREATED', 'PLANNED', 'WAITING', 'CRAWLING', 'FINISHED')
              NOT NULL DEFAULT 'CREATED',
  `startTime` DATETIME NOT NULL,
  `endTime`   DATETIME,
  `linkCount` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`exeId`),
  FOREIGN KEY (`recId`) REFERENCES `record`(`recId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- Stored procedures -----------------------------------------------------------

DELIMITER $

-- Get all records with status and times of the last execution.
-- https://stackoverflow.com/a/28090544

CREATE PROCEDURE `getAllRecords` ()
BEGIN
  SELECT
    `r`.`recId`     AS `recId`,
    `r`.`url`       AS `url`,
    `r`.`regexp`    AS `regexp`,
    `r`.`period`    AS `period`,
    `r`.`label`     AS `label`,
    `r`.`active`    AS `active`,
    `r`.`tags`      AS `tags`,
    `e`.`status`    AS `lastExecStatus`,
    `e`.`endTime`   AS `lastExecEndTime`,
    `e`.`startTime` AS `lastExecStartTime`
  FROM `record` AS `r` LEFT JOIN (
    SELECT
      -- e0.`exeId`,
      `e0`.`recId`,
      `e0`.`status`,
      `e0`.`startTime`,
      `e0`.`endTime`
    FROM `execution` AS `e0` LEFT JOIN `execution` AS `e1`
      ON `e0`.`recId` = `e1`.`recId`
        AND (`e0`.`startTime` < `e1`.`startTime` OR (`e0`.`startTime` = `e1`.`startTime` AND `e0`.`exeId` < `e1`.`exeId`))
    WHERE `e1`.startTime IS NULL
  ) AS `e`
  ON `r`.`recId` = `e`.`recId`;
END$

CREATE PROCEDURE `createRecord` (
  IN  `i_url`       VARCHAR(2048),
  IN  `i_regexp`    VARCHAR(1024),
  IN  `i_period`    INT,
  IN  `i_label`     VARCHAR(1024),
  IN  `i_active`    TINYINT,
  IN  `i_tags`      JSON,
  IN  `i_startTime` DATETIME,
  OUT `o_recId`     BIGINT,
  OUT `o_exeId`     BIGINT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  START TRANSACTION;
    INSERT INTO `record` (`url`, `regexp`, `period`, `label`, `active`, `tags`) VALUES
      (`i_url`, `i_regexp`, `i_period`, `i_label`, `i_active`, `i_tags`);
    SELECT LAST_INSERT_ID () INTO `o_recId`;
    IF `i_active` > 0 THEN
      INSERT INTO `execution` (`recId`, `startTime`) VALUES
        (`o_recId`, `i_startTime`);
      SELECT LAST_INSERT_ID () INTO `o_exeId`;
    END IF;
  COMMIT;
END$$

CREATE PROCEDURE `updateRecord` (
  IN  `i_recId`   BIGINT,
  IN  `i_url`     VARCHAR(2048),
  IN  `i_regexp`  VARCHAR(1024),
  IN  `i_period`  INT,
  IN  `i_label`   VARCHAR(1024),
  IN  `i_active`  TINYINT,
  IN  `i_tags`    JSON
)
BEGIN
  UPDATE `record`
  SET
    `url`    = `i_url`,
    `regexp` = `i_regexp`,
    `period` = `i_period`,
    `label`  = `i_label`,
    `active` = `i_active`,
    `tags`   = `i_tags`
  WHERE `recId` = `i_recId`;
END$$

CREATE PROCEDURE `deleteRecord` (
  IN `i_recId`    BIGINT
)
BEGIN
  DELETE FROM `record` WHERE `recId` = `i_recId`;
END$$

DELIMITER ;

-- Data samples ----------------------------------------------------------------

INSERT INTO `record` (`url`, `regexp`, `period`, `label`, `active`, `tags`) VALUES
  ('http://www.example1.com', '^abcd$', 1, 'Example web 1', 0, JSON_ARRAY('a', 'b')),
  ('http://www.example2.com', '[0-9]+', 2, 'Example web 2', 1, JSON_ARRAY('b', 'c')),
  ('http://www.example3.com', '[a-z]*', 3, 'Example web 3', 1, JSON_ARRAY('c', 'd'));

INSERT INTO `execution` (`recId`, `startTime`) VALUES
  (1, '2020-01-01 00:00:00'),
  (1, '2020-01-01 01:00:00'),
  (1, '2020-01-01 01:00:00'),
  (2, '2020-01-01 02:00:00');
