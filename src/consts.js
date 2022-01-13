export const GENRES = ['Drama', 'Film-Noir', 'Mystery', 'Musical', 'Love'];
export const Films = { COUNT: 20, COUNT_PER_STEP: 5, COUNT_RATED: 2 };
export const Rank = { STATUS: ['novice', 'fan', 'movie-buff'], RANGE: 10 };
export const textMessage = {
  ALL: 'There are no movies in our database',
  WATCHLIST: 'There are no movies to watch now',
  HISTORY: 'There are no watched movies now',
  FAVORITES: 'There are no favorite movies now',
};
export const URL_AVATAR = 'images';
export const MAX_LENGTH = 140;

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const BlockType = {
  TOP: 'top',
  COMMENTED: 'commented',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  OPEN_FILM_CARD: 'OPEN_FILM_CARD',
  ADD_WATCHLIST: 'ADD_WATCHLIST',
  ADD_HISTORY: 'ADD_HISTORY',
  ADD_FAVORITES: 'ADD_FAVORITES',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  CLOSE: 'CLOSE',
  MICRO: 'MICRO',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};
