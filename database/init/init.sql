CREATE DATABASE IF NOT EXISTS `db`
  CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

USE `db`;

CREATE TABLE IF NOT EXISTS `record`
  ( `id` BIGINT NOT NULL AUTO_INCREMENT
  , `url` VARCHAR(250) NOT NULL
  , `label` VARCHAR(100) NOT NULL
  , `regexp` VARCHAR(100) NOT NULL
  , `active` TINYINT NOT NULL
  , `tags` JSON NOT NULL
  , `period` INT NOT NULL -- minutes
  , PRIMARY KEY (`id`)
  ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `execution`
  ( `id` BIGINT PRIMARY KEY
  , `recordId` BIGINT NOT NULL
  , `status` ENUM
    ( 'CREATED'
    , 'QUEUED'
    , 'RUNNING'
    , 'FINISHED'
    , 'FAILED') NOT NULL DEFAULT 'CREATED'
  , `startTime` DATETIME NOT NULL
  , `endTime` DATETIME
  , `crawlCount` INT NOT NULL DEFAULT 0
  , FOREIGN KEY (`recordId`) REFERENCES `record`(`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO `record`(`url`, `label`, `regexp`, `active`, `tags`, `period`) VALUES
  ('http://www.example.com', 'Example web', '*', 0, JSON_ARRAY('a', 'b'), 10);
