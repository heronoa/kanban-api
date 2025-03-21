export class AuthResponseDto {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'USER';
    createdAt: Date;
  };
  token: string;
}
