import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import TypeOrmConfigService from './config/typeorm.config';
import { ChatModule } from './chat/chat.module';
import { RelationModule } from './relation/relation.module';
import { StatModule } from './stat/stat.module';
import { ChatroomModule } from './chatroom/chatroom.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UserModule,
    ChatModule,
    CacheModule.register({
      isGlobal: true,
    }),
    GameModule,
    RelationModule,
    StatModule,
    ChatroomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
