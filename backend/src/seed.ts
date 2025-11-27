import mongoose from "mongoose";
import dotenv from "dotenv";
import Carro from "./models/Carro";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/carson";

const carrosEjemplo = [
  {
    marca: "Toyota",
    modelo: "Corolla",
    año: 2020,
    placa: "ABC-1234",
    color: "Blanco",
    costoReparacion: 450000,
    descripcionDaños: "Golpe frontal, parachoques dañado, necesita pintura y alineación",
  },
  {
    marca: "Honda",
    modelo: "Civic",
    año: 2019,
    placa: "XYZ-5678",
    color: "Negro",
    costoReparacion: 850000,
    descripcionDaños: "Accidente trasero, baúl abollado, luces traseras rotas, necesita estructura",
  },
  {
    marca: "Chevrolet",
    modelo: "Spark",
    año: 2018,
    placa: "DEF-9012",
    color: "Rojo",
    costoReparacion: 320000,
    descripcionDaños: "Puerta lateral rayada, espejo roto, necesita pintura y reemplazo de vidrio",
  },
  {
    marca: "Renault",
    modelo: "Logan",
    año: 2021,
    placa: "GHI-3456",
    color: "Gris",
    costoReparacion: 650000,
    descripcionDaños: "Motor con problemas, cambio de aceite, filtros, bujías y diagnóstico completo",
  },
  {
    marca: "Hyundai",
    modelo: "Accent",
    año: 2017,
    placa: "JKL-7890",
    color: "Azul",
    costoReparacion: 520000,
    descripcionDaños: "Transmisión con ruido, cambio de fluido, inspección de embrague requerida",
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Conectado a MongoDB");

    // Limpiar colección
    await Carro.deleteMany({});
    console.log("Colección limpiada");

    // Insertar datos
    const result = await Carro.insertMany(carrosEjemplo);
    console.log(`${result.length} carros insertados exitosamente`);

    // Mostrar estadísticas
    const total = await Carro.countDocuments();
    const stats = await Carro.aggregate([
      {
        $group: {
          _id: null,
          totalCosto: { $sum: "$costoReparacion" },
          promedioCosto: { $avg: "$costoReparacion" },
        },
      },
    ]);

    console.log("\n--- Estadísticas ---");
    console.log(`Total de carros: ${total}`);
    console.log(`Costo total: $${stats[0]?.totalCosto || 0}`);
    console.log(`Costo promedio: $${Math.round(stats[0]?.promedioCosto || 0)}`);

    await mongoose.connection.close();
    console.log("\nConexión cerrada");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

seedDatabase();
