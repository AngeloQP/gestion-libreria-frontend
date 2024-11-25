import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import {routes} from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from "@angular/common/http";
import {HttpErrorInterceptor} from "./core/interceptors/http-error.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
  ]
};
