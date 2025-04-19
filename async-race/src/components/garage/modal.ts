// modal.ts
export class Modal {
    static render() {
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal__container">
          <p class="modal__message">Server not found</p>
          <p class="modal__message">
            Please run server or download it from
            <a
              class="modal__link"
              href="https://github.com/mikhama/async-race-api"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </p>
        </div>
      `;
      return modal;
    }
  
    static show() {
      const existingModal = document.querySelector('.modal');
      if (existingModal) return;
      
      const modal = this.render();
      document.body.appendChild(modal);
    }
  
    static hide() {
      const modal = document.querySelector('.modal');
      if (modal) {
        modal.remove();
      }
    }
  }