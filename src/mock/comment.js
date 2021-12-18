import {generateData, getFullDate} from './../utils/film.js';

const messages = ['Interesting setting and a good cast', 'Booooooooooring', 'Very very old. Meh', 'Almost two hours? Seriously?'];
const emotions = ['smile', 'sleeping', 'puke', 'angry'];
const authors = ['Tim Macoveev', 'John Doe', 'John Black', 'Monika Moor'];
const date = new Date();

export const generateComment = () => ({
  author: generateData(authors),
  comment: generateData(messages),
  date: getFullDate(date),
  emotion: generateData(emotions)
});
