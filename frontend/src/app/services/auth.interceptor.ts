import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const credentials = btoa('admin:admin123');
  const cloned = req.clone({
    setHeaders: {
      Authorization: `Basic ${credentials}`
    }
  });
  return next(cloned);
};
