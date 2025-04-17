export class CarList {
    private container: HTMLElement;
    private cars: { name: string; color: string }[] = [];
  
    constructor() {
      this.container = document.createElement('div');
      this.container.className = 'car-list';
    }
  
    addCar(name: string, color: string) {
      this.cars.push({ name, color });
      this.renderCars();
    }
  
    render(): HTMLElement {
      return this.container;
    }
  
    private renderCars() {
      this.container.innerHTML = '';
  
      this.cars.forEach((car) => {
        const carItem = document.createElement('div');
        carItem.className = 'car-item';
  
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = car.color;
  
        const nameText = document.createElement('span');
        nameText.textContent = car.name;
  
        carItem.appendChild(colorBox);
        carItem.appendChild(nameText);
        this.container.appendChild(carItem);
      });
    }
  }
  