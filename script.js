let carrera = "";
let ramos = [];

function crearCarrera() {
    const nombre = document.getElementById("nombreCarrera").value.trim();
    if (nombre === "") return alert("Ingresa un nombre de carrera");

    carrera = nombre;
    document.getElementById("tituloCarrera").textContent = carrera;
    document.getElementById("setup").classList.add("hidden");
    document.getElementById("mallaContainer").classList.remove("hidden");
    cargarDesdeLocalStorage();
    renderMalla();
}

function agregarRamo() {
    const nombre = prompt("Nombre del ramo:");
    if (!nombre) return;

    const prerequisitos = prompt("Ingrese nombres de ramos requisito separados por coma (si hay):");
    const requisitos = prerequisitos ? prerequisitos.split(",").map(r => r.trim()) : [];

    ramos.push({ nombre, requisitos, aprobado: false });
    guardarEnLocalStorage();
    renderMalla();
}

function renderMalla() {
    const malla = document.getElementById("malla");
    malla.innerHTML = "";

    ramos.forEach((ramo, i) => {
        const div = document.createElement("div");
        div.className = "ramo";

        const requisitosCumplidos = ramo.requisitos.every(req => {
            const encontrado = ramos.find(r => r.nombre === req);
            return encontrado && encontrado.aprobado;
        });

        if (!requisitosCumplidos && ramo.requisitos.length > 0) {
            div.classList.add("bloqueado");
            div.innerHTML = `${ramo.nombre}<div class="tooltip">Requiere: ${ramo.requisitos.join(", ")}</div>`;
        } else if (ramo.aprobado) {
            div.classList.add("aprobado");
            div.textContent = ramo.nombre;
        } else {
            div.textContent = ramo.nombre;
        }

        div.onclick = () => {
            if (div.classList.contains("bloqueado")) return;
            ramos[i].aprobado = !ramos[i].aprobado;
            guardarEnLocalStorage();
            renderMalla();
        };

        malla.appendChild(div);
    });
}

function guardarEnLocalStorage() {
    localStorage.setItem("malla-" + carrera, JSON.stringify(ramos));
}

function cargarDesdeLocalStorage() {
    const data = localStorage.getItem("malla-" + carrera);
    if (data) ramos = JSON.parse(data);
}
