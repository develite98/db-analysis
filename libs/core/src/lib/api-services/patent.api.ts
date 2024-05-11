import { Injectable } from '@angular/core';
import { PatentSimpleSearchRequest } from '../models/simple-get-patent-request';
import { RequestResponse } from '../models/request-response';
import { SimpleGetPatentResult } from '../models/simple-get-patent-result';
import { BaseApiService, IHttpParamObject } from './base-api.service';
import { Observable } from 'rxjs';
import { Patent } from '../models';

@Injectable({ providedIn: 'root' })
export class PatentApiService extends BaseApiService {
  public simpleSearch(
    request: PatentSimpleSearchRequest
  ): Observable<RequestResponse<SimpleGetPatentResult>> {
    return this.get(
      'http://152.42.216.74:8989/pct-service/patent/simple-search',
      request as unknown as IHttpParamObject
    );
  }

  public getDetail(patentCode: string): Observable<RequestResponse<Patent>> {
    return this.get('http://152.42.216.74:8989/pct-service/patent/get-detail', {
      patentCode: patentCode,
    });
  }

  public exportExcel(patentCode: string[]): Observable<unknown> {
    return this.http.post<any>(
      'http://152.42.216.74:8989/pct-service/patent/export-excel',
      {
        patentCode: patentCode,
      },
      { observe: 'response', responseType: 'text' as 'json' }
    );
    // return this.post<{ patentCode: string[] }, Blob>(
    //   'http://152.42.216.74:8989/pct-service/patent/export-excel',
    //   {
    //     patentCode: patentCode,
    //   },
    //   undefined,
    //   false,
    //   {
    //     accept: '*/*',
    //   }
    // );
  }
}
