const express = require('express');
const { runCronJob } = require('./saveToDbCronJob');
const routes = require('./routes/index');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 8888;

runCronJob();

app.use(express.json());

app.use(cors());

app.use(express.static('public'));

for (const route of routes) {
  app.use(route);
}

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
