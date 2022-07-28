'use strict';

const fs = require('fs');
const path = require('path');

const ENV = process.env;
fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split('\n').forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith('#')) {
        return;
    }

    const parts = line.split('=');
    const name = parts[0];
    // const value = parts.slice(1).join('=');
    const value =
    parts.slice(1).join('=').startsWith('"') &&
    parts.slice(1).join('=').endsWith('"') || 
    parts.slice(1).join('=').startsWith('\'') &&
    parts.slice(1).join('=').endsWith('\'')
        ? parts.slice(1).join('=').slice(1, -1)
        : parts.slice(1).join('=');
    ENV[name] = value;
});

