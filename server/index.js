'use strict'
const path = require('path')
const consola = require('consola')
const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio');
const Path = require('path');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes/index');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');
const mongoose = require('./mongoose');
const authentication = require('./authentication');

process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config/')

async function start() {
  const app = express(feathers());

  const { Nuxt, Builder } = require('nuxt')

  // Setup nuxt.js
  const config = require('../nuxt.config.js')
  config.rootDir = path.resolve(__dirname, '..')
  config.dev = process.env.NODE_ENV !== 'production'

  const nuxt = new Nuxt(config)
  await nuxt.ready()
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  const configuration = require('@feathersjs/configuration')
  app.configure(configuration())

  app.use(helmet());
  app.use(cors());
  app.use(compress());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/uploads', express.static(Path.join(__dirname, './uploads')));
  app.use('/', routes);
  // Set up Plugins and providers
  app.configure(express.rest());
  app.configure(socketio({
    path: '/apiws'
  }));
  app.configure(mongoose);
  app.configure(middleware);
  app.configure(authentication);
  // Set up our services (see `services/index.js`)
  app.configure(services);
  // Set up event channels (see channels.js)
  app.configure(channels);
  app.hooks(appHooks);
  app.configure(configuration()).use(nuxt.render)

  const host = app.get('host')
  const port = app.get('port')

  app.listen(process.env.PORT ||port)

  consola.ready({
    message: `Feathers application started on ${host}:${process.env.PORT ||port}`,
    badge: true
  })
}

start()
