import firebase from 'firebase/compat/app'
import { Discipline } from './discipline.enum'
import { Ladder } from './ladder.model'
import { Player } from './player.model'
import { Sponsor } from './sponsor.model'

export interface Tournament {
  name: string,
  owner: firebase.User | null,
  discipline: Discipline,
  time: Date,
  location: string,
  maxParticipants: number,
  participants: Player[],
  applicationDeadline: Date,
  sponsors: Sponsor[],
  rankedPlayersNo: number,
  ladder: Ladder | null,
};
