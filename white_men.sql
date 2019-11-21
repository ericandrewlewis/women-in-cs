\connect ipeds;

-- https://hashrocket.com/blog/posts/create-quick-json-data-dumps-from-postgresql
\t on
\pset format unaligned

WITH sums_for_schools as (
SELECT
  UNITID,
  LocationName,
  Address,
  SUM(CTOTALT) as all_students,
  SUM(CWHITM) as white_men
FROM completions
LEFT JOIN dapip_data as d ON CAST(completions.UNITID AS TEXT) = d.IpedsUnitIds
WHERE
  -- Bachelors Degrees
  AWLEVEL=5 AND
  -- Look at any Computer Science/Information Science-ish degree
  CIPCODE LIKE '11.%' AND
  -- Only look at students whose primary major is CS
  majornum = 1
GROUP BY UNITID, LocationName, Address
),
percent_white_men_for_grads as (
  SELECT
    UNITID,
    LocationName,
    -- Address,
    TRUNC(
      CAST(s.white_men AS NUMERIC) / s.all_students,
    2) as percent_white_men,
    s.all_students
  FROM sums_for_schools as s
  WHERE s.all_students > 0
)

SELECT json_agg(t)
FROM (
  SELECT * from percent_white_men_for_grads ORDER BY percent_white_men asc
) t \g white_men_by_school.json