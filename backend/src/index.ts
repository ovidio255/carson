import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import carroRoutes from "./routes/carroRoutes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/carson";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://carson-4870.onrender.com'
  ],
  credentials: true
}));

// Conectar a MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

// Rutas básicas
app.get("/", (req: Request, res: Response) => {
  res.json({ 
    message: "Bienvenido a la API CARSON - Sistema de Gestión de Inventario de Carros",
    version: "1.0.0",
    endpoints: {
      carros: "/api/carros",
      estadisticas: "/api/carros/estadisticas",
      health: "/api/health",
    }
  });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Rutas de la API
app.use("/api/carros", carroRoutes);

// Manejo de rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`Documentación: http://localhost:${PORT}/`);
});
