import { GarageService } from '../services/GarageService';
import { WinnerService } from '../services/WinnerService';
import { createCarUI } from '../ui';
import { getRandomName, getRandomColor, DescriptionCar } from './utilsGarage';
import { updateWinnersUI } from '../winners/buttonsWinners';
import { resetRace } from './driveCar';

const btnPrevCars = <HTMLButtonElement>document.querySelector('.btn-prev');
const btnNextCars = <HTMLButtonElement>document.querySelector('.btn-next');
const numPage = <HTMLSpanElement>document.querySelector('.count-page');
const generateNewCarBtn = <HTMLElement>document.querySelector('.generate-cars');
const btnGenerateCards = <HTMLElement>document.querySelector('.btn-generate_cars');
const containerCar = <HTMLElement>document.querySelector('.container-car');
const countGarage = <HTMLElement>document.querySelector('.count-garage');
const inputTextCreate = <HTMLInputElement>document.querySelector('.text-create');
const inputColorCreate = <HTMLInputElement>document.querySelector('.color-create');

const inputTextUpdate = <HTMLInputElement>document.querySelector('.text-update');
const inputColorUpdate = <HTMLInputElement>document.querySelector('.color-update');
const btnUpdate = <HTMLInputElement>document.querySelector('.btn-update');

let idUpdateCar: number;
export let numberPage = 1;
const limitPage: number = 7;
const randomCars: number = 100;

const updateGarageButtonStates = () => {
  const totalPages = Math.ceil(GarageService.countAllCars / limitPage) || 1;
  btnPrevCars.disabled = numberPage <= 1;
  btnNextCars.disabled = numberPage >= totalPages || GarageService.countAllCars === 0;
  
  btnPrevCars.style.visibility = totalPages <= 1 ? 'hidden' : 'visible';
  btnNextCars.style.visibility = totalPages <= 1 ? 'hidden' : 'visible';
};

const updatePageDisplay = () => {
  const totalPages = Math.ceil(GarageService.countAllCars / limitPage) || 1;
  numPage.textContent = `${numberPage}/${totalPages}`;
  updateGarageButtonStates();
};

export const updateCarsUI = () => {
  GarageService.getCars(numberPage).then((arr: DescriptionCar[]) => {
    containerCar.innerHTML = '';

    arr.forEach((car) => {
      const oneCar = `${createCarUI(car.id, car.name, car.color)}`;
      containerCar.innerHTML += oneCar;
    });
    countGarage.textContent = `(${GarageService.countAllCars})`;
    updatePageDisplay();
  });
};
updateCarsUI();

btnPrevCars.addEventListener('click', () => {
  if (numberPage > 1) {
    numberPage -= 1;
    updateCarsUI();
    resetRace();
  }
});

btnNextCars.addEventListener('click', () => {
  if (numberPage * limitPage < GarageService.countAllCars) {
    numberPage += 1;
    updateCarsUI();
    resetRace();
  }
});

document.addEventListener('click', async (e) => {
  const btn = e.target as HTMLElement;

  if (btn.classList.contains('car-options_select')) {
    idUpdateCar = Number(btn.dataset.select);
    inputTextUpdate.disabled = false;
    inputColorUpdate.disabled = false;
    btnUpdate.disabled = false;

    GarageService.getCar(idUpdateCar).then((item) => {
      inputTextUpdate.value = item.name;
      inputColorUpdate.value = item.color;
    });
  }

  if (btn.classList.contains('car-options_remove')) {
    const idButton = Number(btn.dataset.remove);
    GarageService.deleteCar(idButton).then(() => updateCarsUI());

    WinnerService.getAllWinners().then((arrAllWin) => {
      arrAllWin.forEach((item: DescriptionCar) => {
        if (Number(item.id) === idButton) WinnerService.deleteWinner(idButton);
      });
    }).then(() => updateWinnersUI());
  }
});

generateNewCarBtn.addEventListener('click', (e) => {
  const elem = e.target as HTMLElement;

  if (elem.classList.contains('btn-create')) {
    const nameNewCar =  inputTextCreate.value;
    const colorNewCar =  inputColorCreate.value;

    if (nameNewCar == '') {
      alert('Please, enter name car!');
    } else {
      (GarageService.createCar({ 'name': nameNewCar, 'color': colorNewCar })).then(() => updateCarsUI());
    }
    inputTextCreate.value = '';
  }

  if (elem.classList.contains('btn-update')) {
    const nameUpdateCar =  inputTextUpdate.value;
    const colorUpdateCar =  inputColorUpdate.value;
    
    (GarageService.updateCar( { 'name': nameUpdateCar, 'color': colorUpdateCar }, idUpdateCar)).then(() => updateCarsUI() );
    
    inputTextUpdate.value = '';
    inputTextUpdate.disabled = true;
    inputColorUpdate.disabled = true;
    btnUpdate.disabled = true;
  }
});

btnGenerateCards.addEventListener('click', async () => {
  for (let i = 0; i < randomCars; i++){
    const name = getRandomName();
    const color = getRandomColor();
  
    GarageService.createCar({ 'name': `${name}`, 'color': `${color}` });
  }
  updateCarsUI();
  btnNextCars.removeAttribute('disabled');
});
