document.addEventListener('DOMContentLoaded', () => {

  /* ==========================
     Footer: año dinámico
  ========================== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ==========================
     Menú mobile
  ========================== */
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');

  menuToggle?.addEventListener('click', () => {
    nav.classList.toggle('show');
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
  });

  nav?.querySelectorAll('a')?.forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('show'));
  });

  /* ==========================
     Smooth scroll para enlaces internos
  ========================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ==========================
     Proyectos - localStorage
  ========================== */
  const proyectosGrid = document.getElementById('projects-grid');
  const formCrear = document.getElementById('crear-proyecto-form');
  const statusCrear = document.getElementById('proyecto-status');

  // Obtener proyectos desde localStorage o iniciar vacío
  let proyectos = JSON.parse(localStorage.getItem('proyectos')) || [];

  // Función para mostrar proyectos en pantalla
  function mostrarProyectos() {
    proyectosGrid.innerHTML = '';
    proyectos.forEach(p => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-thumb"></div>
        <div class="project-body">
          <h3>${p.nombre}</h3>
          <p>Autor: ${p.autor}</p>
          <a class="project-link" href="${p.url}" target="_blank" rel="noopener">Ver proyecto</a>
        </div>
      `;
      proyectosGrid.appendChild(card);
    });
  }

  // Función para agregar un proyecto nuevo
  function addProject(event) {
    event?.preventDefault();

    const autor = document.getElementById('autor').value.trim();
    const nombre = document.getElementById('nombre-proyecto').value.trim();
    const url = document.getElementById('url-proyecto').value.trim();

    if (!autor || !nombre || !url) {
      statusCrear.textContent = 'Completa todos los campos.';
      statusCrear.style.color = '#e94e77';
      return;
    }

    const nuevoProyecto = { autor, nombre, url };
    proyectos.push(nuevoProyecto);
    localStorage.setItem('proyectos', JSON.stringify(proyectos));

    mostrarProyectos();
    formCrear.reset();

    statusCrear.textContent = 'Proyecto agregado con éxito!';
    statusCrear.style.color = '#3ab54a';

    setTimeout(() => statusCrear.textContent = '', 3000);
  }

  // Event listener del formulario
  formCrear?.addEventListener('submit', addProject);

  // Mostrar proyectos al cargar la página
  mostrarProyectos();

});
