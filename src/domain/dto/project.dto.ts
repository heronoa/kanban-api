export class Project {
  name: string;
  ownerId: string;

  constructor(partial: Partial<Project>) {
    Object.assign(this, partial);
  }
}
