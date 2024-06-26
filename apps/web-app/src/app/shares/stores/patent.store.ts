import { computed, inject } from '@angular/core';
import {
  Field,
  Pagination,
  Patent,
  PatentApiService,
  PatentFieldKeyDict,
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

export enum Mode {
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

    toggleMode: (mode?: Mode) => {
      let newMode = Mode.Simple;
      if (mode) {
        newMode = mode;
      } else {
        const state = getState(store);
        newMode = state.mode === Mode.Advanced ? Mode.Simple : Mode.Advanced;
      }

      patchState(store, (s) => ({
        ...s,
        mode: newMode,
        keyword: ``,
      }));
    },
    simpleSearch: () => {
      const state = getState(store);
      patchState(store, (s) => ({
        ...s,
        status: StateStatus.Loading,
      }));

      if (state.mode === Mode.Simple) {
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
            error: () => {
              patchState(store, (s) => ({
                ...s,
                status: StateStatus.Error,
              }));
            },
          });
      } else {
        patentApi
          .advancedSearch({
            pagingRequest: state.pagingInfo,
            searchFields: convertToQueryFilter(state.keyword),
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
            error: () => {
              patchState(store, (s) => ({
                ...s,
                status: StateStatus.Error,
              }));
            },
          });
      }
    },
  })),
  withHooks((store) => ({
    onInit: () => {
      store.simpleSearch();
    },
  }))
);

const convertToQueryFilter = (input: string): QueryFilter[] => {
  const regex = /(AND|OR|XOR)\s+([^\s:]+):\(([^)]+)\)/g;
  const matches = input.matchAll(regex);
  const result: QueryFilter[] = [];

  for (const match of matches) {
    const [, operator, key, value] = match;
    result.push({ operator, key: PatentFieldKeyDict[key], value });
  }

  return result;
};
