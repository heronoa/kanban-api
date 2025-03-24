import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class Task {
  @IsOptional()
  @ApiProperty({ description: 'Unique identifier of the task' })
  id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Title of the task' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Description of the task', nullable: true })
  description: string | null;

  @IsOptional()
  @IsEnum(['TO_DO', 'IN_PROGRESS', 'DONE'])
  @ApiProperty({
    description: 'Current status of the task',
    enum: ['TO_DO', 'IN_PROGRESS', 'DONE'],
    default: 'TO_DO',
  })
  status?: 'TO_DO' | 'IN_PROGRESS' | 'DONE' = 'TO_DO';

  @IsString()
  @ApiProperty({ description: 'The project associated with the task' })
  projectId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The user assigned to the task', nullable: true })
  assignedTo?: string | null;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ description: 'Creation date of the task', nullable: true })
  createdAt?: Date;

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
  }
}
