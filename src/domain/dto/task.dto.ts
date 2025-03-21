export class Task {
  id?: string;
  title: string;
  description: string | null;
  status?: 'TO_DO' | 'IN_PROGRESS' | 'DONE' = 'TO_DO';
  projectId: string;
  assignedTo?: string | null;
  createdAt?: Date;

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
  }
}
