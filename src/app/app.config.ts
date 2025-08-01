import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import {
  type ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
} from '@apollo/client/core';

import { provideAnimations } from '@angular/platform-browser/animations';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { EnvironmentService } from './shared/services/environment.service';
import { EnvironmentServiceProvider } from './shared/services/environment.service.provider';
import { COMMON_CONST } from './shared/constants/common.constant';

export const appConfig: ApplicationConfig = {
  providers: [
    EnvironmentServiceProvider,
    provideHttpClient(),
    provideRouter(routes),
    provideAnimations(),
    provideClientHydration(),
    {
      provide: FIREBASE_OPTIONS,
      useFactory: (envService: EnvironmentService) => envService.firebaseConfig,
      deps: [EnvironmentService],
    },

    importProvidersFrom(HttpClient),
    {
      provide: APOLLO_OPTIONS,
      useFactory: (
        httpLink: HttpLink,
        envService: EnvironmentService
      ): ApolloClientOptions<unknown> => {
        const uri = envService.apiUrl + COMMON_CONST.GRAPHQL_PATH;
        return {
          link: ApolloLink.from([httpLink.create({ uri })]),
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink, EnvironmentService],
    },
    Apollo,
  ],
};
