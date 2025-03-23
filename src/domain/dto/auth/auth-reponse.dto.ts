import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: 'ADMIN' | 'USER';

  createdAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponse })
  user: Omit<UserResponse, 'password'>;

  @ApiProperty()
  token: string;
}
