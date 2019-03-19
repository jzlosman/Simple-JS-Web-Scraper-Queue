require('dotenv').config();
const chalk = require('chalk');

/*
Configure queue and start worker
 */
const db = require('./db/db');
const queueManager = require('./queue/queueManager');
const topic = process.env.TOPIC || 'webscrapers';

queueManager.configQueue(topic).then((queue) => {
  queueManager.startWorker(topic)
}).catch((err) => {
  console.error('error making topic', err);
});

/*
Configure API routes and start server
 */
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const routes = require("./api/routes");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(routes);

app.listen(port, () => {
  console.log(chalk.green.bold(`** Website Scraper Queue Demo **`));
  console.log(chalk.green(`Make POST request with ` + chalk.bold(`url`) + ` param to `) + chalk.bold(`http://127.0.0.1:${port}`));
})
