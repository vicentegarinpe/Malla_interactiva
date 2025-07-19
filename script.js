let carrera = "";
let ramos = [];
let carreras = JSON.parse(localStorage.getItem("carreras")) || [];

function guardarCarreras() {
    localStorage.setItem("carreras", JSON.stringify(carreras));
}

function crearCarrera() {
    const nombre = document.getElementById("nombreCarrera").value.trim();
    if (nombre === "") return alert("Ingresa un nombre de carrera");

    carrera = nombre;
    document.getElementById("tituloCarrera").textContent = carrera;
    document.getElementById("setup").classList.add("hidden");
    document.getElementById("mallaContainer").classList.remove("hidden");

    // Cargar malla si ya existe carrera
    const carreraGuardada = carreras.find(c => c.nombre === carrera);
    if (carreraGuardada) {
        ramos = carreraGuardada.ramos;
        renderMalla();
    } else {
        if (carrera === "Ingeniería Civil en Informática") {
            precargarMalla();
        } else if (carrera === "Psicología") {
            cargarMallaPsicologia();  // Cargar malla de Psicología
        } else {
            ramos = [];
            renderMalla();
        }
    }
}

function agregarRamo() {
    const nombre = prompt("Nombre del ramo:");
    if (!nombre || ramos.some(r => r.nombre.toLowerCase() === nombre.toLowerCase())) {
        return alert("Nombre inválido o repetido");
    }

    const prerequisitos = prompt("Ingrese nombres de ramos requisito separados por coma (si hay):");
    const requisitos = prerequisitos ? prerequisitos.split(",").map(r => r.trim()) : [];

    const ciclo = prompt("¿A qué ciclo o semestre pertenece este ramo? (Ej: I, II, III...)");
    if (!ciclo) return;

    ramos.push({ nombre, requisitos, aprobado: false, ciclo });
    guardarCarreraActual();
    renderMalla();
}

function renderMalla() {
    const malla = document.getElementById("malla");
    malla.innerHTML = "";

    const ciclos = {};  // Para agrupar ramos por ciclo (o área en el caso de Psicología)
    ramos.forEach(ramo => {
        if (!ciclos[ramo.ciclo]) ciclos[ramo.ciclo] = [];
        ciclos[ramo.ciclo].push(ramo);
    });

    const ciclosOrdenados = Object.keys(ciclos).sort();

    ciclosOrdenados.forEach(ciclo => {
        const columna = document.createElement("div");
        columna.className = "columna-ciclo";

        const titulo = document.createElement("h3");
        titulo.textContent = `Ciclo: ${ciclo}`;
        columna.appendChild(titulo);

        ciclos[ciclo].forEach(ramo => {
            const div = document.createElement("div");
            div.className = "ramo";

            const requisitosCumplidos = ramo.requisitos.every(req => {
                const encontrado = ramos.find(r => r.nombre.toLowerCase() === req.toLowerCase());
                return encontrado && encontrado.aprobado;
            });

            if (!requisitosCumplidos && ramo.requisitos.length > 0) {
                div.classList.add("bloqueado");
                div.innerHTML = `${ramo.nombre}<br><small>Requiere: ${ramo.requisitos.join(", ")}</small>`;
            } else {
                if (ramo.aprobado) {
                    div.classList.add("aprobado");
                }
                div.innerHTML = `${ramo.nombre}`;
            }

            div.onclick = () => {
                if (div.classList.contains("bloqueado")) return;
                ramo.aprobado = !ramo.aprobado;
                guardarCarreraActual();
                renderMalla();
            };

            columna.appendChild(div);
        });

        malla.appendChild(columna);
    });
}

function guardarCarreraActual() {
    const index = carreras.findIndex(c => c.nombre === carrera);
    const carreraObj = { nombre: carrera, ramos: ramos };
    if (index >= 0) {
        carreras[index] = carreraObj;
    } else {
        carreras.push(carreraObj);
    }
    guardarCarreras();
}

function reiniciarProgreso() {
    if (!confirm("¿Estás seguro de que deseas reiniciar tu progreso?")) return;
    const index = carreras.findIndex(c => c.nombre === carrera);
    if (index >= 0) {
        carreras[index].ramos.forEach(r => r.aprobado = false);
        guardarCarreras();
        ramos = carreras[index].ramos;
        renderMalla();
    }
}


