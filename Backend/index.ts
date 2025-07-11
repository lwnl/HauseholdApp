import dbConnection from "./src/scripts/dbConnection";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./src/routers/userRouter";
import einkauflistRouter from "./src/routers/einkauflistRouter";
import cookieParser from "cookie-parser";
import notizRouter from "./src/routers/notizRouter.ts";
import warnungenRoutes from "./src/routers/warnungen.ts";
import { multerInit } from "./src/scripts/multerInit.ts";
import lebensmittelRoutes from "./src/routers/lebensmittelRouter.ts";
import lebensmittelTypRoutes from "./src/routers/lebensmittelTypRouter.ts";
import transaktionRouter from "./src/routers/transaktionRouter.ts";
import path from "path";

dotenv.config();

const app = express();
// app.use(
//   cors({
//     origin: ["http://localhost:5173","http://localhost:3000", "https://haushalt.liangw.de"],
//     credentials: true,
//   })
// );
app.use(express.static(path.join(__dirname, '../Frontend/dist')))
app.use(cookieParser());
app.use(express.json());
app.use(
  "/data/profilePictures",
  express.static(path.join(__dirname, "data/profilePictures"))
);
app.use("/users", userRouter);
app.use("/api/einkaufsliste", einkauflistRouter);
app.use("/api/notiz", notizRouter);
app.use("/api/lebensmittel", lebensmittelRoutes);
app.use("/api/lebensmittelTyp", lebensmittelTypRoutes);
app.use("/api/warnungen", warnungenRoutes);
app.use("/transaction", transaktionRouter);
app.get("/", (req, res) => {
  res.send("backend is working");
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'))
})

dbConnection();
multerInit();

// Der Port, auf dem die Anwendung läuft
const PORT = process.env.PORT || 3000;

// Der Server wird gestartet
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // Der Server läuft erfolgreich auf dem angegebenen Port
});
