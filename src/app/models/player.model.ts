import { User } from './user.model';

export interface Player {
  user: User,
  licensePlate: string,
  ranking: number,
};
