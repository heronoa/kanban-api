import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.dto';

class UserResponse {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: 'ADMIN' | 'USER';
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponse })
  user: Omit<User, 'password'>;

  @ApiProperty()
  token: string;
}
