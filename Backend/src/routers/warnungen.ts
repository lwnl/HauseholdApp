import express from "express";
import {
  getWarnungen,
  createWarnung,
  checkWarnungen,
  resolveWarnung,
  deleteWarnung,
} from "../controllers/warnungen";
import { cookieTokenAuth } from "../middleware/cookieTokenAuth";

const router = express.Router();
router.use(cookieTokenAuth)

router.get("/", getWarnungen);
router.post("/", createWarnung);
router.post("/check", checkWarnungen);
router.put("/:id/resolve", resolveWarnung);
router.delete("/:id", deleteWarnung);

export default router;
