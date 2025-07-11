import type { Request, Response } from "express";
import Einkaufsliste from "../models/Einkauflist";
import Lebensmittel from "../models/Lebensmittel";
import LebensmittelTyp from "../models/LebensmittelTyp";
import type { AuthRequest } from "../middleware/cookieTokenAuth";

export const getEinkaufsliste = async (req: AuthRequest, res: Response) => {
  try {
    const lists = await Einkaufsliste.find({
      owner: req.user.userId
    })
    console.log("Fetched Einkaufliste: ", lists);
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Einkaufsliste", error });
  }
};

export const createEinkaufsliste = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;

    const { name, liste, note } = req.body;
    // console.log('liste:', liste)
    const lebensmittelTyps = await LebensmittelTyp.find()
    // console.log('lebensmittelTyps:',lebensmittelTyps)

    // Process each item and preserve quantities
    const processedItems = await Promise.all(
      liste.map(async (item: any) => {
        let typ = await LebensmittelTyp.findOne({
          name: item.name,
          category: item.category,
        });

        if (!typ) {
          throw new Error(`Typ not found for item: ${item.name}`);
        }

        // if (!typ) {
        //   typ = new LebensmittelTyp({
        //     name: item.name.toLowerCase(),
        //     category: item.category,
        //     einheit: item.einheit,
        //     menge: 1,
        //     quelle: userId
        //   });
        //   await typ.save();
        // }

        // Return the item with its original quantity and name
        return {
          typ: typ._id,
          name: item.name,
          menge: parseInt(item.menge) || 1,
          einheit: item.einheit || typ.einheit,
          category: item.category,
        };
      })
    );

    const newList = new Einkaufsliste({
      name,
      liste: processedItems,
      owner: userId,
      note,
    });

    await newList.save();
    const populatedList = await Einkaufsliste.findById(newList._id)
      .populate("owner", "userName")
      .populate("liste.typ");
    console.log("Created Einkaufsliste:", populatedList);
    res.status(201).json(populatedList);
  } catch (error) {
    console.error("Error creating Einkaufsliste:", error);
    res.status(400).json({ message: "Error creating Einkaufsliste", error });
  }
};

export const updateEinkaufsliste = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { selectedItems } = req.body;

    const list = await Einkaufsliste.findById(id).populate({
      path: "liste.typ",
      model: "LebensmittelTyp",
    });

    if (!list) {
      return res.status(404).json({ message: "Einkaufsliste not found" });
    }

    // Get selected items
    const itemsToTransfer = list.liste.filter((item: any) =>
      selectedItems.includes(item._id.toString())
    );

    // Create new Lebensmittel entries for selected items
    for (const item of itemsToTransfer) {
      const newLebensmittel = new Lebensmittel({
        typ: item.typ._id,
        status: "neu",
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        purchaseDate: new Date(),
        menge: item.menge || 1,
        owner: req.user.userId,
      });
      await newLebensmittel.save();
    }

    // Remove transferred items from the list
    list.liste = list.liste.filter(
      (item: any) => !selectedItems.includes(item._id.toString())
    );

    if (list.liste.length === 0) {
      await Einkaufsliste.findByIdAndDelete(id);
      return res.json({ message: "Shopping list completed and deleted" });
    }

    list.lastModified = new Date();
    await list.save();

    const updatedList = await Einkaufsliste.findById(id).populate("liste.typ");
    res.json(updatedList);
  } catch (error) {
    console.error("Error updating Einkaufsliste:", error);
    res.status(400).json({ message: "Error updating Einkaufsliste", error });
  }
};

export const deleteEinkaufsliste = async (req: AuthRequest, res: Response) => {
  try {
    await Einkaufsliste.findByIdAndDelete(req.params.id);
    res.json({ message: "Einkaufsliste deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting Einkaufsliste", error });
  }
};
