const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const Path = require('path');


const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const authentication = require('./authentication');

const mongoose = require('./mongoose');

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// app.use(require('prerender-node'));
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/uploads', express.static(Path.join(__dirname, './uploads')));
// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio({
    path: '/apiws'
  }));
app.configure(mongoose);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);
// app.use(express.static(__dirname + '/public'))
// app.get(/.*/,(req,res)=>res.sendFile(__dirname + '/public/index.html'));
// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);


module.exports = app;
