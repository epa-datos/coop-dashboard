# CO-OP Dashboard

**Feature Name:** Metrics display and user management
**Service Name:** CO-OP Dashboard 
**Creation Date:** 22/03/21
***

## Prerequisites
First install the Angular CLI globally on your system.
Check out the [Angular CLI installation](https://github.com/angular/angular-cli#installation).

Then install the package.json dependencies running `npm i`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. Remember to run up [sara](https://github.com/entropyx/sara) before.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build and the `--env=prod` flag to load Sara production api URL.

`ng build --prod --env=prod`

To build the Spanish and English version you sould run `npm run build-i18n` this command builds versions in `dist/es` and `dist/en` folders respectively.

NOTE: before build the docker image you must build the angular project.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Aditional info 
This project use [Argon Dashboard Angular Template](https://demos.creative-tim.com/argon-dashboard-angular/#/dashboard)

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
