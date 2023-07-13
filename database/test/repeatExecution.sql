INSERT INTO `rec` (`url`, `regexp`, `period`, `label`, `active`, `tags`) VALUES
  ('http://www.example1.com', '^abcd$', 1, 'Example web 1', 1, JSON_ARRAY('a', 'b'));

INSERT INTO `exe` (`recId`, `status`, `createTime`, `finishTime`) VALUES
  (1, 'FAILURE',  '2023-01-01 00:00:00', '2023-01-01 00:00:01'),
  (1, 'FINISHED',  '2023-01-01 00:00:00', '2023-01-01 00:00:01');

-- waiting is created

CALL repeatExecution (
  1,
  '2023-01-01 00:00:00',
  @exeId
);
SELECT @exeId AS exeId;

-- nothing happens, null is returned

CALL repeatExecution (
  1,
  '2023-01-01 00:00:00',
  @exeId
);
SELECT @exeId AS exeId;
