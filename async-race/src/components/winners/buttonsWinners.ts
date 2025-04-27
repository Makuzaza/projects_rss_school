import { WinnerService } from '../services/WinnerService';
import { GarageService } from '../services/GarageService';
import { createWinnerUI } from '../ui';
import { DescriptionCar } from '../garage/utilsGarage';
export let numberPageWinners = 1;

const WINNERS_PER_PAGE: number = 10;
const MIN_PAGE_NUMBER: number = 1;

const containerWinners = <HTMLElement>document.querySelector('.container-win');
const countWinners = <HTMLElement>document.querySelector('.count-winners');
const showPrevWinnerPageButton = <HTMLButtonElement>document.querySelector('.btn-prev-win');
const showNextWinnerPageButton = <HTMLButtonElement>document.querySelector('.btn-next-win');
const numPageWinners = <HTMLElement>document.querySelector('.count-page_winners');

let currentSortField: string | null = null;
let currentSortOrder: 'asc' | 'desc' = 'asc';

const updateWinnersButtonStates = () => {
  const totalPages = Math.ceil(WinnerService.countAllWinners / WINNERS_PER_PAGE) || MIN_PAGE_NUMBER;
  showPrevWinnerPageButton.disabled = numberPageWinners <= MIN_PAGE_NUMBER;
  showNextWinnerPageButton.disabled = numberPageWinners >= totalPages || WinnerService.countAllWinners === 0;
  showPrevWinnerPageButton.style.visibility = totalPages <= MIN_PAGE_NUMBER ? 'hidden' : 'visible';
  showNextWinnerPageButton.style.visibility = totalPages <= MIN_PAGE_NUMBER ? 'hidden' : 'visible';
};

const updateWinnersPageDisplay = () => {
  const totalPages = Math.ceil(WinnerService.countAllWinners / WINNERS_PER_PAGE) || MIN_PAGE_NUMBER;
  numPageWinners.textContent = `${numberPageWinners}/${totalPages}`;
  updateWinnersButtonStates();
};

export const updateWinnersUI = () => {
  let num = numberPageWinners * WINNERS_PER_PAGE - WINNERS_PER_PAGE;

  WinnerService.getWinners(numberPageWinners, WINNERS_PER_PAGE, currentSortField || '', currentSortOrder).then((arr: DescriptionCar[]) => {
    containerWinners.innerHTML = '';

    arr.forEach((car) => {
      let name = '';
      let color = '';
      GarageService.getCar(car.id).then((oneCar) => {
        name = oneCar.name;
        color = oneCar.color;
        num += 1;

        const oneWinner = `${createWinnerUI(num, color, name, car.wins, car.time)}`;
        containerWinners.innerHTML += oneWinner;
      });
    });
    countWinners.textContent = `(${WinnerService.countAllWinners})`;
    updateWinnersPageDisplay();
  });
};
updateWinnersUI();

showPrevWinnerPageButton.addEventListener('click', () => {
  if (numberPageWinners === MIN_PAGE_NUMBER) {
    showPrevWinnerPageButton.setAttribute('disabled', 'disabled');
  } else {
    showNextWinnerPageButton.removeAttribute('disabled');
    numberPageWinners -= MIN_PAGE_NUMBER;
    numPageWinners.textContent = `${numberPageWinners}`;
  }
  updateWinnersUI();
});

showNextWinnerPageButton.addEventListener('click', () => {
  if (numberPageWinners * WINNERS_PER_PAGE >= WinnerService.countAllWinners) {
    showNextWinnerPageButton.setAttribute('disabled', 'disabled');
  } else {
    showPrevWinnerPageButton.removeAttribute('disabled');
    numberPageWinners += 1;
    numPageWinners.textContent = `${numberPageWinners}`;
  }
  updateWinnersUI();
});

document.querySelectorAll('.sortable').forEach((header) => {
  header.addEventListener('click', () => {
    const sortField = header.getAttribute('data-sort');
    if (!sortField) return;

    if (currentSortField === sortField) {
      currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortField = sortField;
      currentSortOrder = 'asc';
    }
    updateWinnersUI();
  });
});
