import mongoose, { Schema, Document } from "mongoose";

export interface ICarro extends Document {
  marca: string;
  modelo: string;
  año: number;
  placa: string;
  color: string;
  fechaIngreso: Date;
  costoReparacion: number;
  descripcionDaños: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CarroSchema = new Schema<ICarro>(
  {
    marca: {
      type: String,
      required: [true, "La marca es requerida"],
      trim: true,
      minlength: 2,
    },
    modelo: {
      type: String,
      required: [true, "El modelo es requerido"],
      trim: true,
      minlength: 2,
    },
    año: {
      type: Number,
      required: [true, "El año es requerido"],
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    placa: {
      type: String,
      required: [true, "La placa es requerida"],
      unique: true,
      trim: true,
      uppercase: true,
      match: /^[A-Z0-9\-]{4,10}$/,
    },
    color: {
      type: String,
      required: [true, "El color es requerido"],
      trim: true,
    },
    fechaIngreso: {
      type: Date,
      default: Date.now,
    },
    costoReparacion: {
      type: Number,
      required: [true, "El costo de reparación es requerido"],
      min: 0,
    },
    descripcionDaños: {
      type: String,
      required: [true, "La descripción de daños es requerida"],
      trim: true,
      minlength: 10,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICarro>("carson", CarroSchema);
