import { Router } from "express";
import {
  obtenerCarros,
  obtenerCarroPorId,
  crearCarro,
  actualizarCarro,
  eliminarCarro,
  obtenerEstadisticas,
} from "../controllers/carroController";

const router = Router();

// Rutas para carros
router.get("/", obtenerCarros);
router.get("/estadisticas", obtenerEstadisticas);
router.get("/:id", obtenerCarroPorId);
router.post("/", crearCarro);
router.put("/:id", actualizarCarro);
router.delete("/:id", eliminarCarro);

export default router;
