import { ApiProperty } from '@nestjs/swagger';

export class Project {
  @ApiProperty()
  name: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  description?: string | null;


  constructor(partial: Partial<Project>) {
    Object.assign(this, partial);
  }
}
