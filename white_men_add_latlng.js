const fs = require('fs').promises;

const getFileJson = async (path) => {
  const raw = await fs.readFile(path)
  return JSON.parse(raw);
}

(async () => {
  const whitemenjson = await getFileJson(__dirname + '/white_men_by_school.json')
  const byschool2json = await getFileJson(__dirname + '/by_school2.json')
  for (school of whitemenjson) {
    const a = byschool2json.find(a => a.unitid == school.unitid)
    if (!a) {
      continue;
    }
    school.lat = a.lat
    school.lng = a.lng
  }
  await fs.writeFile(__dirname + '/white_men_by_school_2.json', JSON.stringify(whitemenjson));
  process.exit()
})()