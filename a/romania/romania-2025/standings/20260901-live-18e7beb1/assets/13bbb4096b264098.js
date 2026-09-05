function loadComponent(name, selector) {
  return fetch(`./components/${name}.html`)
    .then(response => response.text())
    .then(html => {
      const element = document.querySelector(selector);
      if (element) {
        element.innerHTML = html;
        return true;
      }
      return false;
    })
    .catch(err => {
      console.log(`Couldn't load ${name}:`, err);
      return false;
    });
}

function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `./${currentPage}`) {
      link.classList.add('active');
    }
  });
}



document.addEventListener('DOMContentLoaded', () => {
  const components = [
    'navigation',
    'sponsors-list',
    'footer'
  ];

  const loadPromises = components.map(name => {
    const placeholder = document.querySelector(`#${name}-placeholder`);
    if (placeholder) {
      return loadComponent(name, `#${name}-placeholder`);
    }
    return Promise.resolve(false);
  });

  Promise.all(loadPromises).then((results) => {
    const navigationLoaded = results[0];
    
    if (navigationLoaded) {
      setActiveNav();
    }

    const script = document.createElement('script');
    script.src = 'js/animations.js';
    script.onload = () => {
      if (typeof initializeAnimations === 'function') {
        initializeAnimations();
      }
      if (typeof initializeDropdown === 'function') {
        initializeDropdown();
      }
      if (typeof initializeMobileMenu === 'function') {
        initializeMobileMenu();
      }
    };
    document.head.appendChild(script);
  });
}); 