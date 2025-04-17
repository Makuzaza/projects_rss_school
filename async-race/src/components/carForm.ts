import { CarList } from './carList';

export class CarForm {
  private carList: CarList;

  constructor(carList: CarList) {
    this.carList = carList;
  }

  render(): HTMLElement {
    const form = document.createElement('div');
    form.className = 'car-form';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Car name';
    input.className = 'car-input';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'color-input';

    const button = document.createElement('button');
    button.textContent = 'Create';
    button.className = 'create-button';

    button.onclick = () => {
      const name = input.value.trim();
      const color = colorInput.value;
      if (name) {
        this.carList.addCar(name, color);
        input.value = '';
      }
    };

    form.appendChild(input);
    form.appendChild(colorInput);
    form.appendChild(button);

    return form;
  }
}
