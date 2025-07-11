import type { Response } from "express";
import type { AuthRequest } from "../middleware/cookieTokenAuth";
import Notiz from "../models/Notiz";
import mongoose from "mongoose";

export const getNotizen = async (req: AuthRequest, res: Response) => {
  try {
    const notizen = await Notiz.find()
      .populate("owner", "userName")
      .sort({ createdAt: -1 });
    //console.log("Fetched Notizen:", notizen); // Yanıtı konsola yazdır

    res.json(notizen);
  } catch (error) {
    console.error("Detailed DB Error:", error);
    res.status(500).json({
      message: "Datenbankfehler beim Abrufen der Notizen",
      error: error instanceof Error ? error.message : "Unbekannter Fehler",
    });
  }
};

export const getNotizById = async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  try {
    const notiz = await Notiz.findById(id).populate("owner", "userName");
    if (!notiz) {
      res.status(404).json({ errorMessage: "Notiz nicht gefunden!" });
    } else {
      res.json({ notiz });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: `Datenbankfehler: ${error}!` });
  }
};

export const createNotiz = async (req: AuthRequest, res: Response) => {
  const { title, text } = req.body;
  const userID = req.user?.userId;
  if (!title || !text) {
    return res
      .status(400)
      .json({ errorMessage: "Titel und Text sind erforderlich" });
  }

  try {
    const newNotiz = new Notiz({ title, text, owner: userID });
    const savedNotiz = await newNotiz.save();
    const populatedNotiz = await Notiz.findById(savedNotiz._id).populate(
      "owner",
      "userName"
    );
    res.status(201).json(populatedNotiz);
  } catch (error) {
    console.error("Fehler beim Erstellen der Notiz:", error);
    res.status(500).json({
      errorMessage: `Datenbankfehler: ${
        error instanceof Error ? error.message : "Unbekannter Fehler"
      }`,
    });
  }
};

export const updateNotiz = async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  const { title, text } = req.body;
  const userID = req.user.userId;
  const notiz = await Notiz.findById(id);
  if (!notiz) {
    res.status(404).json({ errorMessage: "Notiz nicht gefunden!" });
  } else if (notiz.owner.toString() !== userID.toString()) {
    res.status(403).json({ errorMessage: "Das ist nicht deine Notiz!" });
  } else {
    if (!title && !text) {
      res.json({ notiz });
    } else if (!title) {
      notiz.text = text;
    } else if (!text) {
      notiz.title = title;
    } else {
      notiz.title = title;
      notiz.text = text;
    }
    try {
      const result = await notiz.save();
      res.json(result);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).json({ errorMessage: "Invalid Input!" });
      } else {
        res.status(500).json({ errorMessage: `Datenbankenfehler: ${error}!` });
      }
    }
  }
};

export const deleteNotiz = async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  const userID = req.user.userId;
  const notiz = await Notiz.findById(id);
  if (!notiz) {
    res.status(404).json({ errorMessage: "Notiz nicht gefunden!" });
  } else if (notiz.owner.toString() !== userID.toString()) {
    res.status(403).json({ errorMessage: "Das ist nicht deine Notiz!" });
  } else {
    try {
      const result = await notiz.deleteOne();
      res.json({ message: "Notiz erfolgreich gelöscht" });
    } catch (error) {
      res.status(500).json({ errorMessage: `Datenbankenfehler: ${error}!` });
    }
  }
};
