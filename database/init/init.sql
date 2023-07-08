CREATE DATABASE IF NOT EXISTS `db`
  CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

USE `db`;

-- Create relations

CREATE TABLE IF NOT EXISTS `record` (
  `id`        BIGINT NOT NULL AUTO_INCREMENT,
  `url`       VARCHAR(2048) NOT NULL,
  `regexp`    VARCHAR(1024) NOT NULL,
  `period`    INT NOT NULL, -- minutes!
  `label`     VARCHAR(1024) NOT NULL,
  `active`    TINYINT NOT NULL,
  `tags`      JSON NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `execution` (
  `id`        BIGINT NOT NULL AUTO_INCREMENT,
  `recordId`  BIGINT NOT NULL,
  `status`    ENUM('CREATED', 'QUEUED', 'CRAWLING', 'FINISHED', 'FAILED')
              NOT NULL DEFAULT 'CREATED',
  `startTime` DATETIME NOT NULL,
  `endTime`   DATETIME,
  `linkCount` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`recordId`) REFERENCES `record`(`id`)
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
    `r`.`id`        AS `id`,
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
      -- e0.`id`,
      `e0`.`recordId`,
      `e0`.`status`,
      `e0`.`startTime`,
      `e0`.`endTime`
    FROM `execution` AS `e0` LEFT JOIN `execution` AS `e1`
      ON `e0`.`recordId` = `e1`.`recordId` AND (`e0`.`startTime` < `e1`.`startTime` OR (`e0`.`startTime` = `e1`.`startTime` AND `e0`.`id` < `e1`.`id`))
    WHERE `e1`.startTime IS NULL
  ) AS `e`
  ON `r`.`id` = `e`.`recordId`;
END$

CREATE PROCEDURE `createRecord` (
    IN  `url`       VARCHAR(2048),
    IN  `regexp`    VARCHAR(1024),
    IN  `period`    INT,
    IN  `label`     VARCHAR(1024),
    IN  `active`    TINYINT,
    IN  `tags`      JSON,
    OUT `id`        BIGINT
)
BEGIN
  INSERT INTO `record`
    (`url`, `regexp`, `period`, `label`, `active`, `tags`) VALUES
    (`url`, `regexp`, `period`, `label`, `active`, `tags`);
  SELECT LAST_INSERT_ID() INTO `id`;
END$

DELIMITER ;

-- Data samples ----------------------------------------------------------------

INSERT INTO `record` (`url`, `regexp`, `period`, `label`, `active`, `tags`) VALUES
  ('http://www.example1.com', '^abcd$', 1, 'Example web 1', 0, JSON_ARRAY('a', 'b')),
  ('http://www.example2.com', '[0-9]+', 2, 'Example web 2', 1, JSON_ARRAY('b', 'c')),
  ('http://www.example3.com', '[a-z]*', 3, 'Example web 3', 1, JSON_ARRAY('c', 'd'));

INSERT INTO `execution` (`recordId`, `startTime`) VALUES
  (1, '2020-01-01 00:00:00'),
  (1, '2020-01-01 01:00:00'),
  (1, '2020-01-01 01:00:00'),
  (2, '2020-01-01 02:00:00');
