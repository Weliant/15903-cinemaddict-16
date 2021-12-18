import dayjs from 'dayjs';
import {GENRES} from '../consts.js';
import {getRandomInteger} from './common.js';

export const generateData = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

export const generateDataArray = (indx, array, max = 0) => {
  const maxValue = max ? max : array.length;
  let randomValue = getRandomInteger(indx, maxValue);

  const dataSet = new Set();

  while(randomValue > 0) {
    dataSet.add(generateData(array));
    randomValue--;
  }

  const uniqArray = Array.from(dataSet);

  return uniqArray;
};

export const getFullDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

export const getHours = (minutes) => Math.floor(minutes/60);

export const getRemainingMinutes = (minutes) => {
  const hours = getHours(minutes);
  return minutes - 60*hours;
};

export const getTimesFormatted = (time) => {
  const hours = getHours(time);
  const minutes = getRemainingMinutes(time);
  return `${hours}h ${minutes}m`;
};

export const getTopGenre = (films) => {
  const genres = films.filter((film) => film.isWatched).map((film) => film.genres);

  const ratingGenre = {};

  for (const genre of GENRES) {
    ratingGenre[genre] = genres.filter((item) => item.includes(genre)).length;
  }

  const top = Object.entries(ratingGenre).sort((a, b) => b[1] - a[1]);

  return top[0][0];
};

export const toCapitalizeLetter = (str) => str[0].toUpperCase() + str.slice(1);
