import type { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: any;
}

export const cookieTokenAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Token aus den Cookies extrahieren
    const token = req.cookies?.token; // Angenommen, dein Token ist im "token"-Feld der Cookies gespeichert
    if (!token) {
      return res
        .status(401)
        .json({ message: "Kein Token bereitgestellt. Bitte anmelden." });
    }

    // Token verifizieren
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next()
  } catch (error) {
    res.status(401).json({ message: "Ungültiges oder abgelaufenes Token." });
  }
};