import { SetMetadata } from '@nestjs/common';
import { AuthRole } from './dto/login.dto';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AuthRole[]) => SetMetadata(ROLES_KEY, roles);
