import type { Request, Response, NextFunction } from "express";
import Notiz from "../models/Notiz";
import type { AuthRequest } from "./cookieTokenAuth";

export const deleteUserNotes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    await Notiz.deleteMany({ owner: userId });

    next();
  } catch (error) {
    console.error("Fehler beim Löschen der Notizen:", error);
    res.status(500).json({ message: "Fehler beim Löschen der Notizen" });
  }
};
