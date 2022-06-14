import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tournament } from 'src/app/models/tournament.model';
import { TournamentsService } from 'src/app/services/tournaments.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-me-out',
  templateUrl: './sign-me-out.component.html',
  styleUrls: ['./sign-me-out.component.scss']
})
export class SignMeOutComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Tournament,
    private readonly fb: FormBuilder,
    private readonly tournamentsService: TournamentsService,
    private readonly userService: UserService,
  ) { }

  signOut() {
    let user = this.userService.user;
    if (!this.data.id) {
      throw new Error('Tournament ID is not provided');
    }
    if (!user.uid) {
      throw new Error('User ID is not provided');
    }
    this.tournamentsService.signOutFromATournament(this.data.id, user.uid);
  }
}
