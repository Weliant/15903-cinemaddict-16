import dayjs from 'dayjs';
import {getRandomInteger} from './common';
import relativeTime from'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

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

export const getFullDateHumanize = (date) => dayjs(date).fromNow();

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

export const getRatingGenres = (films) => {
  const genres = films.filter((film) => film.userDetails.alreadyWatched).map((film) => film.filmInfo.genre);
  const ratingGenre = {};

  const genreSet = new Set();

  genres.forEach((item) => {
    item.reduce((_item, e) => genreSet.add(e), null);
  });

  for (const genre of genreSet) {
    ratingGenre[genre] = genres.filter((item) => item.includes(genre)).length;
  }

  return ratingGenre;
};

export const getTopGenre = (films) => {
  const ratingGenre = getRatingGenres(films);
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

export const adaptToClient = (film) => {
  const adaptedFilm = {...film,
    filmInfo: {
      title: film.film_info.title,
      alternativeTitle: film.film_info.alternative_title,
      totalRating: film.film_info.total_rating,
      poster: film.film_info.poster,
      ageRating: film.film_info.age_rating,
      director: film.film_info.director,
      writers: film.film_info.writers,
      actors: film.film_info.actors,
      release: {
        date: film.film_info.release.date !== null ? new Date(film.film_info.release.date) : film.film_info.release.date,
        releaseCountry: film.film_info.release.release_country
      },
      runtime: film.film_info.runtime,
      genre: film.film_info.genre,
      description: film.film_info.description
    },
    userDetails: {
      watchlist: film.user_details.watchlist,
      alreadyWatched: film.user_details.already_watched,
      favorite: film.user_details.favorite,
      watchingDate: film.user_details['watching_date'] !== null ? new Date(film.user_details['watching_date']) : film.user_details['watching_date']
    }
  };

  delete adaptedFilm['film_info'];
  delete adaptedFilm['user_details'];

  return adaptedFilm;
};

export const adaptToServer = (film) => {
  const adaptedFilm = {...film,
    'film_info': {
      title: film.filmInfo.title,
      'alternative_title': film.filmInfo.alternativeTitle,
      'total_rating': film.filmInfo.totalRating,
      poster: film.filmInfo.poster,
      'age_rating': film.filmInfo.ageRating,
      director: film.filmInfo.director,
      writers: film.filmInfo.writers,
      actors: film.filmInfo.actors,
      release: {
        date: film.filmInfo.release.date instanceof Date ?film.filmInfo.release.date.toISOString() : null,
        'release_country': film.filmInfo.release.releaseCountry
      },
      runtime: film.filmInfo.runtime,
      genre: film.filmInfo.genre,
      description: film.filmInfo.description
    },
    'user_details': {
      watchlist: film.userDetails.watchlist,
      'already_watched': film.userDetails.alreadyWatched,
      favorite: film.userDetails.favorite,
      'watching_date': film.userDetails.watchingDate instanceof Date ? film.userDetails.watchingDate.toISOString() : null
    }
  };

  delete adaptedFilm['filmInfo'];
  delete adaptedFilm['userDetails'];

  return adaptedFilm;
};
