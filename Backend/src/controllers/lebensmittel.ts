import type { Request, Response } from "express";
import Lebensmittel from "../models/Lebensmittel";
import LebensmittelTyp from "../models/LebensmittelTyp";
import type { ILebensmittel } from "../models/Lebensmittel";
import type { ILebensmittelTyp } from "../models/LebensmittelTyp";
import type { AuthRequest } from "../middleware/cookieTokenAuth";

export const getLebensmittel = async (req: AuthRequest, res: Response) => {
  try {
    const lebensmittel = await Lebensmittel.find({
      owner: req.user.userId
    }).populate<{
      typ: ILebensmittelTyp;
    }>("typ");
    res.json(lebensmittel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Lebensmittel", error });
  }
};

export const createLebensmittel = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, einheit, expirationDate, preis, menge } = req.body;

    let lebensmittelTyp = await LebensmittelTyp.findOne({
      name: name.toLowerCase(),
      category,
    });

    if (!lebensmittelTyp) {
      lebensmittelTyp = new LebensmittelTyp({
        name: name.toLowerCase(),
        category,
        einheit,
        menge: 1,
        quelle: req.user.userId,
      });
      await lebensmittelTyp.save();
    }

    const newLebensmittel = new Lebensmittel({
      typ: lebensmittelTyp._id,
      owner: req.user.userId,
      status: "neu",
      expirationDate,
      purchaseDate: new Date(),
      preis,
      menge,
    });

    await newLebensmittel.save();
    const populatedLebensmittel = await newLebensmittel.populate<{
      typ: ILebensmittelTyp;
    }>("typ");
    res.status(201).json(populatedLebensmittel);
  } catch (error) {
    console.error("Error creating Lebensmittel:", error);
    res.status(400).json({ message: "Error creating Lebensmittel", error });
  }
};

export const updateLebensmittel = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle creating new "verbraucht" item
    if (id.endsWith("_new")) {
      const baseId = id.replace("_new", "");
      const originalItem = await Lebensmittel.findById(baseId).populate<{
        typ: ILebensmittelTyp;
      }>("typ");

      if (!originalItem) {
        return res
          .status(404)
          .json({ message: "Original Lebensmittel not found" });
      }

      // Check quantities
      const requestedAmount = updateData.menge || 1;
      if (requestedAmount > originalItem.menge) {
        return res.status(400).json({
          message: "Requested amount exceeds available amount",
        });
      }

      // Create new "verbraucht" item
      const newItem = new Lebensmittel({
        typ: originalItem.typ._id,
        owner: req.user.userId,
        status: "verbraucht",
        expirationDate: originalItem.expirationDate,
        purchaseDate: originalItem.purchaseDate,
        preis: originalItem.preis,
        menge: requestedAmount,
      });

      await newItem.save();

      // Update original item's quantity
      originalItem.menge -= requestedAmount;

      if (originalItem.menge <= 0) {
        await Lebensmittel.findByIdAndDelete(baseId);
      } else {
        await originalItem.save();
      }

      const populatedNewItem = await newItem.populate<{
        typ: ILebensmittelTyp;
      }>("typ");
      return res.json(populatedNewItem);
    }

    // Regular update
    const updatedLebensmittel = await Lebensmittel.findByIdAndUpdate(
      id,
      { ...updateData, lastModified: new Date() },
      { new: true }
    ).populate<{ typ: ILebensmittelTyp }>("typ");

    if (!updatedLebensmittel) {
      return res.status(404).json({ message: "Lebensmittel not found" });
    }

    res.json(updatedLebensmittel);
  } catch (error) {
    console.error("Error updating Lebensmittel:", error);
    res.status(400).json({ message: "Error updating Lebensmittel", error });
  }
};

export const deleteLebensmittel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const amount = req.query.amount
      ? parseInt(req.query.amount as string)
      : null;

    // Find the item to delete
    const item = await Lebensmittel.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Lebensmittel not found" });
    }

    // If amount is specified and it's less than the total amount, update the quantity
    if (amount && amount < item.menge) {
      item.menge -= amount;
      await item.save();
      return res.json({
        message: "Lebensmittel partially deleted successfully",
      });
    }

    // Otherwise, delete the entire item
    await Lebensmittel.findByIdAndDelete(id);
    res.json({ message: "Lebensmittel deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting Lebensmittel", error });
  }
};
