const express = require('express')
const YAML = require('yamljs')

const serverlessExpress = require('@vendia/serverless-express');
const { getCurrentInvoke } = require('@vendia/serverless-express')

const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument =  YAML.load('./swagger.yml');

app.use((req, res, next) => {
  const currentInvoke = getCurrentInvoke()
  console.log("event")
  const { event = {} } = currentInvoke
  console.log(JSON.stringify(currentInvoke.event));
  next();
});

const pathVar = process.env.stage == "dev_local" ? "/docs" : `/${process.env.stage}/docs`;
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(`/${process.env.stage}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));


module.exports.handler = new serverlessExpress({app});