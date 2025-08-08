// copy.js
import { cpSync, mkdirSync } from 'fs';
import path                  from 'path';

const projectRoot = process.env.INIT_CWD;

const srcCoreDest    = path.join(projectRoot, 'src', 'core');
const srcHelpersDest = path.join(projectRoot, 'src', 'helpers');

const moduleCoreSrc    = path.join(projectRoot, 'node_modules', 'grapper-core', 'src', 'core');
const moduleHelpersSrc = path.join(projectRoot, 'node_modules', 'grapper-core', 'src', 'helpers');

// Create directories
mkdirSync(srcCoreDest, {recursive : true});
mkdirSync(srcHelpersDest, {recursive : true});

// Copy files
cpSync(moduleCoreSrc, srcCoreDest, {recursive : true});
cpSync(moduleHelpersSrc, srcHelpersDest, {recursive : true});
