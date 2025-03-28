import { ApiProperty } from '@nestjs/swagger';
import { ListDTO } from '../list.dto';

class UserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: 'ADMIN' | 'USER';
  @ApiProperty()
  createdAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponse })
  user: Omit<UserResponse, 'password'>;

  @ApiProperty()
  token: string;
}

export class ListUserDTO extends ListDTO {
  @ApiProperty({ type: Array<UserResponse> })
  users: Array<UserResponse>;
}
