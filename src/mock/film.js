import {getRandomInteger, getRandomPositiveFloat} from './../utils/common.js';
import {generateData, generateDataArray} from './../utils/film';
import {generateComment} from './comment.js';
import {GENRES} from '../consts.js';
import {nanoid} from 'nanoid';

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
const country = ['USA', 'Austria', 'Germany', 'Finland'];
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
    id: nanoid(),
    comments: generateComments(),
    filmInfo: {
      title: name,
      alternativeTitle: name,
      totalRating: getRandomPositiveFloat(0, MAX_RATING),
      poster: `${URL_POSTERS}/${resultURL}`,
      ageRating: generateData(ageRatings),
      director: generateData(directors),
      writers: generateDataArray(1, writers),
      actors: generateDataArray(1, actors),
      release: {
        date: '2019-05-11T00:00:00.000Z',
        releaseCountry: generateData(country)
      },
      runtime: getRandomInteger(MIN_DURATION_IN_MINUTES, MAX_DURATION_IN_MINUTES),
      genre: generateDataArray(1, GENRES),
      description: generateDataArray(1, descriptions, MAX_COUNT).join('. ')
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched: Boolean(getRandomInteger(0, 1)),
      favorite: Boolean(getRandomInteger(0, 1)),
      watchingDate: '2019-04-12T16:12:32.554Z'
    }
  };
};
