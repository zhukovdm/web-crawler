-- records

INSERT INTO `rec` (`url`, `regexp`, `period`, `label`, `active`, `tags`) VALUES
  ('http://www.example1.com', '^abcd$', 1, 'Example web 1', 0, JSON_ARRAY('a', 'b')),
  ('http://www.example2.com', '[0-9]+', 2, 'Example web 2', 1, JSON_ARRAY('b', 'c')),
  ('http://www.example3.com', '[a-z]*', 3, 'Example web 3', 1, JSON_ARRAY('c', 'd'));

-- executions

INSERT INTO `exe` (`recId`, `status`, `createTime`, `finishTime`) VALUES
  (1, 'WAITING',  '2023-01-01 00:00:00', '2023-01-01 00:00:01'),
  (1, 'PLANNED',  '2023-01-01 00:00:01', '2023-01-01 00:00:02'),
  (2, 'FINISHED', '2023-01-01 00:00:02', '2023-01-01 00:00:03'),
  (3, 'CRAWLING', '2023-01-01 00:00:03', '2023-01-01 00:00:04');

-- nodes

INSERT INTO `nod` (`exeId`, `url`) VALUES
  (1, 'http://www.example1.com'),
  (1, 'http://www.example2.com'),
  (1, 'http://www.example3.com'),
  (1, 'http://www.example4.com'),
  (1, 'http://www.example5.com');

-- links

INSERT INTO `lnk` (`nodFr`, `nodTo`) VALUES
  (1, 2),
  (2, 3),
  (3, 4),
  (3, 2),
  (1, 5);
