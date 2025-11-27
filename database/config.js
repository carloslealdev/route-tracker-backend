import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN);
    console.log("Conexión a MongoDB exitosa");
  } catch (error) {
    console.log(error);
    throw new Error("Error al conectar a la base de datos");
  }
};

export default dbConnection;
