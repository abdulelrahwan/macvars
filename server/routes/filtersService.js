const Pool = require('pg').Pool
const pool = new Pool({
  user: 'analytics_reader',
  host: 'db-postgresql-nyc1-12251-do-user-6079734-0.a.db.ondigitalocean.com',
  database: 'valorantify_analytics',
  password: 'Val0rantify',
  port: 25060,
  ssl: true,
  ssl: {
    rejectUnauthorized: false
  }
})



function getAgentList(req, res) {
  pool.query('SELECT id, oid, agent FROM public.get_agent_list()', (error, results) => {
    if (error) {
      return res.status(400).send({
        message: error
      });
    }
    res.status(200).json(results.rows)
  })
};

function getEventList(req, res) {
  pool.query('SELECT id, oid, event FROM public.get_event_list()', (error, results) => {
    if (error) {
      return res.status(400).send({
        message: error
      });
    }
    res.status(200).json(results.rows)
  })
};

function getEventRegionList(req, res) {
  pool.query('SELECT id, region FROM public.get_event_region_list()', (error, results) => {
    if (error) {
      return res.status(400).send({
        message: error
      });
    }
    res.status(200).json(results.rows)
  })
};

function getPlayerList(req, res) {
  pool.query('SELECT id, oid, player FROM public.get_player_list()', (error, results) => {
    if (error) {
      return res.status(400).send({
        message: error
      });
    }
    res.status(200).json(results.rows)
  })
};

function getPlayerCountryList(req, res) {
  pool.query('SELECT id, country, country_code FROM public.get_player_country_list()', (error, results) => {
    if (error) {
      return res.status(400).send({
        message: error
      });
    }
    res.status(200).json(results.rows)
  })
};

function getPlayerRegion(req, res) {
  pool.query('SELECT id, region FROM public.get_player_region_list()', (error, results) => {
    if (error) {
      return res.status(400).send({
        message: error
      });
    }
    res.status(200).json(results.rows)
  })
};

function getSubstageList(req, res) {
  pool.query('SELECT id, substage FROM public.get_substage_list()', (error, results) => {
    if (error) {
      return res.status(400).send({
        message: error
      });
    }
    res.status(200).json(results.rows)
  })
};

function getTeamList(req, res) {
  pool.query('SELECT id, oid, team FROM public.get_team_list()', (error, results) => {
    if (error) {
      return res.status(400).send({
        message: error
      });
    }
    res.status(200).json(results.rows)
  })
};

function getTeamRegionList(req, res) {
  pool.query('SELECT id, region FROM public.get_team_region_list()', (error, results) => {
    if (error) {
      return res.status(400).send({
        message: error
      });
    }
    res.status(200).json(results.rows)
  })
};



module.exports = {
  getAgentList,
  getEventList,
  getEventRegionList,
  getPlayerList,
  getPlayerCountryList,
  getTeamRegionList,
  getTeamList,
  getSubstageList,
  getPlayerRegion
};