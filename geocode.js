const fetch = require('node-fetch');
const Sequelize = require('sequelize');
const bySchool = require('./by_school.json');
const fs = require('fs').promises;
const url = `postgres://127.0.0.1:5432/ipeds`;
const sequelize = new Sequelize(url, {});

const geocodingUrl = address => {
  return `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyB4lkdvBJZaSV1bknMoC0IcZ4hrVQ2suKU`;
} //
(async () => {
  const DapipData = sequelize.define('DapipData', {
    dapipid: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    opeid: Sequelize.STRING,
    ipedsunitids: Sequelize.STRING,
    locationname: Sequelize.STRING,
    parentname: Sequelize.STRING,
    parentdapipid: Sequelize.STRING,
    locationtype: Sequelize.STRING,
    address: Sequelize.STRING,
    generalphone: Sequelize.STRING,
    adminname: Sequelize.STRING,
    adminphone: Sequelize.STRING,
    adminemail: Sequelize.STRING,
    fax: Sequelize.STRING,
    updatedate: Sequelize.STRING
  }, {
    tableName: 'dapip_data',
    timestamps: false,
  });

  const UnitIdLocations = sequelize.define('UnitIdLocations', {
    ipedsunitids: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    lat: Sequelize.STRING,
    lng: Sequelize.STRING,
  }, {
    tableName: 'unit_id_locations',
    timestamps: false,
  })
  sequelize.sync();

  console.log(bySchool.length);
  let done = 0;
  for (school of bySchool) {
    const location = await DapipData.findOne({
      where: {
        ipedsunitids: school.unitid.toString()
      }
    });
    // Wrap in a try in case accessing any properties goes awry
    // in the geocoding response inspection.
    try {
      const response = await fetch(geocodingUrl(
          location.get('address')
      ))
      const body = await response.json();
      school.lat = body.results[0].geometry.location.lat;
      school.lng = body.results[0].geometry.location.lng;
    } catch(e) {
      console.log('Error: ' + e);
      continue;
    }
    done++;
    console.log(`Done ${done}`)
  }
  await fs.writeFile(__dirname + '/by_school2.json', JSON.stringify(bySchool));
  process.exit();
})();