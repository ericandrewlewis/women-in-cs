const Sequelize = require('sequelize');
const fs = require('fs').promises;
const parseCSV = require('csv-parse');


(async () => {
  const data = await fs.readFile(__dirname + '/CIPCode2010.csv', 'utf8');
  parseCSV(data, (err, rows) => {
    console.log(err);
  });
  // const url = `postgres://127.0.0.1:5432/ipeds`;

  // const sequelize = new Sequelize(url, {});

  // const csvWriter = createCsvWriter({
  //     path: __dirname + '/data.csv',
  //     header: [
  //         {id: 'date', title: 'DATE'},
  //         {id: 'price', title: 'PRICE'},
  //         {id: 'sectionName', title: 'SECTION NAME'},
  //     ],
  //     append: true,
  // });

  // const User = sequelize.define('User', {
  //   name: Sequelize.STRING,
  //   email: Sequelize.STRING
  // }, {});
  // User.sync({force: true});
})();
