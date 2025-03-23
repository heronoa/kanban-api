import { ApiProperty } from '@nestjs/swagger';

class UserResponse {
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

export class ListUserDTO {
  @ApiProperty({ type: Array<UserResponse> })
  users: Array<UserResponse>;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty()
  totalPages: number;
}
