const chalk = require("chalk");
const axios = require('axios');
// const fs = require('fs');

/**
 * Logs a message with optional styling.
 *
 * @param {string} string - The message to log.
 * @param {'info' | 'err' | 'warn' | 'done' | 'event' | undefined} style - The style of the log.
 */
const log = (string, style) => {
  const styles = {
    info: { prefix: "[INFO]", logFunction: console.log, hex: "#add8e6" },
    err: { prefix: "[ERROR]", logFunction: console.error, hex: "#ff0000" },
    warn: { prefix: "[WARNING]", logFunction: console.warn, hex: "#ffff00" },
    done: { prefix: "[SUCCESS]", logFunction: console.log, hex: "#90ee90" },
    event: { prefix: "[EVENT]", logFunction: console.log, hex: "#ea00ff" },
  };

  const selectedStyle = styles[style] || { logFunction: console.log };
  // fs.appendFileSync('./src/logs/latest.log', `${selectedStyle.prefix || ""} ${string}\n`, error);
  selectedStyle.logFunction(`${chalk.hex(selectedStyle.hex || "#ffffff")(selectedStyle.prefix) || ""} ${string}`);
};

const error = (err) => {
  log(err, 'err');
};

/**
 * Formats a timestamp.
 *
 * @param {number} time - The timestamp in milliseconds.
 * @param {import('discord.js').TimestampStylesString} style - The timestamp style.
 * @returns {string} - The formatted timestamp.
 */
const time = (time, style) => {
  return `<t:${Math.floor(time / 1000)}${style ? `:${style}` : ""}>`;
};


/**
 * Generates random number
 *
 * @param {number} min - The lowest number (inclusive).
 * @param {number} max - The largest number (inclusive).
 * @returns {number} - The random number.
 */
const random = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const pingCat = () => {
  axios.get('http://127.0.0.1:' + process.env.SERVERPORT + '/updated');
}

const titleCase = (str) => {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}

/**
 * 
 * @param {String} text - The text that contains terms
 * @param {Array || String} terms - The term or terms to find in the text
 * @param {Number} b - The buffer, how many characters on each side of the term to show
 * @returns 
 */
const peekText = (text, terms, b = 8) => {
  for (const t of Array.isArray(terms) ? terms : [terms]) {
    const term = t.startsWith('$') ? t.slice(1) : t, ts = text.toLowerCase().search(term);
    if (ts == -1) continue;
    const start = (ts - b) < 0 ? 0 : ts - b, end =  (ts + term.length + b) > text.length ? text.length : ts + term.length + b;
    return [start == 0 ? "" : "...", text.slice(start, end).trim(), end == text.length ? "" : "..."].join('');
  }
  return 'ERROR no text found';
}

module.exports = {
  log,
  error,
  time,
  random,
  pingCat,
  titleCase,
  peekText,
};
