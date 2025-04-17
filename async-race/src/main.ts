import { App } from './App';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    const app = new App();
    root.appendChild(app.render());
  }
});