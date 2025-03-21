import { Project } from './project.entity';
import { Task } from './task.entity';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
  projects: Project[] = [];
  tasks: Task[] = [];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  validateEmail(): boolean {
    return /\S+@\S+\.\S+/.test(this.email);
  }
}
