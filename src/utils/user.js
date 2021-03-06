import {Rank, URL_AVATAR} from '../consts';

const userRank = new Map();
const fromValue = 1;

Rank.STATUS.forEach((_film, i) => {
  const countFilms = fromValue + Rank.RANGE*i;
  userRank.set(countFilms, Rank.STATUS[i]);
});

const getRank = (films) => {
  const countWatchedFilms = films.filter((film) => film.userDetails.alreadyWatched).length;
  let rank = '';

  if(countWatchedFilms) {
    for (const value of userRank.entries()) {
      if (countWatchedFilms >= value[0]) {
        rank = value[1];
      } else {
        break;
      }
    }
  }

  return rank;
};

export const generateUser = (films) => {
  const urlAvatar = 'bitmap@2x.png';

  return {
    rank: getRank(films),
    avatar: `${URL_AVATAR}/${urlAvatar}`,
  };
};
