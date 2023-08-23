const counter = require('./Counter');
const pool = require("./db");

const cron = require('node-cron');

const runCronJob = () => {
  cron.schedule('* * * * *', () => {
    const counterValue = counter.value;
    console.log({ counterValue });
    if (counterValue !== 0) {
      console.log('if');
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

    console.log('Cron job running every minute');
  });
};

module.exports = {
  runCronJob,
};
