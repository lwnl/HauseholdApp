import express from "express";
import { cookieTokenAuth } from "../middleware/cookieTokenAuth";

import {
  getEinkaufsliste,
  createEinkaufsliste,
  updateEinkaufsliste,
  deleteEinkaufsliste,
} from "../controllers/einkaufliste";

const router = express.Router();

router.get("/", cookieTokenAuth, getEinkaufsliste); //改完
router.post("/", cookieTokenAuth, createEinkaufsliste); //改完
router.put("/:id", cookieTokenAuth, updateEinkaufsliste);
router.delete("/:id", cookieTokenAuth, deleteEinkaufsliste);

export default router;
