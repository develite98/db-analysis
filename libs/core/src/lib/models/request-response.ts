import { HttpStatusCode } from '@angular/common/http';

export interface RequestResponse<T> {
  code: HttpStatusCode;
  message: string;
  data: T;
}
