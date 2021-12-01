import dayjs from 'dayjs';
import {getRandomInteger, generateData, generateDataArray, getRandomPositiveFloat} from './../utils.js';
import {generateComment} from './comment.js';
import {GENRES} from '../const.js';

const MAX_COUNT = 5;
const URL_POSTERS = './images/posters';
const MAX_RATING = 10;

const MIN_DURATION_IN_MINUTES = 90;
const MAX_DURATION_IN_MINUTES = 180;

const urls = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const movieTitles = [
  'Made for each other',
  'Popeye meets Sinbad',
  'Sagebrush Trail',
  'Santa Claus conquers The Martians',
  'The Dance of Life',
  'The Great Flamarion',
  'The Man with The Golden Arm',
];

const directors = ['Christopher Nolan', 'Anthony Mann', 'Steven Spielberg'];
const writers = ['Anne Wigton', 'Heinz Herald', 'Richard Weil'];
const actors = ['Erich von Stroheim', 'Mary Beth Hughes', 'Dan Duryea'];
const ageRatings = ['18+', '16+', '12+'];
const country = ['USA', 'Austria', 'Germany'];
const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const descriptions = text.split('.').map((item) => item.trim()).filter((item) => item !== '');

const generateComments = () => {
  const randomValue = getRandomInteger(0, MAX_COUNT);
  return Array.from({length: randomValue}, generateComment);
};

export const generateFilm = () => {
  const name = generateData(movieTitles);
  const url = name.toLocaleLowerCase().replace(/\s+/g, '-');
  const regExpURL = new RegExp(url);
  const resultURL = urls.filter((item) => regExpURL.test(item));

  return {
    name,
    originName: name,
    poster: `${URL_POSTERS}/${resultURL}`,
    description: generateDataArray(1, descriptions, MAX_COUNT).join('. '),
    comments: generateComments(),
    rating: getRandomPositiveFloat(0, MAX_RATING),
    date: dayjs().format('DD MMMM YYYY'),
    duration: getRandomInteger(MIN_DURATION_IN_MINUTES, MAX_DURATION_IN_MINUTES),
    genres: generateDataArray(1, GENRES),
    director: generateData(directors),
    writers: generateDataArray(1, writers),
    actors: generateDataArray(1, actors),
    country: generateData(country),
    ageRating: generateData(ageRatings),
    isWished: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorites: Boolean(getRandomInteger(0, 1)),
  };
};
