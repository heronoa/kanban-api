import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class Project {
  @IsString()
  @IsNotEmpty() // Garante que o nome não pode ser uma string vazia
  @ApiProperty({ description: 'Name of the project' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Owner ID of the project, a ADMIN can set anyone id',
    nullable: true,
  })
  ownerId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Description of the project', nullable: true })
  description?: string | null;
}
