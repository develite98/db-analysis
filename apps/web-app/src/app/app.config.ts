import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { ERROR_MAP, errorMap } from '@ng-lab/core';
import {
  popperVariation,
  provideTippyConfig,
  tooltipVariation,
} from '@ngneat/helipopper';

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
  ],
};
