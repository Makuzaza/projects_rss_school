import './App.css';

export class App {
    render(): HTMLElement {
      const container = document.createElement('div');
      container.className = 'app-container';
  
      container.appendChild(this.createHeader());
      return container;
    }
  
    private createHeader(): HTMLElement {
      const header = document.createElement('header');
      header.className = 'header';
  
      const title = document.createElement('div');
      title.className = 'header-title';
      title.textContent = 'ASYNC RACE';
  
      const nav = document.createElement('div');
      nav.className = 'header-nav';
  
      const garageBtn = document.createElement('button');
      garageBtn.textContent = 'Garage';
      garageBtn.className = 'nav-button';
  
      const winnersBtn = document.createElement('button');
      winnersBtn.textContent = 'Winners';
      winnersBtn.className = 'nav-button';
  
      nav.appendChild(garageBtn);
      nav.appendChild(winnersBtn);
  
      header.appendChild(title);
      header.appendChild(nav);
  
      return header;
    }
  }
  