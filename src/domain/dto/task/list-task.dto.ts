import { ApiProperty } from '@nestjs/swagger';
import { Task } from './task.dto';
import { ListDTO } from '../list.dto';

export class ListTaskDTO extends ListDTO {
  @ApiProperty({ type: Array<Task> })
  tasks: Array<Task>;
}
