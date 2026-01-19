/**
 * Almacén de Links - Script Principal
 * Gestiona la funcionalidad completa de la aplicación
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========== INICIALIZACIÓN ==========
  initializeYear();
  initializeMobileMenu();
  initializeSmoothScroll();
  initializeDarkMode();
  initializeLinksStorage();
  initializeFormHandler();

  // ========== AÑO ACTUAL ==========
  /**
   * Actualiza el año en el footer
   */
  function initializeYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // ========== MENÚ MOBILE ==========
  /**
   * Gestiona la apertura/cierre del menú en dispositivos móviles
   */
  function initializeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');

    if (menuToggle && nav) {
      menuToggle.addEventListener('click', () => {
        nav.classList.toggle('show');
        menuToggle.classList.toggle('active');
      });

      // Cerrar menú al hacer click en un enlace
      const navLinks = nav.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('show');
          menuToggle.classList.remove('active');
        });
      });
    }
  }

  // ========== SCROLL SUAVE ==========
  /**
   * Implementa scroll suave para enlaces internos
   */
  function initializeSmoothScroll() {
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
  }

  // ========== ALMACÉN DE LINKS ==========
  /**
   * Inicializa y gestiona el almacén de links
   */
  function initializeLinksStorage() {
    const linksGrid = document.getElementById('links-grid');
    const emptyState = document.getElementById('empty-state');
    let links = loadLinks();

    /**
     * Carga los links desde localStorage
     */
    function loadLinks() {
      const stored = localStorage.getItem('links');
      return stored ? JSON.parse(stored) : [];
    }

    /**
     * Guarda los links en localStorage
     */
    function saveLinks() {
      localStorage.setItem('links', JSON.stringify(links));
    }

    /**
     * Renderiza todos los links en la cuadrícula
     */
    function renderLinks() {
      linksGrid.innerHTML = '';

      // Mostrar/ocultar estado vacío
      if (links.length === 0) {
        emptyState.classList.add('show');
        linksGrid.style.display = 'none';
      } else {
        emptyState.classList.remove('show');
        linksGrid.style.display = 'grid';

        // Crear tarjeta para cada link
        links.forEach((link, index) => {
          const card = createLinkCard(link, index);
          linksGrid.appendChild(card);
        });
      }
    }

    /**
     * Crea una tarjeta de link con animación
     */
    function createLinkCard(link, index) {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.style.animationDelay = `${index * 0.1}s`;

      card.innerHTML = `
        <div class="project-thumb" style="background: ${getGradientByIndex(index)};"></div>
        <div class="project-body">
          <h3>${escapeHtml(link.nombre)}</h3>
          <p>📌 <strong>${escapeHtml(link.autor)}</strong></p>
          <a href="${escapeHtml(link.url)}" class="project-link" target="_blank" rel="noopener noreferrer">Abrir link</a>
          <button class="btn-delete" data-index="${index}" aria-label="Eliminar link">
            🗑️ Eliminar
          </button>
        </div>
      `;

      // Agregar evento al botón de eliminar
      const deleteBtn = card.querySelector('.btn-delete');
      deleteBtn.addEventListener('click', () => deleteLink(index));

      return card;
    }

    /**
     * Obtiene un gradiente único por índice
     */
    function getGradientByIndex(index) {
      const gradients = [
        'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      ];
      return gradients[index % gradients.length];
    }

    /**
     * Elimina un link del almacén
     */
    function deleteLink(index) {
      // Confirmación antes de eliminar
      if (confirm('¿Estás seguro de que deseas eliminar este link?')) {
        links.splice(index, 1);
        saveLinks();
        renderLinks();
        showNotification('Link eliminado correctamente', 'success');
      }
    }

    /**
     * Escapa caracteres especiales HTML para evitar inyecciones
     */
    function escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      };
      return text.replace(/[&<>"']/g, char => map[char]);
    }

    // Renderizar links al inicializar
    renderLinks();

    // Retornar funciones públicas
    return {
      addLink(autor, nombre, url) {
        links.push({ autor, nombre, url });
        saveLinks();
        renderLinks();
      },
      getLinks() {
        return links;
      },
      clearAllLinks() {
        if (confirm('¿Estás seguro de que deseas eliminar todos los links?')) {
          links = [];
          saveLinks();
          renderLinks();
        }
      },
    };
  }

  // ========== FORMULARIO ==========
  /**
   * Inicializa el manejador del formulario de crear links
   */
  function initializeFormHandler() {
    const form = document.getElementById('crear-link-form');
    const autorInput = document.getElementById('autor');
    const nombreInput = document.getElementById('nombre-link');
    const urlInput = document.getElementById('url-link');
    const statusEl = document.getElementById('link-status');

    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();

      const autor = autorInput.value.trim();
      const nombre = nombreInput.value.trim();
      const url = urlInput.value.trim();

      // Validaciones
      if (!autor || !nombre || !url) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
      }

      // Validar URL
      if (!isValidUrl(url)) {
        showNotification('Por favor ingresa una URL válida', 'error');
        return;
      }

      // Obtener instancia del almacén y agregar link
      const storage = initializeLinksStorage();
      storage.addLink(autor, nombre, url);

      // Limpiar formulario
      form.reset();
      autorInput.focus();

      // Mostrar mensaje de éxito
      showNotification('✓ Link agregado exitosamente', 'success');

      // Scroll automático al almacén
      setTimeout(() => {
        const linksSection = document.getElementById('links');
        linksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    });

    // Validación en tiempo real
    [autorInput, nombreInput, urlInput].forEach(input => {
      input.addEventListener('focus', () => {
        input.classList.remove('error');
      });
    });
  }

  /**
   * Valida si una URL es correcta
   */
  function isValidUrl(urlString) {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Muestra una notificación de estado
   */
  function showNotification(message, type = 'success') {
    const statusEl = document.getElementById('link-status');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = `form-status show ${type}`;

    setTimeout(() => {
      statusEl.classList.remove('show');
    }, 4000);
  }

  // ========== MODO OSCURO ==========
  /**
   * Inicializa y gestiona el modo oscuro
   */
  function initializeDarkMode() {
    const darkToggle = document.getElementById('dark-mode-toggle');
    const html = document.documentElement;

    // Cargar preferencia guardada
    const savedMode = localStorage.getItem('dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Aplicar modo guardado o usar preferencia del sistema
    if (savedMode === 'enabled' || (!savedMode && prefersDark)) {
      enableDarkMode();
    }

    if (darkToggle) {
      darkToggle.addEventListener('click', () => {
        if (html.classList.contains('dark')) {
          disableDarkMode();
        } else {
          enableDarkMode();
        }
      });
    }

    /**
     * Activa el modo oscuro
     */
    function enableDarkMode() {
      html.classList.add('dark');
      localStorage.setItem('dark-mode', 'enabled');
      updateThemeIcon('☀️');
      updateThemeColor('#111827');
    }

    /**
     * Desactiva el modo oscuro
     */
    function disableDarkMode() {
      html.classList.remove('dark');
      localStorage.setItem('dark-mode', 'disabled');
      updateThemeIcon('🌙');
      updateThemeColor('#ffffff');
    }

    /**
     * Actualiza el icono del botón de tema
     */
    function updateThemeIcon(icon) {
      const themeIcon = darkToggle?.querySelector('.theme-icon');
      if (themeIcon) {
        themeIcon.textContent = icon;
      }
    }

    /**
     * Actualiza el color de tema en meta tags
     */
    function updateThemeColor(color) {
      let metaTheme = document.querySelector('meta[name="theme-color"]');
      if (!metaTheme) {
        metaTheme = document.createElement('meta');
        metaTheme.name = 'theme-color';
        document.head.appendChild(metaTheme);
      }
      metaTheme.content = color;
    }
  }

  // ========== ACCESIBILIDAD ==========
  /**
   * Mejora la accesibilidad del sitio
   */
  function initializeAccessibility() {
    // Agregar soporte para navegación por teclado
    document.querySelectorAll('a, button').forEach(element => {
      element.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });

    // Anunciar cambios para lectores de pantalla
    const observer = new MutationObserver(() => {
      const emptyState = document.getElementById('empty-state');
      const linksGrid = document.getElementById('links-grid');

      if (emptyState && linksGrid) {
        const isEmpty = linksGrid.children.length === 0;
        const ariaLabel = isEmpty ? 'Sin links guardados' : `${linksGrid.children.length} links guardados`;
        linksGrid.setAttribute('aria-label', ariaLabel);
      }
    });

    observer.observe(document.getElementById('links-grid'), {
      childList: true,
      subtree: true,
    });
  }

  // Inicializar accesibilidad
  initializeAccessibility();
});