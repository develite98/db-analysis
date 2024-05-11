import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

export enum StateStatus {
  Init = 'Init',
  Loading = 'Loading',
  Error = 'Error',
  Pending = 'Pending',
  Success = 'Success',
  SilentLoading = 'SilentLoading',
}

export type TrackingStatusState = { status: StateStatus };

export function trackingStatus() {
  return signalStoreFeature(
    withState<TrackingStatusState>({ status: StateStatus.Init }),
    withComputed(({ status }) => ({
      isInit: computed(() => status() === StateStatus.Init),
      isPending: computed(() => status() === StateStatus.Pending),
      isLoading: computed(() => status() === StateStatus.Loading),
      isSuccess: computed(() => status() === StateStatus.Success),
      error: computed(() => status() === StateStatus.Error),
    }))
  );
}
