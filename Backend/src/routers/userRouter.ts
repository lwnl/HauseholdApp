import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { rm } from "node:fs/promises";
import path from "node:path";
import { profilePath } from "../scripts/dataPath";
import { profilePicUpload } from "../scripts/multerInit";
import { cookieTokenAuth } from "../middleware/cookieTokenAuth";
import validateFile, { type AuthRequest } from "../middleware/validateFile";
import { deleteUserNotes } from "../middleware/deleteUserNotes";

const userRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET as string;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION as string;

// check login
userRouter.get(
  "/auth/check",
  cookieTokenAuth,
  async (req: AuthRequest, res) => {
    res.status(200).json({
      message: "Benutzer bereits angemeldet!",
    });
  }
);


userRouter.post(
  "/register",
  // @ts-ignore
  profilePicUpload.single("profilePicture"),
  validateFile("profile"),
  async (req: AuthRequest, res) => {
    const { userName, email, password } = req.body;
    console.log(userName, email, password);

    // Wenn Benutzername, E-Mail oder Passwort fehlen, wird ein Fehler zurückgegeben
    if (!userName || !email || !password) {
      if (req.fileName && req.smallFileName) {
        await rm(path.join(profilePath, req.fileName));
        await rm(path.join(profilePath, req.smallFileName));
      }
      return res
        .status(400)
        .json({ message: "Alle Felder sind erforderlich." });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      if (req.fileName && req.smallFileName) {
        await rm(path.join(profilePath, req.fileName));
        await rm(path.join(profilePath, req.smallFileName));
      }
      return res.status(400).json({
        message: "Diese E-Mail-Adresse wird bereits verwendet.",
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        userName,
        email,
        password: hashedPassword,
        ...(req.fileName && { profilePicture: req.fileName }),
        ...(req.smallFileName && { profilePicture_ss: req.smallFileName }),
      });

      await user.save();
      res.status(201).json({
        message: "Benutzerregistrierung erfolgreich",
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Benutzerregistrierung Error:", errorMessage);
      if (req.fileName && req.smallFileName) {
        await rm(path.join(profilePath, req.fileName));
        await rm(path.join(profilePath, req.smallFileName));
      }
      res.status(500).json({
        message: errorMessage,
      });
    }
  }
);

// user login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "E-Mail und Passwort sind erforderlich." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "E-Mail-Adresse nicht gefunden." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Falsches Passwort." });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: parseInt(TOKEN_EXPIRATION) * 3600,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: parseInt(TOKEN_EXPIRATION) * 3600 * 1000,
    sameSite: "strict",
  });

  res.json({
    message: "Erfolgreich login",
    user,
  });
});

// user logout
userRouter.post("/logout", cookieTokenAuth, async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.json({
      message: "Erfolgeich abgemeldet",
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Benutzerlogout Error:", errorMessage);
    res.status(500).json({
      message: errorMessage,
    });
  }
});

// Benutzerinformationen aktualisieren
userRouter.patch(
  "/update",
  cookieTokenAuth,
  // @ts-ignore
  profilePicUpload.single("profilePicture"),
  validateFile("profile"),
  async (req: AuthRequest, res) => {
    const { userId } = req.user;
    const { userName, email, password } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        if (req.fileName && req.smallFileName) {
          await rm(path.join(profilePath, req.fileName));
          await rm(path.join(profilePath, req.smallFileName));
        }
        return res.status(404).json({ message: "Benutzer nicht gefunden." }); // Benutzer nicht gefunden
      }
      //update email wenn vorhanden
      if (email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          if (req.fileName && req.smallFileName) {
            await rm(path.join(profilePath, req.fileName));
            await rm(path.join(profilePath, req.smallFileName));
          }
          return res.status(400).json({
            message: "Diese E-Mail-Adresse wird bereits verwendet.",
          });
        }
        user.email = email;
      }

      //update password wenn vorhanden
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      //update userName wenn vorhanden
      if (userName) {
        user.userName = userName;
      }

      if (req.fileName && req.smallFileName) {
        if (
          user.profilePicture !== "00000000-0000-0000-0000-000000000000.avif"
        ) {
          await rm(path.join(profilePath, user.profilePicture));
          await rm(path.join(profilePath, user.profilePicture_ss));
        }
        user.profilePicture = req.fileName;
        user.profilePicture_ss = req.smallFileName;
      }

      await user.save();
      res.status(200).json({
        message: "Benutzerinformationen erfolgreich aktualisiert.",
        user,
      });
    } catch (error) {
      if (req.fileName) {
        await rm(path.join(profilePath, req.fileName));
      }
      const errorMessage = (error as Error).message;
      console.error(
        "Fehler beim Aktualisieren der Benutzerinformationen:",
        errorMessage
      );
      res.status(500).json({
        message: errorMessage,
      });
    }
  }
);

// alle user anzeigen, nur für admin user
userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("notiz").populate("einkaufslist");
    // const users = await User.find()
    if (users.length === 0) {
      return res.json({
        message: "Keine Benutzer",
      });
    }
    res.status(200).json({ users });
  } catch (error) {
    console.error("", error);
    res.status(500).json({
      message: "Beim Abrufen der Benutzerdaten ist ein Fehler aufgetreten",
    });
  }
});

userRouter.get("/profile", cookieTokenAuth, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden." });
    }
    res.status(200).json({ user });
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Fehler beim Abrufen des Benutzerprofils:", errorMessage);
  }
});

// Benutzerkonto löschen
userRouter.delete(
  "/delete",
  cookieTokenAuth,
  deleteUserNotes,
  async (req: AuthRequest, res) => {
    const { userId } = req.user;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Benutzer nicht gefunden." });
      }

      if (
        user.profilePicture &&
        user.profilePicture !== "00000000-0000-0000-0000-000000000000.avif"
      ) {
        await rm(path.join(profilePath, user.profilePicture));
        await rm(path.join(profilePath, user.profilePicture_ss));
      }

      await user.deleteOne({ _id: userId });
      res.status(200).json({ message: "Benutzerkonto erfolgreich gelöscht." });
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Fehler beim Löschen des Benutzerkontos:", errorMessage);
      res.status(500).json({
        message: errorMessage,
      });
    }
  }
);
export default userRouter;
