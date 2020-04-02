const express = require('express');
const authRoutes = require('./auth.rest');
const userRoutes = require('./user.rest');
const userProfileRoutes = require('./userProfile.rest');
const masterDataRoutes = require('./master-data.rest');

class Route {
	loadRoutes(app) {
		const apiRouter = express.Router();

		authRoutes(apiRouter);
		userProfileRoutes(apiRouter);
		masterDataRoutes(apiRouter);
		userRoutes(apiRouter);
		app.use('/api', apiRouter);
		app.use("/apidocs", express.static("apidocs/doc"));
		app.use('/api/user', apiRouter);
	}
}

module.exports = new Route();
