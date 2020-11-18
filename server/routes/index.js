const express = require('express');
const router = express.Router();
const filtersService = require('./filtersService');
const statsService = require('./statsService');

// // Filter List routes
// router.get('/api/db/agentlist', (req, res) => {
//     filtersService.getAgentList(req,res);
// });

// router.get('/api/db/eventregionlist', (req, res) => {
//     filtersService.getEventRegionList(req,res);
// });

// router.get('/api/db/playerlist', (req, res) => {
//     filtersService.getPlayerList(req,res);
// });

// router.get('/api/db/playercountrylist', (req, res) => {
//     filtersService.getPlayerCountryList(req,res);
// });

// router.get('/api/db/teamregionlist', (req, res) => {
//     filtersService.getTeamRegionList(req,res);
// });

// router.get('/api/db/teamlist', (req, res) => {
//     filtersService.getTeamList(req,res);
// });

// router.get('/api/db/substagelist', (req, res) => {
//     filtersService.getSubstageList(req,res);
// });

// router.get('/api/db/playerregion', (req, res) => {
//     filtersService.getPlayerRegion(req,res);
// });


// // Stats routes
// router.post('/api/db/playerstats', (req, res) => {
//     statsService.getPlayerStats(req,res);
// });

// router.post('/api/db/teamstats', (req, res) => {
//     statsService.getTeamStats(req,res);
// });

// router.post('/api/db/agentstats', (req, res) => {
//     statsService.getAgentStats(req,res);
// });

// router.post('/api/db/mapstats', (req, res) => {
//     statsService.getMapStats(req,res);
// });
// router.post('/api/db/compostats', (req, res) => {
//     statsService.getCompoStats(req,res);
// });

module.exports=router;