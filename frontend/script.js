const API_BASE_URL = "http://localhost:5000/api";

// Estado global
let carros = [];
let carroActual = null;
let isEditing = false;

// Elementos del DOM
const modalCarro = document.getElementById("modalCarro");
const modalDetalles = document.getElementById("modalDetalles");
const formCarro = document.getElementById("formCarro");
const btnNuevoCarro = document.getElementById("btnNuevoCarro");
const btnActualizar = document.getElementById("btnActualizar");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnCancelModal = document.getElementById("btnCancelModal");
const btnCloseDetalles = document.getElementById("btnCloseDetalles");
const btnCerrarDetalles = document.getElementById("btnCerrarDetalles");
const btnEditarCarro = document.getElementById("btnEditarCarro");
const btnEliminarCarro = document.getElementById("btnEliminarCarro");
const carrosTable = document.getElementById("carrosTable");
const serverStatus = document.getElementById("serverStatus");
const modalTitle = document.getElementById("modalTitle");

// Event Listeners
btnNuevoCarro.addEventListener("click", abrirFormulario);
btnActualizar.addEventListener("click", cargarCarros);
btnCloseModal.addEventListener("click", cerrarModal);
btnCancelModal.addEventListener("click", cerrarModal);
btnCloseDetalles.addEventListener("click", cerrarDetalles);
btnCerrarDetalles.addEventListener("click", cerrarDetalles);
btnEditarCarro.addEventListener("click", editarCarroActual);
btnEliminarCarro.addEventListener("click", eliminarCarroActual);
formCarro.addEventListener("submit", guardarCarro);

// Funciones principales
async function cargarCarros() {
    try {
        const response = await fetch(`${API_BASE_URL}/carros`);
        if (!response.ok) throw new Error("Error al cargar carros");
        
        const result = await response.json();
        carros = result.data;
        actualizarTabla();
        cargarEstadisticas();
        actualizarEstadoServidor(true);
    } catch (error) {
        console.error("Error:", error);
        actualizarEstadoServidor(false);
        mostrarMensajeError("Error al cargar los carros");
    }
}

async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_BASE_URL}/carros/estadisticas`);
        if (!response.ok) throw new Error("Error al cargar estadísticas");
        
        const result = await response.json();
        const data = result.data;
        
        document.getElementById("totalCarros").textContent = data.totalCarros;
        document.getElementById("costoTotal").textContent = `$${data.costoTotal.toLocaleString("es-CO")}`;
        document.getElementById("costoPromedio").textContent = `$${data.costoPromedio.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
    } catch (error) {
        console.error("Error:", error);
    }
}

function actualizarTabla() {
    if (carros.length === 0) {
        carrosTable.innerHTML = `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-center text-gray-500" colspan="8">No hay carros registrados</td>
            </tr>
        `;
        return;
    }

    carrosTable.innerHTML = carros.map(carro => `
        <tr class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 font-bold text-blue-600">${carro.placa}</td>
            <td class="px-6 py-4">${carro.marca}</td>
            <td class="px-6 py-4">${carro.modelo}</td>
            <td class="px-6 py-4">${carro.año}</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-white" style="background-color: ${getColorFromName(carro.color)}">
                    ${carro.color}
                </span>
            </td>
            <td class="px-6 py-4 font-semibold text-green-600">$${carro.costoReparacion.toLocaleString("es-CO")}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${formatearFecha(carro.fechaIngreso)}</td>
            <td class="px-6 py-4 space-x-2">
                <button onclick="verDetalles('${carro._id}')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition text-sm">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join("");
}

function abrirFormulario() {
    isEditing = false;
    carroActual = null;
    formCarro.reset();
    document.getElementById("carroId").value = "";
    modalTitle.textContent = "Nuevo Carro";
    modalCarro.classList.remove("hidden");
}

function cerrarModal() {
    modalCarro.classList.add("hidden");
    formCarro.reset();
    isEditing = false;
    carroActual = null;
}

function cerrarDetalles() {
    modalDetalles.classList.add("hidden");
    carroActual = null;
}

async function guardarCarro(e) {
    e.preventDefault();

    const datos = {
        marca: document.getElementById("marca").value,
        modelo: document.getElementById("modelo").value,
        año: parseInt(document.getElementById("año").value),
        placa: document.getElementById("placa").value.toUpperCase(),
        color: document.getElementById("color").value,
        costoReparacion: parseFloat(document.getElementById("costoReparacion").value),
        descripcionDaños: document.getElementById("descripcionDaños").value,
    };

    try {
        const carroId = document.getElementById("carroId").value;
        let response;

        if (carroId) {
            // Actualizar
            response = await fetch(`${API_BASE_URL}/carros/${carroId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });
        } else {
            // Crear
            response = await fetch(`${API_BASE_URL}/carros`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });
        }

        const respuestaData = await response.json();

        if (!response.ok) {
            throw new Error(respuestaData.message || respuestaData.error || "Error al guardar");
        }

        cerrarModal();
        cargarCarros();
        mostrarMensajeExito(carroId ? "Carro actualizado" : "Carro creado");
    } catch (error) {
        console.error("Error:", error);
        mostrarMensajeError(error.message);
    }
}

