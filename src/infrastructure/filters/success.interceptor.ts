import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { successLogger } from '../logging/winston.logger';

@Injectable()
export class SuccessLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          successLogger.info(
            `${request.method} ${request.url} - ${response.statusCode}`,
          );
        }
      }),
    );
  }
}
