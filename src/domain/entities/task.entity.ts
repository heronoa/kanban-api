import { Project } from './project.entity';
import { User } from './user.entity';

export class Task {
  id?: string;
  title: string;
  description: string | null;
  status?: 'TO_DO' | 'IN_PROGRESS' | 'DONE' = 'TO_DO';
  projectId: string;
  project?: Project;
  assignedTo?: string | null;
  user?: User | null;
  createdAt?: Date;

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
  }

  setStatus(status: 'TO_DO' | 'IN_PROGRESS' | 'DONE'): void {
    this.status = status;
  }

  assignTo(user: User): void {
    this.assignedTo = user.id;
    this.user = user;
  }
}
