import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.dto';
import { ListDTO } from '../list.dto';

export class ListProjectDTO extends ListDTO {
  @ApiProperty({ type: Array<Project> })
  projects: Array<Project>;
}
