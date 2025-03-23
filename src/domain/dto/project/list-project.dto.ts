import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.dto';

export class ListProjectDTO {
  @ApiProperty({ type: Array<Project> })
  projects: Array<Project>;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty()
  totalPages: number;
}
