import { brandsCars, modelsCars } from './brandCars';

const BRAND_COUNT = brandsCars.length;
const MODEL_COUNT = modelsCars.length;
const HEX_COLOR_LENGTH = 6;

export const getRandomName =  () => {
  const randomNumBrand = Math.floor(Math.random() * BRAND_COUNT);
  const randomNumModel = Math.floor(Math.random() * MODEL_COUNT);

  return brandsCars[randomNumBrand] + ' ' + modelsCars[randomNumModel];
};

export const getRandomColor =  () => {
  const hexColorSymbols = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
  let randomColor = '';
  for (let i = 0; i < HEX_COLOR_LENGTH; i++) {
    const randomNum = Math.floor(Math.random() * hexColorSymbols.length);
    randomColor += hexColorSymbols[randomNum];
  }
  return `#${randomColor}`;
};

export type DescriptionCar = {
  [key: string | number]: number | string,
  id: number,
  name: string,
  color: string,
  wins: number,
  time: number
};

