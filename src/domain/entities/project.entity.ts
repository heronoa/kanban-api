export class Project {
  name: string;
  ownerId: string;
  createdAt?: Date;
  id?: string;
  description?: string;

  constructor(partial: Partial<Project>) {
    Object.assign(this, partial);
  }
}
