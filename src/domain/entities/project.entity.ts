export class Project {
  name: string;
  ownerId: string;
  createdAt?: Date;
  id?: string;

  constructor(partial: Partial<Project>) {
    Object.assign(this, partial);
  }
}
