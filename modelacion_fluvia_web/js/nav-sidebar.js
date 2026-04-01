// nav-sidebar.js – Collapsible navigation sidebar

(function () {
  'use strict';

  var STORAGE_KEY = 'navSidebarExpanded';

  function isExpanded() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  function setExpanded(expanded) {
    localStorage.setItem(STORAGE_KEY, expanded ? 'true' : 'false');
    var sidebar = document.getElementById('nav-sidebar');
    if (!sidebar) return;

    if (expanded) {
      sidebar.classList.add('expanded');
      document.body.classList.add('nav-expanded');
    } else {
      sidebar.classList.remove('expanded');
      document.body.classList.remove('nav-expanded');
    }
  }

  function markActive() {
    var links = document.querySelectorAll('#nav-sidebar .nav-link');
    var current = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var linkPage = href.split('/').pop();
      if (linkPage === current) {
        link.classList.add('active');
      }
    });
  }

  function init() {
    var sidebar = document.getElementById('nav-sidebar');
    if (!sidebar) return;

    // Restore persisted state
    setExpanded(isExpanded());
    markActive();

    var toggleBtn = sidebar.querySelector('.nav-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        setExpanded(!sidebar.classList.contains('expanded'));
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
