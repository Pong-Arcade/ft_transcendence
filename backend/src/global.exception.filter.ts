import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      const httpException = exception as HttpException;
      res.status(httpException.getStatus()).json({
        statusCode: httpException.getStatus(),
        message: httpException.message,
        error: httpException.name,
      });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: '서버 내부에서 일시적인 오류가 발생했습니다.',
      });
    }
  }
}
