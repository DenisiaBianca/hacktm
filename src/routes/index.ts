import express from "express";
import user from "./user";
import auth from "./auth";
import counter from "./counter";
import data from "./data";

const router = express.Router();

router.use("/user", user);
router.use("/auth", auth);
router.use("/counter", counter);
router.use("/data", data);

export default router;
