import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tournament } from 'src/app/models/tournament.model';
import { TournamentsService } from 'src/app/services/tournaments.service';

@Component({
  selector: 'app-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.scss']
})
export class RemoveComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Tournament,
    private readonly tournamentsService: TournamentsService,
  ) {}

  removeTournament() {
    if (this.data.id) {
      this.tournamentsService.removeTournament(this.data.id);
    }
  }
}
