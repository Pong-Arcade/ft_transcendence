import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  async addUserIfNotExists(user: UserDto) {
    this.logger.debug(`Called ${this.addUserIfNotExists.name}`);
  }
}
