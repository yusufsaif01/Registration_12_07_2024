const { checkAuthToken } = require("../middleware/auth");
const responseHandler = require("../ResponseHandler");
const errors = require("../errors");
const RESPONSE_MESSAGE = require("../constants/ResponseMessage");
const PlayerDocumentsService = require("../services/PlayerDocumentsService");
const PlayerDocumentsResponseMapper = require("../dataModels/responseMapper/PlayerDocumentsResponseMapper");
const updateStatusValidator = require("../middleware/validators/player-documents/updateStatusValidator");

const playerDocInst = new PlayerDocumentsService();

module.exports = (router) => {
  router.get("/player/:user_id/documents", checkAuthToken, async (req, res) => {
    let { user_id } = req.params;

    responseHandler(
      req,
      res,
      Promise.resolve(
        PlayerDocumentsResponseMapper.map(
          await playerDocInst.getUserDocuments(user_id)
        )
      )
    );
  });

  router.put(
    "/player/:user_id/documents/status",
    checkAuthToken,
    updateStatusValidator.addUpdateStatusValidator,
    async (req, res) => {
      let { user_id } = req.params;

      let { status, remarks } = req.body;

      responseHandler(
        req,
        res,
        Promise.resolve(playerDocInst.updateDocumentStatus(user_id, status, remarks))
      );
    }
  );
};
