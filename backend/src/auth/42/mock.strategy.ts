import { Strategy } from 'passport';
import { UserDto } from 'src/dto/user.dto';

export default class MockStrategy extends Strategy {
  private verify;

  constructor(verify) {
    super();
    this.verify = verify;
  }

  public authenticate() {
    const verified = (error, user: UserDto) => {
      this.success(user);
    };
    this.verify(
      {
        userId: 1,
        nickname: 'sichoi',
        avatarUrl: 'http://example.com',
        email: 'sichoi@student.42seoul.kr',
      },
      verified,
    );
  }
}
