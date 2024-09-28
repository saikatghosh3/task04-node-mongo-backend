import express from "express";
import { isActiveUser } from "../middlewares/isActiveUser.js";
import controller from "../controllers/userController.js";
import trimRequest from "trim-request";

import schemas from "../validations/userValidations.js";

const router = express.Router();

router
  .route("/status")
  .patch(trimRequest.all, isActiveUser, controller.bulkUsersStatusUpdate);

router.route("/:id").get(trimRequest.all, isActiveUser, controller.getUserInfo);

router.route("/").get(trimRequest.all, isActiveUser, controller.getUsers);
router
  .route("/")
  .delete(trimRequest.all, isActiveUser, controller.deleteBulkUsers);

export default router;
