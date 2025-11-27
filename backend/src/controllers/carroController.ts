import { Request, Response } from "express";
import Carro from "../models/Carro";

// GET - Obtener todos los carros
export const obtenerCarros = async (req: Request, res: Response) => {
  try {
    const carros = await Carro.find().sort({ fechaIngreso: -1 });
    res.status(200).json({
      success: true,
      data: carros,
      total: carros.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los carros",
      error: error.message,
    });
  }
};

// GET - Obtener un carro por ID
export const obtenerCarroPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const carro = await Carro.findById(id);

    if (!carro) {
      return res.status(404).json({
        success: false,
        message: "Carro no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: carro,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el carro",
      error: error.message,
    });
  }
};

// POST - Crear un nuevo carro
export const crearCarro = async (req: Request, res: Response) => {
  try {
    let { marca, modelo, año, placa, color, costoReparacion, descripcionDaños } = req.body;

    // Limpiar y validar campos requeridos
    marca = marca?.trim();
    modelo = modelo?.trim();
    color = color?.trim();
    descripcionDaños = descripcionDaños?.trim();
    placa = placa?.toUpperCase().trim();
    
    año = parseInt(año);
    costoReparacion = parseFloat(costoReparacion);

    if (!marca || !modelo || !año || !placa || !color || !costoReparacion || !descripcionDaños) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos",
      });
    }

    // Validaciones adicionales
    if (isNaN(año) || año < 1900 || año > new Date().getFullYear() + 1) {
      return res.status(400).json({
        success: false,
        message: `El año debe estar entre 1900 y ${new Date().getFullYear() + 1}`,
      });
    }

    if (isNaN(costoReparacion) || costoReparacion < 0) {
      return res.status(400).json({
        success: false,
        message: "El costo de reparación debe ser un número positivo",
      });
    }

    if (descripcionDaños.length < 10) {
      return res.status(400).json({
        success: false,
        message: "La descripción debe tener al menos 10 caracteres",
      });
    }

    // Verificar si la placa ya existe
    const carroExistente = await Carro.findOne({ placa });
    if (carroExistente) {
      return res.status(409).json({
        success: false,
        message: "La placa ya existe en el sistema",
      });
    }

    const nuevoCarro = new Carro({
      marca,
      modelo,
      año,
      placa,
      color,
      costoReparacion,
      descripcionDaños,
    });

    await nuevoCarro.save();

    res.status(201).json({
      success: true,
      message: "Carro creado exitosamente",
      data: nuevoCarro,
    });
  } catch (error: any) {
    console.error("Error en crearCarro:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear el carro",
      error: error.message,
    });
  }
};

// PUT - Actualizar un carro
export const actualizarCarro = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let { marca, modelo, año, placa, color, costoReparacion, descripcionDaños } = req.body;

    const carro = await Carro.findById(id);

    if (!carro) {
      return res.status(404).json({
        success: false,
        message: "Carro no encontrado",
      });
    }

    // Limpiar y validar campos si se proporcionan
    if (marca) {
      marca = marca.trim();
      if (marca.length < 2) {
        return res.status(400).json({
          success: false,
          message: "La marca debe tener al menos 2 caracteres",
        });
      }
      carro.marca = marca;
    }

    if (modelo) {
      modelo = modelo.trim();
      if (modelo.length < 2) {
        return res.status(400).json({
          success: false,
          message: "El modelo debe tener al menos 2 caracteres",
        });
      }
      carro.modelo = modelo;
    }

    if (año) {
      año = parseInt(año);
      if (isNaN(año) || año < 1900 || año > new Date().getFullYear() + 1) {
        return res.status(400).json({
          success: false,
          message: `El año debe estar entre 1900 y ${new Date().getFullYear() + 1}`,
        });
      }
      carro.año = año;
    }

    if (placa) {
      placa = placa.toUpperCase().trim();
      if (placa !== carro.placa) {
        const carroExistente = await Carro.findOne({ placa });
        if (carroExistente) {
          return res.status(409).json({
            success: false,
            message: "La placa ya existe en otro carro",
          });
        }
      }
      carro.placa = placa;
    }

    if (color) {
      color = color.trim();
      carro.color = color;
    }

    if (costoReparacion !== undefined) {
      costoReparacion = parseFloat(costoReparacion);
      if (isNaN(costoReparacion) || costoReparacion < 0) {
        return res.status(400).json({
          success: false,
          message: "El costo de reparación debe ser un número positivo",
        });
      }
      carro.costoReparacion = costoReparacion;
    }

    if (descripcionDaños) {
      descripcionDaños = descripcionDaños.trim();
      if (descripcionDaños.length < 10) {
        return res.status(400).json({
          success: false,
          message: "La descripción debe tener al menos 10 caracteres",
        });
      }
      carro.descripcionDaños = descripcionDaños;
    }

    await carro.save();

    res.status(200).json({
      success: true,
      message: "Carro actualizado exitosamente",
      data: carro,
    });
  } catch (error: any) {
    console.error("Error en actualizarCarro:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el carro",
      error: error.message,
    });
  }
};

// DELETE - Eliminar un carro
export const eliminarCarro = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const carro = await Carro.findByIdAndDelete(id);

    if (!carro) {
      return res.status(404).json({
        success: false,
        message: "Carro no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Carro eliminado exitosamente",
      data: carro,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el carro",
      error: error.message,
    });
  }
};

// GET - Obtener estadísticas
export const obtenerEstadisticas = async (req: Request, res: Response) => {
  try {
    const totalCarros = await Carro.countDocuments();
    const costoTotalReparaciones = await Carro.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$costoReparacion" },
          promedio: { $avg: "$costoReparacion" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCarros,
        costoTotal: costoTotalReparaciones[0]?.total || 0,
        costoPromedio: costoTotalReparaciones[0]?.promedio || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message,
    });
  }
};
