document.addEventListener('DOMContentLoaded', function(){
  // Año en footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Menu mobile
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  menuToggle?.addEventListener('click', function(){
    nav.classList.toggle('show');
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
  });

  // Cerrar menú al clicar enlace
  nav?.querySelectorAll('a')?.forEach(a=>{
    a.addEventListener('click', ()=> nav.classList.remove('show'));
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click', function(e){
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Form simple validation
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  form?.addEventListener('submit', function(e){
    e.preventDefault();
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const msg = form.querySelector('#message').value.trim();
    if(!name || !email || !msg){
      status.textContent = 'Por favor completa todos los campos.';
      status.style.color = '#e94e77';
      return;
    }
    status.textContent = '✓ Mensaje enviado (simulado). ¡Gracias!';
    status.style.color = '#3ab54a';
    form.reset();
    setTimeout(()=> status.textContent = '', 5000);
  });
});