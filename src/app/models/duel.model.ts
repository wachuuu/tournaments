import { Player } from "./player.model";

export interface Duel {
  id: number,
  playerOne: {
    player: Player,
    previousDuelId: number | null,
  },
  playerTwo: {
    player: Player,
    previousDuelId: number | null,
  }
  winner: Player,
  round: number,
};
