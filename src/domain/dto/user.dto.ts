export class User {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
