import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  role: 'ADMIN' | 'USER';

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
