\connect ipeds;

-- https://hashrocket.com/blog/posts/create-quick-json-data-dumps-from-postgresql
\t on
\pset format unaligned

WITH sums_for_schools as (
SELECT
  UNITID,
  LocationName,
  Address,
  SUM(CTOTALT) as both,
  SUM(CTOTALM) as men,
  SUM(CTOTALW) as women
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
percent_women_for_grads as (
  SELECT
    UNITID,
    LocationName,
    -- Address,
    TRUNC(
      CAST(s.women AS NUMERIC) / s.both,
    2) as percent_women,
    s.both
  FROM sums_for_schools as s
  WHERE s.both > 0
)

SELECT json_agg(t)
FROM (
  SELECT * from percent_women_for_grads ORDER BY percent_women asc
) t \g by_school.json