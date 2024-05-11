import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { ERROR_MAP, downloadFileInterceptor, errorMap } from '@ng-lab/core';
import {
  popperVariation,
  provideTippyConfig,
  tooltipVariation,
} from '@ngneat/helipopper';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    {
      provide: ERROR_MAP,
      useValue: errorMap,
    },
    provideTippyConfig({
      defaultVariation: 'tooltip',
      arrow: true,
      variations: {
        tooltip: tooltipVariation,
        popper: { ...popperVariation, theme: undefined },
      },
    }),
    provideHttpClient(withInterceptors([downloadFileInterceptor])),
  ],
};
