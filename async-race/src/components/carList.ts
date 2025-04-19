import carSvg from "../../public/car.svg";
import "../App.css";

export class CarList {
  private container: HTMLElement;
  private cars: { name: string; color: string }[] = [];

  constructor() {
    this.container = document.createElement("div");
    this.container.className = "car-list";
  }

  addCar(name: string, color: string) {
    this.cars.push({ name, color });
    this.renderCars();
  }

  render(): HTMLElement {
    return this.container;
  }

  private renderCars() {
    this.container.innerHTML = "";

    this.cars.forEach((car) => {
      const carItem = document.createElement("div");
      carItem.className = "car-item";

      const nameText = document.createElement("span");
      nameText.textContent = car.name;

      const svgWrapper = document.createElement("div");
      svgWrapper.className = "car-svg-wrapper";
      const coloredSvg = carSvg
        .replace(/stroke="[^"]*"/g, `stroke="${car.color}"`)
        .replace(/fill="[^"]*"/g, `fill="${car.color}"`)
        .replace(
          "<svg",
          '<svg style="width: 80px; height: auto; transform: scaleX(-1);"'
        );

      svgWrapper.innerHTML = coloredSvg;

      carItem.appendChild(svgWrapper);
      carItem.appendChild(nameText);
      this.container.appendChild(carItem);
    });
  }
}
