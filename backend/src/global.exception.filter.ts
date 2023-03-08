import { ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: any, host: import('@nestjs/common').ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: '서버 내부에서 일시적인 오류가 발생했습니다.',
    });
  }
}
