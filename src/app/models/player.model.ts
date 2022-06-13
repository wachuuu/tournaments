import firebase from 'firebase/compat/app';

export interface Player {
  user: firebase.User,
  licensePlate: string,
  ranking: number,
};
