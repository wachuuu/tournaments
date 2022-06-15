import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Player } from 'src/app/models/player.model';
import { Tournament } from 'src/app/models/tournament.model';
import { TournamentsService } from 'src/app/services/tournaments.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-me-up',
  templateUrl: './sign-me-up.component.html',
  styleUrls: ['./sign-me-up.component.scss']
})
export class SignMeUpComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Tournament,
    private readonly fb: FormBuilder,
    private readonly tournamentsService: TournamentsService,
    private readonly userService: UserService,
    private snackBar: MatSnackBar,
  ) { }

  signUpForm = this.fb.group({
    ranking: [0, [Validators.required, Validators.min(1)]],
    licensePlate: ['', Validators.required],
  });

  onSubmit() {
    let user = this.userService.user;
    let player: Player = {
      user,
      ...this.signUpForm.value
    };
    if (!this.data.id) {
      throw new Error('Tournament ID is not provided');
    }
    if (this.data.participants.length < this.data.maxParticipants) {
      this.tournamentsService.signUpToATournament(this.data.id, player);
    } else {
      this.snackBar.open('Tournament reached maximum number of participants', "OK", {
        panelClass: ['snack-err']
      });
    }
  }
}
