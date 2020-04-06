const express = require('express');
const authRoutes = require('./auth.rest');
const userProfileRoutes = require('./userProfile.rest');
const masterDataRoutes = require('./master-data.rest');
const memberRoutes = require('./member.rest');

class Route {
	loadRoutes(app) {
		const apiRouter = express.Router();

		authRoutes(apiRouter);
		userProfileRoutes(apiRouter);
		masterDataRoutes(apiRouter);
		memberRoutes(apiRouter);

		app.use('/api', apiRouter);
		app.use("/apidocs", express.static("apidocs/doc"));
	}
}

module.exports = new Route();
