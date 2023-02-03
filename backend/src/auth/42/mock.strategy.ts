import { Strategy } from 'passport';
import { FtUserDto } from 'src/dto/ft.user.dto';

export default class MockStrategy extends Strategy {
  private verify;

  constructor(verify) {
    super();
    this.verify = verify;
  }

  public authenticate() {
    const verified = (error, user: FtUserDto) => {
      this.success(user);
    };
    this.verify(
      {
        userId: 1,
        intraId: 'sichoi',
        email: 'sichoi@student.42seoul.kr',
      },
      verified,
    );
  }
}
