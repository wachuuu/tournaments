import { Component, Input, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import { Duel } from 'src/app/models/duel.model';
import { Player } from 'src/app/models/player.model';
import { Tournament } from 'src/app/models/tournament.model';
import { TournamentsService } from 'src/app/services/tournaments.service';

@Component({
  selector: 'app-ladder',
  templateUrl: './ladder.component.html',
  styleUrls: ['./ladder.component.scss']
})
export class LadderComponent implements OnInit {

  @Input() tournament: Tournament | null = null;
  @Input() user: firebase.User | null = null;
  get rounds() {
    if (!this.tournament || !this.tournament.ladder) {
      return [];
    }
    let count = Math.max(...this.tournament?.ladder.map(it => it.round));
    return Array(count+1).fill(1).map((x, i) => i++);
  }
  get maxId() {
    if (!this.tournament || !this.tournament.ladder) {
      return -1;
    }
    return Math.max(...this.tournament?.ladder.map(it => it.id));
  }
  get editable() {
    if (!this.tournament?.owner.uid || !this.user?.uid) {
      return false;
    }
    return (this.tournament?.owner.uid === this.user?.uid);
  }
  touched = false;
  readyToAdd = false;
  final = false;
  selectedDuels: Duel[] = []

  constructor(private readonly tournamentsService: TournamentsService) {
    this.tournamentsService.tournaments$.subscribe(data => {
      if (this.tournament?.id) {
        let item = data.find(it => it.id === this.tournament?.id)
        if (item) {
          this.tournament = item;
        }
      }
    })
  }

  ngOnInit(): void {
    this.checkRequiredFields();
  }

  ladderGenerated() {
    if (this.tournament?.ladder?.length !== undefined) {
      if (this.tournament?.ladder?.length > 0) {
        return true;
      }
    }
    return false;
  }

  getDuelsFor(round: number) {
    return this.tournament?.ladder.filter(it => it.round == round);
  }

  chooseWinner(duel: Duel, winner: Player) {
    if (duel.round !== Math.max(...this.rounds) || this.tournament?.winner) {
      return;
    }

    this.removeFromSelectedDuels(duel);

    if (!this.tournament?.ladder) {
      throw new Error('Ladder is undefined');
    }
    this.touched = true;
    let index = this.tournament.ladder.findIndex(it => it.id === duel.id)
    if (duel.winner === winner) {
      this.tournament.ladder[index].winner = null;
    } else {
      this.tournament.ladder[index].winner = winner;
      this.addToSelectedDuels(duel)
    }
  }

  addToSelectedDuels(duel: Duel) {
    this.selectedDuels = [...this.selectedDuels, duel];
    if (this.selectedDuels.length > 2) {
      this.selectedDuels.splice(0, 1);
    }
    this.checkReadyToAdd()
  }

  removeFromSelectedDuels(duel: Duel) {
    let index = this.selectedDuels.findIndex(it => it.id === duel.id);
    if (index > -1)
      this.selectedDuels.splice(index, 1);
    this.checkReadyToAdd()
  }

  checkReadyToAdd() {
    if (!this.final) {
      if (this.selectedDuels.length == 2) {
        this.readyToAdd = true;
      } else {
        this.readyToAdd = false;
      }
    } else {
      if (this.selectedDuels.length == 1) {
        this.readyToAdd = true;
      } else {
        this.readyToAdd = false;
      }
    }
  }

  confirmWinners() {
    if (!this.selectedDuels[0].winner || !this.selectedDuels[1].winner) {
      throw new Error('winners not defined');
    }

    let newDuel: Duel = {
      id: this.maxId + 1,
      playerOne: {
        player: this.selectedDuels[0].winner,
        previousDuelId: null
      },
      playerTwo: {
        player: this.selectedDuels[1].winner,
        previousDuelId: null
      },
      round: Math.max(...this.rounds) + 1,
      winner: null,
    }

    if (this.tournament?.ladder)
      this.tournament.ladder = [...this.tournament.ladder, newDuel];

    this.readyToAdd = false;
    this.selectedDuels = [];

    if (this.getDuelsFor(Math.max(...this.rounds))?.length === 1) {
      this.final = true;
    }
  }

  confirmFinalWinner() {
    let winner = this.selectedDuels[0].winner
    let newTour = {
      id: this.tournament!.id, 
      path: this.tournament!.path, 
      name: this.tournament!.name, 
      description: this.tournament!.description, 
      owner: this.tournament!.owner, 
      discipline: this.tournament!.discipline, 
      time: this.tournament!.time, 
      location: this.tournament!.location, 
      maxParticipants: this.tournament!.maxParticipants, 
      participants: this.tournament!.participants, 
      applicationDeadline: this.tournament!.applicationDeadline, 
      sponsors: this.tournament!.sponsors, 
      ladder: this.tournament!.ladder, 
      winner
    }

    this.tournament = {... newTour};
  }

  canEdit(round: number) {
    return (round === Math.max(...this.rounds) && !this.tournament?.winner)
  }

  save() {
    let body = {
      ladder: this.tournament?.ladder,
      winner: this.tournament?.winner
    }
    if(this.tournament?.id)
      this.tournamentsService.editTournament(this.tournament?.id, body, 'Ladder updated sucessfully')
  }

  discard () {
    if (this.tournament?.id)
    this.tournamentsService.getTournamentById(this.tournament?.id).subscribe(data => {
      this.tournament = data;
    })
  }

  private checkRequiredFields() {
    if (this.tournament === null) {
      throw new Error("Attribute 'tournament' is required");
    }
    if (this.user === null) {
      throw new Error("Attribute 'user' is required");
    }
  }
}
