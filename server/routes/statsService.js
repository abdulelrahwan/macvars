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



function getPlayerStats(req, res) {
    let queries = "";
    if (req.body.queries != undefined) {
        queries = req.body.queries;
    }
    let filters = "";
    if (req.body.filters != undefined) {
        filters = req.body.filters;
    }
    pool.query(`SELECT * FROM public.get_player_stats(${filters}) ${queries.replace(/'/g, '"')}`, (error, results) => {
        if (error) {
            return res.status(400).send({
                message: error
            });
        }
        res.status(200).json(results.rows)
    })
};

function getTeamStats(req, res) {
    let queries = "";
    if (req.body.queries != undefined) {
        queries = req.body.queries;
    }
    let filters = "";
    if (req.body.filters != undefined) {
        filters = req.body.filters;
    }
    pool.query(`SELECT * FROM public.get_team_stats(${filters}) ${queries.replace(/'/g, '"')}`, (error, results) => {
        if (error) {
            return res.status(400).send({
                message: error
            });
        }
        res.status(200).json(results.rows)
    })
};

function getAgentStats(req, res) {
    let queries = "";
    if (req.body.queries != undefined) {
        queries = req.body.queries;
    }
    let filters = "";
    if (req.body.filters != undefined) {
        filters = req.body.filters;
    }
    pool.query(`SELECT * FROM public.get_agent_stats(${filters}) ${queries.replace(/'/g, '"')}`, (error, results) => {
        if (error) {
            return res.status(400).send({
                message: error
            });
        }
        res.status(200).json(results.rows)
    })
};

function getMapStats(req, res) {
    let queries = "";
    if (req.body.queries != undefined) {
        queries = req.body.queries;
    }
    let filters = "";
    if (req.body.filters != undefined) {
        filters = req.body.filters;
    }
    pool.query(`SELECT * FROM public.get_map_stats(${filters}) ${queries.replace(/'/g, '"')}`, (error, results) => {
        if (error) {
            return res.status(400).send({
                message: error
            });
        }
        res.status(200).json(results.rows)
    })
};

function getCompoStats(req, res) {
    let queries = "";
    if (req.body.queries != undefined) {
        queries = req.body.queries;
    }
    let filters = "";
    if (req.body.filters != undefined) {
        filters = req.body.filters;
    }
    pool.query(`SELECT * FROM public.get_compo_stats(${filters}) ${queries.replace(/'/g, '"')}`, (error, results) => {
        if (error) {
            return res.status(400).send({
                message: error
            });
        }
        res.status(200).json(results.rows)
    })
};

module.exports = {
    getPlayerStats,
    getTeamStats,
    getAgentStats,
    getMapStats,
    getCompoStats
};