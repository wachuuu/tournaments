import { Duel } from './duel.model'
import { Player } from './player.model'
import { Sponsor } from './sponsor.model'
import { User } from './user.model'

export interface Tournament {
  id?: string,
  path?: string
  name: string,
  description: string,
  owner: User,
  discipline: string,
  time: Date,
  location: string,
  maxParticipants: number,
  participants: Player[],
  applicationDeadline: Date,
  sponsors: Sponsor[],
  ladder: Duel[],
  winner?: Player | null;
};
