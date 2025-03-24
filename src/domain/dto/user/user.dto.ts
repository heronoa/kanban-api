import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class User {
  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  password: string;

  @ApiProperty({ description: 'The role of the user', enum: ['ADMIN', 'USER'] })
  @IsEnum({ ADMIN: 'ADMIN', USER: 'USER' })
  role: 'ADMIN' | 'USER';

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
