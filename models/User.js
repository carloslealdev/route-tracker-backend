// import mongoose, { model } from "mongoose";
// const { Schema } = mongoose;

// const UserSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     identityCard: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       required: true,
//       enum: ["Worker", "Admin"],
//       default: "Worker",
//     },
//   },
//   { timestamps: true }
// );

import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Por favor, ingrese un correo válido"],
    },
    identityCard: {
      type: String,
      required: [true, "La cédula/DNI es obligatoria"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
    phone: {
      type: String,
      required: [true, "El telefono es obligatorio"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "La dirección es obligatoria"],
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Worker", "Admin"],
      default: "Worker",
    },
  },
  { timestamps: true },
);

// Opcional: Crear un virtual para obtener el nombre completo fácilmente
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default model("User", UserSchema);
