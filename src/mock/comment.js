import {generateData, getFullDate} from './../utils.js';

const messages = ['Interesting setting and a good cast', 'Booooooooooring', 'Very very old. Meh', 'Almost two hours? Seriously?'];
const emotions = ['smile', 'puke', 'angry', 'sleeping'];
const authors = ['Tim Macoveev', 'John Doe', 'John Black', 'Monika Moor'];
const date = new Date();

export const generateComment = () => ({
  message: generateData(messages),
  emoji: generateData(emotions),
  author: generateData(authors),
  date: getFullDate(date),
});
