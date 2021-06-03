// Enviroment variables | development by default;
(function (window) {
  window.__env = window.__env || {};
  window.__env.endpoint = 'http://localhost:3000/api/v1';
  window.__env.production = false;
})(this);
