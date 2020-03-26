const express = require('express');
const authRoutes = require('./auth.rest');
const userRoutes = require('./user.rest');
const userProfileRoutes = require('./userProfile.rest');

class Route {
	loadRoutes(app) {
		const apiRouter = express.Router();

		authRoutes(apiRouter);
		userProfileRoutes(apiRouter);

		userRoutes(apiRouter);
		app.use('/api', apiRouter);
		app.use("/apidocs", express.static("apidocs/doc"));
		app.use('/api/user', apiRouter);
	}
}

module.exports = new Route();
