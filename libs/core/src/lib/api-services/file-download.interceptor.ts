import {
  HttpEvent,
  HttpResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const downloadFileInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap((event: HttpEvent<any>) => {
      console.log(123);
      if (event instanceof HttpResponse) {
        const contentType = event.headers.get('content-type');
        if (contentType === 'application/vnd.ms-excel') {
          downloadFile(event);
        }
      }
    })
  );
};

const downloadFile = (response: HttpResponse<any>) => {
  const contentDispositionHeader = response.headers.get('content-disposition');
  if (contentDispositionHeader) {
    const filenameMatch = contentDispositionHeader.match(
      /filename="?([^"]+)"?$/
    );
    const filename = filenameMatch ? filenameMatch[1] : 'file.xls';

    const blob = new Blob([response.body], {
      type: 'application/vnd.ms-excel',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
