const counter = require('./Counter');
const pool = require("./db");

const cron = require('node-cron');

const runCronJob = () => {
  cron.schedule('* * * * *', () => {
    const counterValue = counter.value;
    if (counterValue !== 0) {
      const insertQuery =
        'INSERT INTO counter (value, record_time) VALUES ($1, NOW())';
      const values = [counterValue];

      pool
        .query(insertQuery, values)
        .then(() => {
          console.log('Data inserted successfully');
          counter.setValue = 0;
        })
        .catch((error) => {
          console.error('Error inserting data:', error);
        });
    }
  });
};

module.exports = {
  runCronJob,
};
