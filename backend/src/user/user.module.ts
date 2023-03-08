import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entity/user.entity';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StatModule } from '../stat/stat.module';

export const repo = {
  provide: 'IUserRepository',
  useClass: UserRepository,
};

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => StatModule),
  ],
  controllers: [UserController],
  providers: [UserService, repo],
  exports: [UserService],
})
export class UserModule {}
