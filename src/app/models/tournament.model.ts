import { Ladder } from './ladder.model'
import { Player } from './player.model'
import { Sponsor } from './sponsor.model'
import { User } from './user.model'

export interface Tournament {
  id?: string,
  path?: string
  name: string,
  owner: User,
  discipline: string,
  time: Date,
  location: string,
  maxParticipants: number,
  participants: Player[],
  applicationDeadline: Date,
  sponsors: Sponsor[],
  ladder: Ladder | null,
};
