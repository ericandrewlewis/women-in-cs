\connect ipeds;

WITH sums as (
SELECT
  CIPCODE,
  SUM(CTOTALT) as both,
  SUM(CTOTALM) as men,
  SUM(CTOTALW) as women
FROM completions
WHERE
  -- Bachelors Degrees
  AWLEVEL=5 AND
  -- Look at any Computer Science/Information Science-ish degree
  CIPCODE LIKE '11.%' AND
  -- Only look at students whose primary major is CS
  majornum = 1
GROUP BY CIPCODE
)


SELECT
  CIPCODE,
  TRUNC(
    CAST(sums.women as NUMERIC) / sums.both,
    2
   ) as percent_women
FROM sums;