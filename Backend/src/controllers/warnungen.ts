import type { Request } from "express";
import type { Response } from "express";
import Warnung from "../models/Warnung";
import type { AuthRequest } from "../middleware/cookieTokenAuth";
import { aF } from "vitest/dist/chunks/reporters.QZ837uWx.js";

export const getWarnungen = async (req: AuthRequest, res: Response) => {
  try {
    const warnungen = await Warnung.find({
      owner: req.user.userId,
    })
      .populate("relatedItemId")
      .sort({ createdAt: -1 });

    // 找出relatedItemId为空的warnungen（即关联的Lebensmittel已不存在）
    const invalidWarnungen = warnungen.filter(
      (warnung) => !warnung.relatedItemId
    );

    // 删除这些无效的warnungen
    const deletionPromises = invalidWarnungen.map((warnung) =>
      Warnung.findByIdAndDelete(warnung._id)
    );
    await Promise.all(deletionPromises);

    // 返回剩下的有效warnungen
    const validWarnungen = warnungen.filter(
      (warnung) => warnung.relatedItemId
    );

    res.json(validWarnungen);
  } catch (error) {
    console.error("Error fetching warnings:", error);
    res.status(500).json({ message: "Error fetching warnings", error });
  }
};

export const createWarnung = async (req: AuthRequest, res: Response) => {
  try {
    const {
      text,
      type = "manual",
      priority = "medium",
      relatedItemId,
    } = req.body;
    const warnung = new Warnung({
      text,
      type,
      priority,
      relatedItemId,
      status: "active",
      owner: req.user.userId
    });
    await warnung.save();
    console.log('warnung is created by createWarnung', warnung)
    res.status(201).json(warnung);
  } catch (error) {
    console.error("Error creating warning:", error);
    res.status(400).json({ message: "Error creating warning", error });
  }
};

export const checkWarnungen = async (req: AuthRequest, res: Response) => {
  try {
    const { lebensmittel } = req.body;

    // Validate input
    if (!lebensmittel || !Array.isArray(lebensmittel)) {
      return res.status(400).json({
        message: "Invalid request: lebensmittel must be an array",
      });
    }

    const filteredLebensmittel = lebensmittel.filter(lebensmittel => lebensmittel.showWarnung && lebensmittel.status === 'neu');

    if (!filteredLebensmittel) {
      return res.status(400).json({
        message: "no warnings",
      });
    }

    const now = new Date();
    // const warningThreshold = 3; // Minimum stock level
    const expiryWarningDays = 7; // Days before expiration to warn

    // Remove old automatic warnings
    await Warnung.deleteMany({
      owner: req.user.userId,
      type: { $in: ["low_stock", "expiring_soon", "expired"] },
      status: "active",
    });

    const newWarnings = [];

    for (const item of filteredLebensmittel) {
      try {
        // Validate item structure
        if (
          !item.typ ||
          !item.typ.name ||
          !item.menge ||
          !item.expirationDate
        ) {
          console.warn("Invalid item structure:", item);
          continue;
        }

        // Check stock levels
        // if (item.menge <= warningThreshold) {
        //   const warning = new Warnung({
        //     owner: req.user.userId,
        //     text: `Niedriger Bestand: ${item.typ.name} (${item.menge} ${
        //       item.typ.einheit || "Stk."
        //     } übrig)`,
        //     type: "low_stock",
        //     priority: "medium",
        //     relatedItemId: item._id,
        //     status: "active",
        //   });
        //   await warning.save();
        //   newWarnings.push(warning);
        // }

        // Check if the warning already exists for the given item
        // const existingWarning = await Warnung.findOne({
        //   owner: req.user.userId,
        //   relatedItemId: item._id,
        //   type: { $in: ["low_stock", "expiring_soon", "expired"] },
        //   status: "active",
        // });

        // if (existingWarning) {
        //   console.log("警告已存在，跳过创建新的警告");
        //   continue; // Skip if warning already exists
        // }

        // Check expiration dates
        const expirationDate = new Date(item.expirationDate);
        if (isNaN(expirationDate.getTime())) {
          console.warn("Invalid expiration date:", item.expirationDate);
          continue;
        }

        const daysUntilExpiry = Math.ceil(
          (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilExpiry < 0) {
          const warning = new Warnung({
            owner: req.user.userId,
            text: `${item.typ.name} ist abgelaufen!`,
            type: "expired",
            priority: "high",
            relatedItemId: item._id,
            status: "active",
          });
          await warning.save();
          console.log('warning is created at checkwarning:',warning)
          newWarnings.push(warning);
        } else if (daysUntilExpiry <= expiryWarningDays) {
          const warning = new Warnung({
            owner: req.user.userId,
            text: `${item.typ.name} läuft in ${daysUntilExpiry} Tagen ab`,
            type: "expiring_soon",
            priority: daysUntilExpiry <= 3 ? "high" : "medium",
            relatedItemId: item._id,
            status: "active",
          });
          await warning.save();
          console.log('warning is created at checkwarning:',warning)
          newWarnings.push(warning);
        }
      } catch (itemError) {
        console.error("Error processing item:", item, itemError);
        // Continue with next item instead of failing the entire request
        continue;
      }
    }

    res.json(newWarnings);
  } catch (error) {
    console.error("Error checking warnings:", error);
    res.status(500).json({
      message: "Error checking warnings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const resolveWarnung = async (req: Request, res: Response) => {
  try {
    const warnung = await Warnung.findById(req.params.id);
    if (!warnung) {
      return res.status(404).json({ message: "Warning not found" });
    }

    warnung.status = "resolved";
    await warnung.save();
    res.json(warnung);
  } catch (error) {
    console.error("Error resolving warning:", error);
    res.status(400).json({ message: "Error resolving warning", error });
  }
};

export const deleteWarnung = async (req: Request, res: Response) => {
  try {
    const warnung = await Warnung.findByIdAndDelete(req.params.id).populate('relatedItemId');
    if (!warnung) {
      return res.status(404).json({ message: "Warning not found" });
    }

    const relatedLebensmittel = warnung.relatedItemId as any

    if (relatedLebensmittel && relatedLebensmittel._id) {
      relatedLebensmittel.showWarnung = false
      await relatedLebensmittel.save()
    } 

    console.log(`warnung ${req.params.id} is deleted`)
    res.json({ message: "Warning deleted successfully" });
  } catch (error) {
    console.error("Error deleting warning:", error);
    res.status(400).json({ message: "Error deleting warning", error });
  }
};
