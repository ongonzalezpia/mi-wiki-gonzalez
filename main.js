document.addEventListener("DOMContentLoaded", () => {
  
  // 1. ÍNDICE AUTOMÁTICO EN EL ASIDE
  const contenedorIndice = document.querySelector("aside ul");
  const subtitulos = document.querySelectorAll("main section h2, main section h3");

  if (contenedorIndice) {
    subtitulos.forEach((subtitulo) => {
      // Asegurar que el título tenga un ID para el enlace ancla
      if (!subtitulo.id) {
        subtitulo.id = subtitulo.textContent
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
      }

      const itemLista = document.createElement("li");
      const enlace = document.createElement("a");
      enlace.href = `#${subtitulo.id}`;
      enlace.textContent = subtitulo.textContent;

      itemLista.appendChild(enlace);
      contenedorIndice.appendChild(itemLista);
    });
  }

// 2. PANEL MODO OSCURO Y TAMAÑO DE LETRAS
  const btnModo = document.getElementById("btn-modo");
  const btnPequeno = document.getElementById("btn-pequeño");
  const btnEstandar = document.getElementById("btn-estandar");
  const btnGrande = document.getElementById("btn-grande");

  // Modo Oscuro / Claro
  if (btnModo) {
    btnModo.addEventListener("click", () => {
      document.body.classList.toggle("modo-oscuro");
      if (document.body.classList.contains("modo-oscuro")) {
        btnModo.textContent = "Modo claro";
      } else {
        btnModo.textContent = "Modo oscuro";
      }
    });
  }

  // Tamaño de Texto
  const botonesTamanio = [btnPequeno, btnEstandar, btnGrande];

  function cambiarTamanio(claseTamanio, botonSeleccionado) {
    // Remover clases previas de tamaño del body
    document.body.classList.remove("tamanio-pequenio", "tamanio-estandar", "tamanio-grande");
    // Aplicar la nueva clase
    document.body.classList.add(claseTamanio);

    // Actualizar estados visuales de los botones activos
    botonesTamanio.forEach((btn) => {
      if (btn) btn.classList.remove("activo");
    });
    if (botonSeleccionado) botonSeleccionado.classList.add("activo");
  }

  if (btnPequeno) btnPequeno.addEventListener("click", () => cambiarTamanio("tamanio-pequenio", btnPequeno));
  if (btnEstandar) btnEstandar.addEventListener("click", () => cambiarTamanio("tamanio-estandar", btnEstandar));
  if (btnGrande) btnGrande.addEventListener("click", () => cambiarTamanio("tamanio-grande", btnGrande));


  // 3. SECCIONES PLEGABLES

  const secciones = document.querySelectorAll("main section");

  secciones.forEach((seccion) => {
    const encabezadoSeccion = seccion.querySelector("h2, h3");

    if (encabezadoSeccion) {
      // Agregar indicador visual inicial de flechita
      const indicador = document.createElement("span");
      indicador.textContent = " ▼ ";
      indicador.style.fontSize = "0.8em";
      encabezadoSeccion.appendChild(indicador);

      encabezadoSeccion.addEventListener("click", () => {
        seccion.classList.toggle("plegada");
        if (seccion.classList.contains("plegada")) {
          indicador.textContent = " ▶ ";
        } else {
          indicador.textContent = " ▼ ";
        }
      });
    }
  });


  // 4. SECCIÓN DISCUSIÓN Y COMENTARIOS
  const formComentario = document.getElementById("form-comentario");
  const inputNombre = document.getElementById("nombre");
  const textComentario = document.getElementById("comentario");
  const contadorCaracteres = document.getElementById("contador-caracteres");
  const avisoError = document.getElementById("aviso-error");
  const listaComentarios = document.getElementById("lista-comentarios");

  const MAX_CARACTERES = 200;

  if (textComentario && contadorCaracteres) {
    textComentario.addEventListener("input", () => {
      const cantidadActual = textComentario.value.length;
      contadorCaracteres.textContent = `${cantidadActual}/${MAX_CARACTERES}`;

      if (cantidadActual > MAX_CARACTERES) {
        contadorCaracteres.style.color = "red";
      } else {
        contadorCaracteres.style.color = "inherit";
      }
    });
  }

  if (formComentario) {
    formComentario.addEventListener("submit", (evento) => {
      evento.preventDefault(); // Evita que se recargue la página

      const nombreValor = inputNombre.value.trim();
      const comentarioValor = textComentario.value.trim();
      let mensajeError = "";

      // Limpiar marcas previas de error
      inputNombre.classList.remove("input-error");
      textComentario.classList.remove("input-error");
      avisoError.textContent = "";
      avisoError.className = "error-oculto";

      // Validaciones
      if (nombreValor === "") {
        mensajeError = "El campo de nombre no puede estar vacío ni contener solo espacios.";
        inputNombre.classList.add("input-error");
      } else if (comentarioValor.length < 10 || comentarioValor.length > MAX_CARACTERES) {
        mensajeError = `El comentario debe tener entre 10 y ${MAX_CARACTERES} caracteres (actuales: ${comentarioValor.length}).`;
        textComentario.classList.add("input-error");
      }

      // Si hay error, mostrarlo en la página
      if (mensajeError !== "") {
        avisoError.textContent = mensajeError;
        avisoError.className = "error-visible";
        return;
      }

      // Si es válido, agregar comentario a la lista de forma segura (texto plano)
      const itemComentario = document.createElement("li");
      
      const textoStrong = document.createElement("strong");
      textoStrong.textContent = nombreValor + ": ";
      
      const spanTexto = document.createElement("span");
      spanTexto.textContent = comentarioValor; // Evita ejecución de HTML malicioso (Regla 6)

      const botonBorrar = document.createElement("button");
      botonBorrar.textContent = "Borrar";
      botonBorrar.className = "btn-borrar";

      // Evento para borrar el comentario individualmente
      botonBorrar.addEventListener("click", () => {
        itemComentario.remove();
      });

      itemComentario.appendChild(textoStrong);
      itemComentario.appendChild(spanTexto);
      itemComentario.appendChild(botonBorrar);

      listaComentarios.appendChild(itemComentario);

      // Limpiar formulario y contador
      formComentario.reset();
      if (contadorCaracteres) {
        contadorCaracteres.textContent = `0/${MAX_CARACTERES}`;
        contadorCaracteres.style.color = "inherit";
      }
    });
  }

});