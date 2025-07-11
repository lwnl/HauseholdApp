import express from "express";
import {
  getLebensmittelTypen,
  createLebensmittelTyp,
  updateLebensmittelTyp,
  deleteLebensmittelTyp,
} from "../controllers/lebensmittelTyp";
import { cookieTokenAuth } from "../middleware/cookieTokenAuth";

const router = express.Router();

router.get("/", cookieTokenAuth, getLebensmittelTypen);//改完
router.post("/", cookieTokenAuth, createLebensmittelTyp);//改完
router.put("/:id", cookieTokenAuth, updateLebensmittelTyp);
router.delete("/:id", cookieTokenAuth, deleteLebensmittelTyp);

export default router;
