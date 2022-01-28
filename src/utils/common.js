// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const isEscPressed = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const isEnterMessagePressed = (evt) => evt.key === 'Enter' && evt.ctrlKey;
