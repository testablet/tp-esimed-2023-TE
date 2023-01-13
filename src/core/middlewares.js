const express = require('express');
const { DateTime } = require('luxon');
const sequelize = require('sequelize');
const { expressjwt: jwt } = require("express-jwt");
const router = express.Router();

const initJsonHandlerMiddlware = (app) => app.use(express.json());

const initStacticMiddlwares = (app) => {
  app.use(express.static('public'));
}

const initJwtMiddlwares = (app) => {
  app.use(
    jwt({
      secret: "secretKey",
      algorithms: ["HS256"],
    }).unless({ path: [{url: "/users", methods: ["POST"]},"/auth/login"] })
  );
}
const { Sequelize, DataTypes } = require('sequelize');

router.get('/test-sqlite', async (req, res) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
  });

  await User.sync()

  const jane = await User.create({
    firstName : 'Teddy',
    lastName: 'ESTABLET',
    password: '#P@ssw0rD'
  });

  const users = await User.findAll();

  res.send(users)
});

const initLoggerMiddlware = (app) => {
  app.use((req, res, next) => {
    const begin = new DateTime(new Date());

    res.on('finish', () => {
      const requestDate = begin.toString();
      const remoteIP = `IP: ${req.connection.remoteAddress}`;
      const httpInfo = `${req.method} ${req.baseUrl || req.path}`;

      const end = new DateTime(new Date());
      const requestDurationMs = end.diff(begin).toMillis();
      const requestDuration = `Duration: ${requestDurationMs}ms`;

      console.log(`[${requestDate}] - [${remoteIP}] - [${httpInfo}] - [${requestDuration}]`);
    })
    next();
  });
};

exports.initializeConfigMiddlewares = (app) => {
  initJsonHandlerMiddlware(app);
  initLoggerMiddlware(app);
  initStacticMiddlwares(app);
  initJwtMiddlwares(app);
}

exports.initializeErrorMiddlwares = (app) => {
  app.use((err, req, res, next) => {
    res.status(500).send(err.message);
  });
}