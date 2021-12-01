const URL_AVATAR = 'images';
const RANK = ['novice', 'fan', 'movie-buff'];
const RANK_RANGE = 10;

const userRank = new Map();
const fromValue = 1;

for (let i = 0; i < RANK.length; i++) {
  const countFilms = fromValue + RANK_RANGE*i;
  userRank.set(countFilms, RANK[i]);
}

const getRank = (films) => {
  const countWatchedFilms = films.filter((film) => film.isWatched).length;
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
