import { defineConfig } from '@playwright/test';

let options = '';

if (process.argv.includes('--project=core')) {
  process.env.port = '8201';
  options          = '-t ./test/core/cases';
} else if (process.argv.includes('--project=core.intersection')) {
  process.env.port = '8202';
  options          = '-t ./test/core.intersection/cases';
}
const webServer = process.env.port ? {
  command             : `g-workbench ${ options } -p ${ process.env.port }`,
  url                 : `http://localhost:${ process.env.port }/`,
  timeout             : 120000,
  reuseExistingServer : !process.env.CI,
} : undefined;

export default defineConfig({
  projects      : [
    {name : 'helpers'},
    {name : 'core'},
    {name : 'core.intersection'},
  ],
  testDir       : './test',
  fullyParallel : true,
  forbidOnly    : !!process.env.CI,
  retries       : process.env.CI ? 2 : 0,
  workers       : process.env.CI ? 1 : undefined,
  reporter      : 'list',
  use           : {
    trace    : 'on-first-retry',
    browsers : ['chromium'],
    viewport : {width : 1280, height : 720},
    baseURL  : `http://localhost:${ process.env.port }/`,
  },
  webServer,
});

