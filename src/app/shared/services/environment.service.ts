/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-shadow */
import { Injectable } from '@angular/core';
import { LOG_LEVELS } from '../enums/log-level.enum';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  // *All* (!!) properties in *this* class are overwritten *immediately* (upon launch of app) by values stored in environment.js

  // Whether or not to enable debug mode
  public production = false;

  // app-scope level of logging we wish to report, as number. Accepted values must match index of the enum in LogLevels.
  public logLevelConsole = LOG_LEVELS.VERBOSE; // default given, however this setting gets overridden on load
  public logLevelServer = LOG_LEVELS.WARNING; // default given, however this setting gets overridden on load

  public logToConsole = false;
  public logToServer = false;

  // gratis identifier of environment type, as FYI and nothing more. Accepted values must match an enum in environmentTypes.
  public environmentType = '';

  public environmentTypes = {
    Development: 'Development',
    Review: 'Review',
    Staging: 'Staging',
    Production: 'Production',
  };

  public get isDevEnvironment(): boolean {
    return this.environmentType === this.environmentTypes.Development;
  }

  // url for app data API
  public apiUrl = '';

  // Settings for Firebase initialization
  public firebaseApiKey = '';
  public firebaseAuthDomain = '';
  public firebaseDatabaseUrl = '';
  public firebaseProjectId = '';
  public firebaseStorageBucket = '';
  public firebaseMessagingSenderId = '';
  public firebaseAppId = '';
  public firebaseMeasurementId = '';
  public idleTimeOut!: number;
  public sessionTimeOut!: number;
  public signInViaEmailAndPassword!: boolean;
  public firebaseConfig = {
    apiKey: '',

    authDomain: '',

    databaseURL: '',

    projectId: '',

    storageBucket: '',

    messagingSenderId: '',

    appId: '',

    measurementId: '',
  };
}
