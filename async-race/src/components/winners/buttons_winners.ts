import { getWinnersAPI, countAllWinners } from './api_winners';
import { getCarAPI } from '../garage/api_garage';
import { createWinnerUI } from '../ui';
import { DescriptionCar } from '../garage/utils_garage';
export let numberPageWinners = 1;

const containerWinners = <HTMLElement>document.querySelector('.container-win');
const countWinners = <HTMLElement>document.querySelector('.count-winners');
const btnPrevWinners = <HTMLButtonElement>document.querySelector('.btn-prev-win');
const btnNextWinners = <HTMLButtonElement>document.querySelector('.btn-next-win');
const numPageWinners = <HTMLElement>document.querySelector('.count-page_winners');

// Update button states based on current page position
const updateWinnersButtonStates = () => {
  const totalPages = Math.ceil(countAllWinners / 10) || 1;
  
  // Previous button - disabled on first page
  btnPrevWinners.disabled = numberPageWinners <= 1;
  
  // Next button - disabled on last page or when no items
  btnNextWinners.disabled = numberPageWinners >= totalPages || countAllWinners === 0;
  
  // Hide buttons when there's only one page or no items
  btnPrevWinners.style.visibility = totalPages <= 1 ? 'hidden' : 'visible';
  btnNextWinners.style.visibility = totalPages <= 1 ? 'hidden' : 'visible';
};

const updateWinnersPageDisplay = () => {
  const totalPages = Math.ceil(countAllWinners / 10) || 1;
  numPageWinners.textContent = `${numberPageWinners}/${totalPages}`;
  updateWinnersButtonStates();
};

export const updateWinnersUI = () => {
  let num = numberPageWinners * 10 - 10;

  getWinnersAPI(numberPageWinners).then((arr: DescriptionCar[]) => {
    containerWinners.innerHTML = '';

    arr.forEach((car) => {
      let name = '';
      let color = '';
      getCarAPI(car.id).then((oneCar) => {
        name = oneCar.name;
        color = oneCar.color;
        num += 1;

        const oneWinner = `${createWinnerUI(num, color, name, car.wins, car.time)}`;
        containerWinners.innerHTML += oneWinner;
      });
    });
    countWinners.textContent = `(${countAllWinners})`;
    updateWinnersPageDisplay();
  });
};
updateWinnersUI();

btnPrevWinners.addEventListener('click', () => {
  if (numberPageWinners === 1) {
    btnPrevWinners.setAttribute('disabled', 'disabled');
  } else {
    btnNextWinners.removeAttribute('disabled');
    numberPageWinners -= 1;
    numPageWinners.textContent = `${numberPageWinners}`;
  }
  updateWinnersUI();
});

btnNextWinners.addEventListener('click', () => {
  if (numberPageWinners * 10 >= countAllWinners) {
    btnNextWinners.setAttribute('disabled', 'disabled');
  } else {
    btnPrevWinners.removeAttribute('disabled');
    numberPageWinners += 1;
    numPageWinners.textContent = `${numberPageWinners}`;
  }
  updateWinnersUI();
});
