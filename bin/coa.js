#!/usr/bin/env node

global.CLI = true;
require('../').run(process.argv.slice(2));
