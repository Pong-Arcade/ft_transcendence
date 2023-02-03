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
        intraId: 'sichoi',
		imgUrl: 'qwe.jpg',	//	죄송..
        email: 'sichoi@student.42seoul.kr',
      },
      verified,
    );
  }
}
