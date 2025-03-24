import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.entity';
import { Task } from './task.entity';

export class User {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  role: 'ADMIN' | 'USER';
  @ApiProperty()
  createdAt: Date;
  @ApiProperty({
    type: Array<Project>,
  })
  projects: Project[] = [];
  @ApiProperty({
    type: Array<Task>,
  })
  tasks: Task[] = [];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
