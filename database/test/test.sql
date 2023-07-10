CALL getAllRecords ();

CALL createRecord (
  'http://www.example.com/',
  '*',
  1, -- period
  'Example web',
  1, -- active
  JSON_ARRAY('a', 'b'),
  '2023-01-01 00:00:00',
  @recId,
  @exeId
);
SELECT @recId AS recId, @exeId AS exeId;

CALL updateRecord (
  1,
  'http://www.example.com/',
  '*',
  1, -- period
  'Example web',
  1, -- active
  JSON_ARRAY('a', 'b'),
  '2023-01-01 00:00:00',
  @count,
  @exeId
);
SELECT @count AS count, @exeId AS exeId;

CALL deleteRecord (
  1,
  @count
);
SELECT @count AS count;
