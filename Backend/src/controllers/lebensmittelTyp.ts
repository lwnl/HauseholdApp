import type { Request, Response } from "express";
import LebensmittelTyp from "../models/LebensmittelTyp";
import type { AuthRequest } from "../middleware/cookieTokenAuth";

export const getLebensmittelTypen = async (req: AuthRequest, res: Response) => {
  try {
    const typen = await LebensmittelTyp.find({
      quelle: { $in: ['system', req.user.userId] }
    });
    res.json(typen);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching LebensmittelTypen", error });
  }
};

export const createLebensmittelTyp = async (req: AuthRequest, res: Response) => {
  try {
    // Önce aynı isim ve kategoride ürün var mı kontrol et
    const existingTyp = await LebensmittelTyp.findOne({
      name: req.body.name.toLowerCase(),
      category: req.body.category,
    });

    if (existingTyp) {
      return res.json(existingTyp);
    }

    // Yeni ürün oluştur
    const newTyp = new LebensmittelTyp({
      ...req.body,
      name: req.body.name.toLowerCase(),
      quelle: req.user.userId
    });
    await newTyp.save();
    res.status(201).json(newTyp);
  } catch (error) {
    console.error("Error in createLebensmittelTyp:", error); // 加这行
    res.status(400).json({ message: "Error creating LebensmittelTyp:" + (error as Error).message });
  }
};

export const updateLebensmittelTyp = async (req: Request, res: Response) => {
  try {
    const updatedTyp = await LebensmittelTyp.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTyp);
  } catch (error) {
    res.status(400).json({ message: "Error updating LebensmittelTyp", error });
  }
};

export const deleteLebensmittelTyp = async (req: Request, res: Response) => {
  try {
    await LebensmittelTyp.findByIdAndDelete(req.params.id);
    res.json({ message: "LebensmittelTyp deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting LebensmittelTyp", error });
  }
};
