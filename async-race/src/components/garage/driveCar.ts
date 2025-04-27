import { EngineService } from '../services/EngineService';
import { GarageService } from '../services/GarageService';
import { WinnerService } from '../services/WinnerService';
import { updateWinnersUI } from '../winners/buttonsWinners';
import { numberPage } from './buttonsGarage';
import { DescriptionCar } from './utilsGarage';

const btnResetRace = <HTMLButtonElement>document.querySelector('.btn-reset');
const btnRace = <HTMLButtonElement>document.querySelector('.btn-race');
const infoAnimation: { [id: number] : DescriptionCar; } = {};
const noticeWinner = <HTMLElement>document.querySelector('.winner-notice');
const containerRace = <HTMLElement>document.querySelector('.field-control');
const btnStartRace = <HTMLButtonElement>document.querySelector('.btn-race');
const btnStopRace = <HTMLButtonElement>document.querySelector('.btn-reset');
let time: number; 
let resultRace: HTMLElement[] = [];
const limitPage: number = 7;

function toggleAllCarButtons(disableStart: boolean, disableStop: boolean) {
  const allStartButtons = document.querySelectorAll('.car-control_start');
  const allStopButtons = document.querySelectorAll('.car-control_stop');
  
  allStartButtons.forEach(btn => {
    if (disableStart) {
      btn.setAttribute('disabled', 'disabled');
    } else {
      btn.removeAttribute('disabled');
    }
  });
  
  allStopButtons.forEach(btn => {
    if (disableStop) {
      btn.setAttribute('disabled', 'disabled');
    } else {
      btn.removeAttribute('disabled');
    }
  });
}

async function addWinner(carWinner: HTMLElement, timeWinner: number) {
  const idWinner = Number(carWinner.dataset.car);
  let timeWin = (timeWinner / 1000).toFixed(2);
  let wins = 1;
  let nameWinner;

  const carData = await GarageService.getCar(idWinner); 
  nameWinner = carData.name;
  noticeWinner.classList.remove('hidden');
  noticeWinner.innerHTML = `${nameWinner} went first (${timeWin}s)!`;

  const allWinners = await WinnerService.getAllWinners();
  allWinners.forEach((item: { id: number; wins: number; time: string }) => {
    if (Number(item.id) === idWinner) {
      wins = item.wins + 1;
      timeWin = (Number(item.time) < Number(timeWin) ? item.time : timeWin).toString();
    }
  });

  if (wins > 1) {
    await WinnerService.updateWinner({ wins, time: timeWin }, idWinner);
  } else {
    await WinnerService.createWinner({ id: idWinner, wins, time: timeWin });
  }
  
  await updateWinnersUI();
}

function animationCar(car: HTMLElement, distance: number, duration: number) {
  let startTime = 0;
  const idAnime = <DescriptionCar>{};
  
  function step(timestamp: number) {
    if (!startTime) {
      startTime = timestamp;
    }
    const progress = (timestamp - startTime) / duration;
    const translate: number = progress * distance; 
    car.style.transform = `translateX(${translate}px)`;
    
    if (progress < 1) {
        idAnime.id = window.requestAnimationFrame(step);
    }
    if (progress >= 1 && !btnResetRace.hasAttribute('disabled')) {
      if (resultRace.length === 0) addWinner(car, duration);
      resultRace.push(car);
    }
  }
  idAnime.id = window.requestAnimationFrame(step);
  return idAnime;
}

const startCar = async (idCar: number) => {
    const obj = await EngineService.startEngine(idCar);
    const velocity = Number(obj.velocity);
    const distance = Number(obj.distance);
    time = distance / velocity;

    const car = <HTMLElement>document.getElementById(`car-${idCar}`);
    const screenWidth = document.body.clientWidth;
    const positionCar = screenWidth / 100 * 15;
    const distanceAnimation = screenWidth - positionCar;

    infoAnimation[idCar] = animationCar(car, distanceAnimation, time);

    const drive = await EngineService.driveEngine(idCar);
    if (!drive.success) {
      window.cancelAnimationFrame(infoAnimation[idCar].id);
    }
};

export const stopCar = async (idStop: number) => {
    await EngineService.stopEngine(idStop);
    window.cancelAnimationFrame(infoAnimation[idStop].id);
    const car = <HTMLElement>document.getElementById(`car-${idStop}`);
    car.style.transform = 'translateX(0px)';
};

const startRaceCars = async (page: number) => {
    const arrCars = await GarageService.getCars(page, limitPage);
    arrCars.forEach((elem: DescriptionCar) => startCar(elem.id));
};

export const stopRaceCars = async (page: number) => {
  const arrCars = await GarageService.getCars(page, limitPage);
    arrCars.forEach((elem: DescriptionCar) => stopCar(elem.id));
    resultRace = [];
    noticeWinner.innerHTML = '';
};

export function resetRace() {
  if (!btnResetRace.hasAttribute('disabled')) {
    btnResetRace.setAttribute('disabled', 'disabled');
    btnRace.removeAttribute('disabled');
    resultRace = [];
    noticeWinner.classList.add('hidden');
    noticeWinner.innerHTML = '';
    // console.log(noticeWinner.classList); 
  }
}

document.addEventListener('click', async (e) => {
  const btn = e.target as HTMLElement;

  if (btn.classList.contains('car-control_start')) {
    const idCar = Number(btn.dataset.start);
    await startCar(idCar);
    const btnStart = <HTMLButtonElement>document.getElementById(`start-${idCar}`);
    const btnStop = <HTMLButtonElement>document.getElementById(`stop-${idCar}`);
    btnStart.setAttribute('disabled', 'disabled');
    btnStop.removeAttribute('disabled');
  }

  if (btn.classList.contains('car-control_stop')) {
    const idCar = Number(btn.dataset.stop);
    await stopCar(idCar);
    const btnStart = <HTMLButtonElement>document.getElementById(`start-${idCar}`);
    const btnStop = <HTMLButtonElement>document.getElementById(`stop-${idCar}`);
    btnStop.setAttribute('disabled', 'disabled');
    btnStart.removeAttribute('disabled');
  }
});

containerRace.addEventListener('click', async (e) => {
  const btn = e.target as HTMLElement;

  if (btn.classList.contains('btn-race')) {
    startRaceCars(numberPage);
    btnStartRace.setAttribute('disabled', 'disabled');
    btnStopRace.removeAttribute('disabled');
    toggleAllCarButtons(true, false);
  }

  if (btn.classList.contains('btn-reset')) {
    resetRace(); 
    await stopRaceCars(numberPage);
    btnStopRace.setAttribute('disabled', 'disabled');
    btnStartRace.removeAttribute('disabled');
    toggleAllCarButtons(false, true);
  }
});
