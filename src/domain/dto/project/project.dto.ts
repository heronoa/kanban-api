import { ApiProperty } from '@nestjs/swagger';

export class Project {
  @ApiProperty()
  name: string;

  @ApiProperty()
  ownerId: string;

  constructor(partial: Partial<Project>) {
    Object.assign(this, partial);
  }
}
