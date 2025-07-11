import express from "express";
import {
  getLebensmittel,
  createLebensmittel,
  updateLebensmittel,
  deleteLebensmittel,
} from "../controllers/lebensmittel";

import { cookieTokenAuth } from "../middleware/cookieTokenAuth";


// Apply cookieTokenAuth to all routes

const router = express.Router();
router.use(cookieTokenAuth);

router.get("/", getLebensmittel);
router.post("/", createLebensmittel);
router.put("/:id", updateLebensmittel);
router.delete("/:id", deleteLebensmittel);

export default router;
