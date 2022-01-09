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

export const getReleaseDate = (date) => dayjs(date).format('D MMMM YYYY');

export const getFullDateHumanize = (date) => {
  const dateNew = date.setDate(date.getDate() - 5); // заглушка на данный момент для генерации разных дат
  let dateComment = dayjs(dateNew).unix();
  let dateNow = dayjs().unix();
  const diff = dateNow - dateComment;
  let text = '';

  // 60 секунд для определения минут
  // 3600 секунд для определения часа
  // 86400 секунд для определения первых суток

  if (diff <= 60) {
    text = 'now';
  } else if (diff <= 3600){
    text = 'a few minutes ago';
  } else if (diff <= 86400){
    text = 'today';
  } else {
    dateComment = dateNew;
    dateNow = dayjs();
    let dDiff = dateNow.diff(dateComment, 'day');
    if (dDiff <= 7) {
      text = `${dDiff} days ago`;
    } else {
      //проверка на месяц
      dDiff = dateNow.diff(dateComment, 'month');

      if (dDiff === 0) {
        text = 'a few days ago';
      } else if (dDiff < 11){
        text = `${dDiff + 1} months ago`;
      } else {
        //проверка на год
        dDiff = dateNow.diff(dateComment, 'year');

        if (dDiff === 0) {
          text = 'a year ago';
        } else {
          text = `${dDiff + 1} years ago`;
        }
      }
    }
  }

  return text;
};

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

export const sortFilmDate = (filmA, filmB) => {
  const yearA = dayjs(filmA.filmInfo.release.date).get('year');
  const yearB = dayjs(filmB.filmInfo.release.date).get('year');
  return +yearB - +yearA;
};

export const sortFilmRating = (filmA, filmB) => +filmB.filmInfo.totalRating - +filmA.filmInfo.totalRating;

export const sortFilmMostCommented = (filmA, filmB) => filmB.comments.length - filmA.comments.length;