async function verDetalles(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/carros/${id}`);
        if (!response.ok) throw new Error("Error al cargar detalles");

        const result = await response.json();
        carroActual = result.data;

        const detallesContent = document.getElementById("detallesContent");
        detallesContent.innerHTML = `
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <p class="text-gray-600 text-sm">Placa</p>
                    <p class="text-2xl font-bold text-blue-600">${carroActual.placa}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Marca</p>
                    <p class="text-2xl font-bold text-gray-900">${carroActual.marca}</p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div>
                    <p class="text-gray-600 text-sm">Modelo</p>
                    <p class="text-lg font-semibold text-gray-900">${carroActual.modelo}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Año</p>
                    <p class="text-lg font-semibold text-gray-900">${carroActual.año}</p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div>
                    <p class="text-gray-600 text-sm">Color</p>
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded border-2 border-gray-300" style="background-color: ${getColorFromName(carroActual.color)}"></div>
                        <p class="text-lg font-semibold text-gray-900">${carroActual.color}</p>
                    </div>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Fecha Ingreso</p>
                    <p class="text-lg font-semibold text-gray-900">${formatearFecha(carroActual.fechaIngreso)}</p>
                </div>
            </div>

            <div>
                <p class="text-gray-600 text-sm">Costo de Reparación</p>
                <p class="text-2xl font-bold text-green-600">$${carroActual.costoReparacion.toLocaleString("es-CO")}</p>
            </div>

            <div>
                <p class="text-gray-600 text-sm mb-2">Descripción de Daños</p>
                <div class="bg-gray-100 p-4 rounded-lg border-l-4 border-yellow-500">
                    <p class="text-gray-900 whitespace-pre-wrap">${carroActual.descripcionDaños}</p>
                </div>
            </div>
        `;

        modalDetalles.classList.remove("hidden");
    } catch (error) {
        console.error("Error:", error);
        mostrarMensajeError("Error al cargar detalles");
    }
}

function editarCarroActual() {
    if (!carroActual) return;

    document.getElementById("carroId").value = carroActual._id;
    document.getElementById("marca").value = carroActual.marca;
    document.getElementById("modelo").value = carroActual.modelo;
    document.getElementById("año").value = carroActual.año;
    document.getElementById("placa").value = carroActual.placa;
    document.getElementById("color").value = carroActual.color;
    document.getElementById("costoReparacion").value = carroActual.costoReparacion;
    document.getElementById("descripcionDaños").value = carroActual.descripcionDaños;

    modalTitle.textContent = "Editar Carro";
    isEditing = true;
    cerrarDetalles();
    modalCarro.classList.remove("hidden");
}

async function eliminarCarroActual() {
    if (!carroActual) return;

    if (!confirm(`¿Estás seguro de que deseas eliminar el carro ${carroActual.placa}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/carros/${carroActual._id}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Error al eliminar");

        cerrarDetalles();
        cargarCarros();
        mostrarMensajeExito("Carro eliminado");
    } catch (error) {
        console.error("Error:", error);
        mostrarMensajeError("Error al eliminar el carro");
    }
}

function actualizarEstadoServidor(conectado) {
    serverStatus.innerHTML = conectado 
        ? '<span class="text-green-500">●</span>' 
        : '<span class="text-red-500">●</span>';
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

function getColorFromName(colorName) {
    const colores = {
        "blanco": "#ffffff",
        "negro": "#000000",
        "rojo": "#ef4444",
        "azul": "#3b82f6",
        "verde": "#22c55e",
        "amarillo": "#eab308",
        "gris": "#808080",
        "plateado": "#c0c0c0",
        "oro": "#ffd700",
        "naranja": "#ff8c00",
        "marrón": "#8b4513",
        "morado": "#9333ea",
    };
    return colores[colorName.toLowerCase()] || "#d1d5db";
}

function mostrarMensajeExito(mensaje) {
    const div = document.createElement("div");
    div.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
    div.textContent = "✓ " + mensaje;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

function mostrarMensajeError(mensaje) {
    const div = document.createElement("div");
    div.className = "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
    div.textContent = "✗ " + mensaje;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// Cargar datos al iniciar
window.addEventListener("load", () => {
    cargarCarros();
    setInterval(cargarEstadisticas, 30000); // Actualizar estadísticas cada 30 segundos
});
