const express = require('express');
const authRoutes = require('./auth.rest');
const warehouseRoutes = require('./warehouse.rest');
const userRoutes = require('./user.rest');
const KnowledgeRepositoryRoutes = require('./knowledgeRepository.rest');
const departmentRoutes = require('./department.rest');
const userProfileRoutes = require('./userProfile.rest');

class Route {
	loadRoutes(app) {
		const apiRouter = express.Router();

		authRoutes(apiRouter);
		warehouseRoutes(apiRouter);
		KnowledgeRepositoryRoutes(apiRouter);
		departmentRoutes(apiRouter);
		userProfileRoutes(apiRouter);

		userRoutes(apiRouter);
		app.use('/api', apiRouter);
		app.use("/apidocs", express.static("apidocs/doc"));
		app.use('/api/user', apiRouter);
	}
}

module.exports = new Route();
