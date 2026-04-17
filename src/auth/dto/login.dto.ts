export type AuthRole = 'admin' | 'petugas';

export class LoginDto {
  username: string;
  password: string;
  role: AuthRole;
}
