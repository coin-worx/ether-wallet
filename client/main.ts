import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Meteor } from 'meteor/meteor';
import 'reflect-metadata';
import 'zone.js';
import { AppModule } from './imports/app/app.module';

Meteor.startup(() => {
  platformBrowserDynamic().bootstrapModule(AppModule);
});