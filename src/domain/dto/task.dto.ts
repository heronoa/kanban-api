import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty()
  id?: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string | null;
  @ApiProperty()
  status?: 'TO_DO' | 'IN_PROGRESS' | 'DONE' = 'TO_DO';
  @ApiProperty()
  projectId: string;
  @ApiProperty()
  assignedTo?: string | null;
  @ApiProperty()
  createdAt?: Date;

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
  }
}
