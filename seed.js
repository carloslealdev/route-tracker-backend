// seed.js
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// 1. CARGA TUS MODELOS (Ajusta la ruta si es necesario)
import User from "./models/User.js";
import Routegram from "./models/Routegram.js";

dotenv.config(); // Para leer tu .env

// Configuración
const USERS_TO_CREATE = 50; // ¡Cambia este número para probar volumen!
const MONGODB_URI = process.env.DB_CNN; // Tu variable de entorno de conexión

// Función auxiliar para generar coordenadas cercanas (simular una ciudad)
// Centro aproximado (ej: Maracay, Venezuela). Ajusta a tu ciudad.
const CENTER_LAT = 10.2353;
const CENTER_LNG = -67.5911;

const getRandomLocation = () => {
  // Genera coordenadas en un radio cercano
  return faker.location.nearbyGPSCoordinate({
    origin: [CENTER_LAT, CENTER_LNG],
    radius: 10,
    isMetric: true,
  });
};

// Función para simular una línea de ruta (GeoJSON)
const generateFakeRoutePath = () => {
  const start = getRandomLocation(); // [lat, lng]
  const end = getRandomLocation(); // [lat, lng]
  const mid = getRandomLocation(); // Un punto medio para que no sea linea recta

  // Mongo GeoJSON espera [Longitude, Latitude] (al revés de Google Maps)
  return [
    [start[1], start[0]],
    [mid[1], mid[0]],
    [end[1], end[0]],
  ];
};

const seedDB = async () => {
  try {
    console.log("Iniciando sembrado de datos...");
    await mongoose.connect(MONGODB_URI);
    console.log("Conectado a MongoDB");

    // 2. LIMPIEZA (Opcional: Borra todo antes de empezar)
    // console.log('Borrando datos antiguos...');
    // await User.deleteMany({ role: { $ne: 'Admin' } }); // No borramos al Admin
    // await Routegram.deleteMany({});

    // 3. PREPARAR CONTRASEÑA COMÚN (Para que puedas loguearte con cualquiera)
    const salt = bcrypt.genSaltSync();
    const genericPassword = bcrypt.hashSync("123456", salt);

    const usersBatch = [];
    const routegramsBatch = [];

    // 4. BUCLE DE GENERACIÓN
    for (let i = 0; i < USERS_TO_CREATE; i++) {
      // --- Crear Usuario ---
      const user = new User({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        identityCard: faker.string.numeric(8), // Cedula falsa
        password: genericPassword,
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        role: "Worker", // O el rol que uses
        // status: true
      });

      usersBatch.push(user);

      // --- Crear Rutagrama: Casa -> Trabajo ---
      const coords1 = generateFakeRoutePath();
      const route1 = new Routegram({
        workerId: user._id,
        // name: `Ruta Casa-Trabajo de ${user.firstName}`,
        typeRoute: "Casa-Trabajo",
        location: {
          type: "LineString",
          coordinates: coords1,
        },
        distance: faker.number.int({ min: 2000, max: 50000 }), // 2km a 50km
        travelTime: faker.number.int({ min: 15, max: 90 }), // minutos
      });
      routegramsBatch.push(route1);

      // --- Crear Rutagrama: Trabajo -> Casa (Opcional) ---
      if (Math.random() > 0.3) {
        // 70% de probabilidad de tener segunda ruta
        const coords2 = generateFakeRoutePath(); // Otra ruta distinta
        const route2 = new Routegram({
          workerId: user._id,
          // name: `Ruta Trabajo-Casa de ${user.firstName}`,
          typeRoute: "Trabajo-Casa",
          location: {
            type: "LineString",
            coordinates: coords2,
          },
          distance: faker.number.int({ min: 2000, max: 50000 }),
          travelTime: faker.number.int({ min: 15, max: 90 }),
        });
        routegramsBatch.push(route2);
      }
    }

    // 5. INSERTAR EN MONGO (Bulk Insert es más rápido)
    console.log(`⏳ Insertando ${usersBatch.length} usuarios...`);
    await User.insertMany(usersBatch);

    console.log(`⏳ Insertando ${routegramsBatch.length} rutagramas...`);
    await Routegram.insertMany(routegramsBatch);

    console.log("✅ ¡Sembrado completado con éxito!");
    process.exit();
  } catch (error) {
    console.error("❌ Error en el sembrado:", error);
    process.exit(1);
  }
};

seedDB();
