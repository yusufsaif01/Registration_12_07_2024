const express = require('express');
const authRoutes = require('./auth.rest');
const userProfileRoutes = require('./userProfile.rest');
const locationRoutes = require('./location.rest');
const memberRoutes = require('./member.rest');
const memberTypeRoutes = require('./member-type.rest');
const achievementRoutes = require('./achievement.rest');
const playerSpecializationRoutes = require('./player-specialization.rest');
const connectionsRoutes = require('./connections.rest');
const postRoutes = require('./post.rest');
const playerDocuments = require('./player-documents.rest');
const clubAcademyDocuments = require('./club-academy-documents.rest');
const footplayerRoutes = require('./footplayer.rest');

class Route {
	loadRoutes(app) {
		const apiRouter = express.Router();

		authRoutes(apiRouter);
		userProfileRoutes(apiRouter);
		locationRoutes(apiRouter);
		memberRoutes(apiRouter);
		memberTypeRoutes(apiRouter);
		achievementRoutes(apiRouter);
		playerSpecializationRoutes(apiRouter);
		connectionsRoutes(apiRouter);
		postRoutes(apiRouter);
		playerDocuments(apiRouter);
		clubAcademyDocuments(apiRouter);
		footplayerRoutes(apiRouter);

		app.use('/api', apiRouter);
		app.use("/apidocs", express.static("apidocs/doc"));
		app.use("/uploads", express.static("uploads"));
	}
}

module.exports = new Route();
