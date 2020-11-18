const users = require('./users/users.service.js');
const listings = require('./listings/listings.service.js');
const events = require('./events/events.service.js');
const news = require('./news/news.service.js');
const matches = require('./matches/matches.service.js');
const players = require('./players/players.service.js');
const teams = require('./teams/teams.service.js');
const comments = require('./comments/comments.service.js');
const forums = require('./forums/forums.service.js');
const playersUploads = require('./uploads/players.js')
const newsUploads = require('./uploads/news.js')
const teamsUploads = require('./uploads/teams.js')
const macthesUploads = require('./uploads/matches.js')
const eventsUploads = require('./uploads/events.js')
const mapsUploads = require('./uploads/maps.js')
const mailer = require('./mailer/mailer.service.js');
const authmanagement = require('./authManagement/authmanagement.service.js');
const playerstats = require('./playerstats/playerstats.service.js');
const playerstatstotal = require('./playerstatstotal/playerstatstotal.service.js');
const maps = require('./maps/maps.service.js');
const eventstats = require('./eventstats/eventstats.service.js');
const agents = require('./agents/agents.service.js');
const agentsUploads = require('./uploads/agents.js')
const gamemaps = require('./gamemaps/gamemaps.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(listings);
  app.configure(events);
  app.configure(news);
  app.configure(matches);
  app.configure(players);
  app.configure(teams);
  app.configure(comments);
  app.configure(forums);
  app.configure(playersUploads);
  app.configure(newsUploads);
  app.configure(teamsUploads);
  app.configure(eventsUploads);
  app.configure(macthesUploads);
  app.configure(mailer);
  app.configure(authmanagement);
  app.configure(playerstats);
  app.configure(playerstatstotal);
  app.configure(maps);
  app.configure(eventstats);
  app.configure(agents);
  app.configure(agentsUploads);
  app.configure(gamemaps);
  app.configure(mapsUploads);
};
