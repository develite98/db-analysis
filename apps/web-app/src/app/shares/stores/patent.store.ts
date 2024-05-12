import { computed, inject } from '@angular/core';
import {
  Field,
  Pagination,
  Patent,
  PatentApiService,
  PatentFields,
  QueryFilter,
  StateStatus,
  trackingStatus,
} from '@ng-lab/core';
import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { delay } from 'rxjs';

enum Mode {
  Advanced = 'advanced',
  Simple = 'simple',
}

export const PatentStore = signalStore(
  { providedIn: 'root' },
  trackingStatus(),
  withState({
    supportFields: PatentFields,
    selectedField: PatentFields[0],
    data: <Patent[]>[],
    keyword: '',
    mode: <Mode>Mode.Simple,
    searchFields: <QueryFilter[]>[],
    pagingInfo: <Pagination>{
      totalPages: 0,
      currentPage: 1,
      size: 10,
    },
  }),
  withComputed((store) => ({
    isAdvancedMode: computed(() => store.mode() === Mode.Advanced),
  })),
  withMethods((store, patentApi = inject(PatentApiService)) => ({
    addFilter: (item: QueryFilter | undefined) => {
      if (item) {
        patchState(store, (s) => ({
          ...s,
          searchFields: s.searchFields.concat(item),
        }));
      } else {
        const state = getState(store);
        const current = state.searchFields.map((x) => x.key);
        const field =
          PatentFields.find((f) => !current.includes(f.value)) ||
          PatentFields[0];

        patchState(store, (s) => ({
          ...s,
          searchFields: s.searchFields.concat({
            key: field.value,
            value: '',
            operator: 'AND',
          }),
        }));
      }
    },
    removeFilter: (index: number) => {
      const state = getState(store);
      state.searchFields.splice(index, 1);

      patchState(store, (s) => ({
        ...s,
        searchFields: state.searchFields,
      }));
    },
    changeSearchText: (keyword: string) => {
      patchState(store, (s) => ({
        ...s,
        keyword: keyword,
      }));
    },
    changeField: (field: Field) => {
      patchState(store, (s) => ({ ...s, selectedField: field }));
    },
    toggleMode: () => {
      const state = getState(store);
      const newMode =
        state.mode === Mode.Advanced ? Mode.Simple : Mode.Advanced;

      if (newMode === Mode.Advanced) {
        const searchFields: QueryFilter[] = [
          {
            value: state.keyword,
            operator: 'AND',
            key: state.selectedField.value,
          },
        ];

        patchState(store, (s) => ({
          ...s,
          mode: newMode,
          searchFields: searchFields,
          keyword: `${searchFields[0].operator} ${searchFields[0].key} ${searchFields[0].value}`,
        }));
      } else {
        patchState(store, (s) => ({
          ...s,
          mode: newMode,
        }));
      }
    },
    simpleSearch: () => {
      const state = getState(store);
      patchState(store, (s) => ({
        ...s,
        status: StateStatus.Loading,
      }));

      patentApi
        .simpleSearch({
          keyword: state.keyword,
          page: state.pagingInfo.currentPage,
          size: state.pagingInfo.size,
        })
        .pipe(delay(500))
        .subscribe({
          next: (result) => {
            patchState(store, (s) => ({
              ...s,
              data: result.data.content,
              pagingInfo: result.data.pagination,
              status: StateStatus.Success,
            }));
          },
        });
    },
  })),
  withHooks((store) => ({
    onInit: () => {
      store.simpleSearch();
    },
  }))
);
