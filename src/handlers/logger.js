const fs = require('fs');
const { error } = require('../functions');

module.exports = () => {
    const logs =  fs.readdirSync('./src/logs/');
    if (logs.includes('latest.log')) {
        const stats = fs.statSync('./src/logs/latest.log');
        fs.renameSync('./src/logs/latest.log', './src/logs/' + stats.mtime.valueOf() + '.log', error);
    }
    fs.appendFileSync('./src/logs/latest.log', "New bot instace.\n", error);
}