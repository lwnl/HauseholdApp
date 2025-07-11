import express from "express";
import {
  getNotizen,
  getNotizById,
  createNotiz,
  updateNotiz,
  deleteNotiz,
} from "../controllers/notizController";
import { cookieTokenAuth } from "../middleware/cookieTokenAuth";

const router = express.Router();

// Endpunkte für Notizen:
router.get("/", cookieTokenAuth, getNotizen);
router.get("/:id", cookieTokenAuth, getNotizById);
router.post("/", cookieTokenAuth, createNotiz);
router.patch("/:id", cookieTokenAuth, updateNotiz);
router.delete("/:id", cookieTokenAuth, deleteNotiz);

export default router;
