import express from "express";
import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";

const router = express.Router();

router.get("/status", (req, res, next) => {
  res.json({
    status: "ok",
    message: "Api Server is running",
    nodeVersion: process?.versions?.node,
  });
});

router.use("/auth", authRoute);
router.use("/users", userRoute);

export default router;
