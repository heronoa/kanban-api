import { IsUUID, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRefreshTokenDto {
  @ApiProperty({
    description: 'Id of the user relationed to the user to the id',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'The refresh token' })
  @IsString()
  token: string;

  @IsDate()
  @Type(() => Date)
  expiresAt: Date;

  constructor(partial: Partial<CreateRefreshTokenDto>) {
    Object.assign(this, partial);
  }
}
