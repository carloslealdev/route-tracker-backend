import express from "express";
import dbConnection from "./database/config.js";
import cors from "cors";
import path from "path";
import { config } from "dotenv";
import "dotenv/config";
import authRouter from "./routes/auth.js";
import routegramsRouter from "./routes/routegrams.js";

//Creacion del servidor
const app = express();
const PORT = process.env.PORT;

//La ruta que tiene que usar dotenv para leer las variables de entorno
config({ path: "/" });

//Ejecuto la conexión a la base de datos
dbConnection();

//Lectura y parseo del body
app.use(express.json());

//Cors
app.use(cors());

//Manejo de las rutas de autenticacion
app.use("/api/auth", authRouter);

//Manerjo de las rutas de rutagramas
app.use("/api/routegrams", routegramsRouter);

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

// app.get("/*splat", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  // console.log(process.env);
});
