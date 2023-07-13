INSERT INTO `rec` (`url`, `regexp`, `period`, `label`, `active`, `tags`) VALUES
  ('http://www.example.com/', '^abcd$', 5, 'Example web', 1, JSON_ARRAY('a', 'b')),
  ('http://www.example.com/', '^abcd$', 5, 'Example web', 1, JSON_ARRAY('a', 'b'));

INSERT INTO `exe` (`recId`, `status`, `createTime`, `finishTime`) VALUES
  (1, 'WAITING',  '2023-01-01 00:00:00', NULL),
  (1, 'WAITING',  '2023-01-01 00:02:00', NULL),
  (2, 'WAITING',  '2023-01-01 00:00:00', NULL),
  (2, 'WAITING',  '2023-01-01 00:02:00', NULL);

-- 1st is updated

CALL resumeExecution (
  '2023-01-01 00:06:00',
  @exeId
);
SELECT @exeId AS exeId;

-- 3rd is updated

CALL resumeExecution (
  '2023-01-01 00:06:00',
  @exeId
);
SELECT @exeId AS exeId;

-- none is updated

CALL resumeExecution (
  '2023-01-01 00:06:00',
  @exeId
);
SELECT @exeId AS exeId;