// Malla Ingeniería Civil en Informática
function precargarMalla() {
  carrera = "Ingeniería Civil en Informática";
  ramos = [
    // Semestre I
    { nombre: "Introducción a la matemática", requisitos: [], aprobado: false, ciclo: "I", creditos: 11 },
    { nombre: "Química", requisitos: [], aprobado: false, ciclo: "I", creditos: 5 },
    { nombre: "Taller de la introducción a la ingeniería informática", requisitos: [], aprobado: false, ciclo: "I", creditos: 4 },
    { nombre: "Programación", requisitos: [], aprobado: false, ciclo: "I", creditos: 7 },
    { nombre: "Habilidades comunicativas para ingenieros", requisitos: [], aprobado: false, ciclo: "I", creditos: 5 },
    // Semestre II
    { nombre: "Introducción al cálculo", requisitos: ["Introducción a la matemática"], aprobado: false, ciclo: "II", creditos: 6 },
    { nombre: "Álgebra", requisitos: [], aprobado: false, ciclo: "II", creditos: 6 },
    { nombre: "Introducción a la física", requisitos: [], aprobado: false, ciclo: "II", creditos: 7 },
    { nombre: "Programación orientada a objetos", requisitos: ["Programación"], aprobado: false, ciclo: "II", creditos: 5 },
    { nombre: "Ciudadanía I", requisitos: [], aprobado: false, ciclo: "II", creditos: 2 },
    { nombre: "Electivo AFI", requisitos: [], aprobado: false, ciclo: "II", creditos: 2 },
    // Semestre III
    { nombre: "Cálculo diferencial e integral", requisitos: ["Introducción al cálculo"], aprobado: false, ciclo: "III", creditos: 7 },
    { nombre: "Álgebra superior", requisitos: ["Álgebra"], aprobado: false, ciclo: "III", creditos: 6 },
    { nombre: "Física newtoniana", requisitos: ["Introducción a la física", "Introducción al cálculo"], aprobado: false, ciclo: "III", creditos: 7 },
    { nombre: "Estructura de datos", requisitos: ["Programación"], aprobado: false, ciclo: "III", creditos: 6 },
    { nombre: "Inglés I", requisitos: [], aprobado: false, ciclo: "III", creditos: 3 },
    { nombre: "Taller de programación aplicada", requisitos: ["Programación orientada a objetos"], aprobado: false, ciclo: "III", creditos: 4 },
     // Semestre IV
    { nombre: "Cálculo multivariable", requisitos: ["Cálculo diferencial e integral"], aprobado: false, ciclo: "IV", creditos: 6 },
    { nombre: "Autómatas y lenguajes formales", requisitos: [], aprobado: false, ciclo: "IV", creditos: 4 },
    { nombre: "Electromagnetismo", requisitos: ["Física newtoniana", "Cálculo diferencial e integral"], aprobado: false, ciclo: "IV", creditos: 5 },
    { nombre: "Modelamiento y paradigmas de programación", requisitos: [], aprobado: false, ciclo: "IV", creditos: 4 },
    { nombre: "Inglés II", requisitos: ["Inglés I"], aprobado: false, ciclo: "IV", creditos: 3 },
    { nombre: "Estructuras discretas", requisitos: ["Álgebra"], aprobado: false, ciclo: "IV", creditos: 5 },
    { nombre: "Electivo AFI", requisitos: [], aprobado: false, ciclo: "IV", creditos: 2 },

    // Semestre V
    { nombre: "Ecuaciones diferenciales", requisitos: ["Cálculo multivariable"], aprobado: false, ciclo: "V", creditos: 6 },
    { nombre: "Estadística y probabilidad", requisitos: [], aprobado: false, ciclo: "V", creditos: 5 },
    { nombre: "Física moderna y ondas", requisitos: [], aprobado: false, ciclo: "V", creditos: 4 },
    { nombre: "Análisis y diseño de algoritmos", requisitos: [], aprobado: false, ciclo: "V", creditos: 5 },
    { nombre: "Bases de datos", requisitos: ["Modelamiento y paradigmas de programación"], aprobado: false, ciclo: "V", creditos: 6 },
    { nombre: "Inglés III", requisitos: ["Inglés II"], aprobado: false, ciclo: "V", creditos: 3 },

    // Semestre VI
    { nombre: "Cálculo numérico", requisitos: ["Cálculo multivariable"], aprobado: false, ciclo: "VI", creditos: 6 },
    { nombre: "Ingeniería de sistemas", requisitos: [], aprobado: false, ciclo: "VI", creditos: 5 },
    { nombre: "Bases de datos avanzadas", requisitos: ["Bases de datos"], aprobado: false, ciclo: "VI", creditos: 5 },
    { nombre: "Tecnologías móviles y web", requisitos: [], aprobado: false, ciclo: "VI", creditos: 5 },
    { nombre: "Taller de diseño digital", requisitos: ["Electromagnetismo"], aprobado: false, ciclo: "VI", creditos: 5 },
    { nombre: "Inglés IV", requisitos: ["Inglés III"], aprobado: false, ciclo: "VI", creditos: 3 },
    { nombre: "Electivo AFI", requisitos: [], aprobado: false, ciclo: "VI", creditos: 2 },

    // Semestre VII
    { nombre: "Economía", requisitos: [], aprobado: false, ciclo: "VII", creditos: 5 },
    { nombre: "Gestión de empresas", requisitos: [], aprobado: false, ciclo: "VII", creditos: 5 },
    { nombre: "Sistemas de información", requisitos: ["Ingeniería de sistemas"], aprobado: false, ciclo: "VII", creditos: 4 },
    { nombre: "Taller de ingeniería informática", requisitos: ["Tecnologías móviles y web"], aprobado: false, ciclo: "VII", creditos: 5 },
    { nombre: "Arquitectura de computadores", requisitos: [], aprobado: false, ciclo: "VII", creditos: 4 },
    { nombre: "Inglés para informáticos I", requisitos: ["Inglés IV"], aprobado: false, ciclo: "VII", creditos: 3 },
    { nombre: "Práctica intermedia", requisitos: ["Bases de datos"], aprobado: false, ciclo: "VII", creditos: 5 },

    // Semestre VIII
    { nombre: "Contabilidad y costos", requisitos: [], aprobado: false, ciclo: "VIII", creditos: 4 },
    { nombre: "Ingeniería de software", requisitos: ["Modelamiento y paradigmas de programación"], aprobado: false, ciclo: "VIII", creditos: 5 },
    { nombre: "Investigación operativa", requisitos: ["Álgebra superior"], aprobado: false, ciclo: "VIII", creditos: 5 },
    { nombre: "Formulación y evaluación de proyectos", requisitos: [], aprobado: false, ciclo: "VIII", creditos: 5 },
    { nombre: "Sistemas operativos", requisitos: ["Arquitectura de computadores"], aprobado: false, ciclo: "VIII", creditos: 5 },
    { nombre: "Inglés para informáticos II", requisitos: ["Inglés para informáticos I"], aprobado: false, ciclo: "VIII", creditos: 3 },
    { nombre: "Electivo AFI", requisitos: [], aprobado: false, ciclo: "VIII", creditos: 2 },

    // Semestre IX
    { nombre: "Inteligencia artificial", requisitos: ["Autómatas y lenguajes formales"], aprobado: false, ciclo: "IX", creditos: 5 },
    { nombre: "Taller de ingeniería de software", requisitos: ["Ingeniería de software"], aprobado: false, ciclo: "IX", creditos: 5 },
    { nombre: "Electivo profesional", requisitos: [], aprobado: false, ciclo: "IX", creditos: 5 },
    { nombre: "Electivo profesional", requisitos: [], aprobado: false, ciclo: "IX", creditos: 5 },
    { nombre: "Redes y comunicaciones", requisitos: [], aprobado: false, ciclo: "IX", creditos: 5 },
    { nombre: "Innovación y emprendimientos en informática", requisitos: [], aprobado: false, ciclo: "IX", creditos: 5 },

    // Semestre X
    { nombre: "Taller de integración tecnológica", requisitos: ["Taller de ingeniería de software"], aprobado: false, ciclo: "X", creditos: 5 },
    { nombre: "Anteproyecto de título", requisitos: ["Noveno semestre aprobado"], aprobado: false, ciclo: "X", creditos: 5 },
    { nombre: "Electivo profesional", requisitos: [], aprobado: false, ciclo: "X", creditos: 5 },
    { nombre: "Electivo profesional", requisitos: [], aprobado: false, ciclo: "X", creditos: 5 },
    { nombre: "Sistemas distribuidos", requisitos: ["Redes y comunicaciones"], aprobado: false, ciclo: "X", creditos: 5 },
    { nombre: "Seguridad informática", requisitos: ["Taller de ingeniería informática"], aprobado: false, ciclo: "X", creditos: 5 },

    // Semestre XI
    { nombre: "Proyecto de título", requisitos: ["Anteproyecto de título", "18 créditos"], aprobado: false, ciclo: "XI", creditos: 18 },
    { nombre: "Práctica profesional", requisitos: ["Octavo semestre aprobado", "12 créditos"], aprobado: false, ciclo: "XI", creditos: 12 }
  ];

  guardarCarreraActual();
  renderMalla();
}


// --- Manejo de colores dinámicos ---

function actualizarColor(variable, valor) {
  document.documentElement.style.setProperty(variable, valor);
}

document.getElementById("colorFondo").addEventListener("input", (e) => {
  actualizarColor("--color-fondo", e.target.value);
});
document.getElementById("colorAprobado").addEventListener("input", (e) => {
  actualizarColor("--color-ramo-aprobado", e.target.value);
});
document.getElementById("colorBloqueado").addEventListener("input", (e) => {
  actualizarColor("--color-ramo-bloqueado", e.target.value);
});

function resetColores() {
  document.getElementById("colorFondo").value = "#f5f7fa";
  document.getElementById("colorAprobado").value = "#c8facc";
  document.getElementById("colorBloqueado").value = "#f8d7da";
  actualizarColor("--color-fondo", "#f5f7fa");
  actualizarColor("--color-ramo-aprobado", "#c8facc");
  actualizarColor("--color-ramo-bloqueado", "#f8d7da");
}

// Precarga inicial si no hay carreras guardadas
if (carreras.length === 0) {
  precargarMalla();
  renderMalla();
}
