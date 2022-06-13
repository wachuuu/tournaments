import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Ladder } from 'src/app/models/ladder.model';
import { Player } from 'src/app/models/player.model';
import { Tournament } from 'src/app/models/tournament.model';
import { TournamentsService } from 'src/app/services/tournaments.service';
import { UserService } from 'src/app/services/user.service';
import { AddNewDialogComponent } from './add-new-dialog/add-new-dialog.component';


@Component({
  selector: 'app-add-new-tournament',
  templateUrl: './add-new-tournament.component.html',
  styleUrls: ['./add-new-tournament.component.scss']
})
export class AddNewTournamentComponent {

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly tournamentsService: TournamentsService,
    public dialog: MatDialog,
  ) {
    const time = this.newTournamentForm.get('time')
    this.newTournamentForm.get('applicationDeadline')?.addValidators(DateValidators.lesserThan(time))

    this.newTournamentForm.get('addPlayerForm.addMe')?.valueChanges.subscribe(val => {
      if (val) {
        this.newTournamentForm.get('addPlayerForm.licensePlate')?.setValidators(Validators.required)
        this.newTournamentForm.get('addPlayerForm.ranking')?.setValidators([Validators.required, Validators.min(1)])
      } else {
        this.newTournamentForm.get('addPlayerForm.licensePlate')?.clearValidators();
        this.newTournamentForm.get('addPlayerForm.ranking')?.clearValidators();
      }
      this.newTournamentForm.get('addPlayerForm.licensePlate')?.updateValueAndValidity()
      this.newTournamentForm.get('addPlayerForm.ranking')?.updateValueAndValidity()
    })
  }

  newTournamentForm = this.fb.group({
    name: ['', Validators.required],
    discipline: ['', Validators.required],
    time: [new Date(), [Validators.required]],
    location: ['', Validators.required], // TODO: use google maps for localization
    maxParticipants: [0, [Validators.required, Validators.min(2)]],
    applicationDeadline: [new Date(), [Validators.required]],
    sponsors: [[]], // TODO: add sponsors to forms
    addPlayerForm: this.fb.group({
      addMe: [true],
      licensePlate: ['', Validators.required],
      ranking: [0, [Validators.required, Validators.min(1)]],
    })
  })


  get name() { return this.newTournamentForm.value.name }
  get discipline() { return this.newTournamentForm.value.discipline }
  get time() { return this.newTournamentForm.value.time }
  get location() { return this.newTournamentForm.value.location }
  get maxParticipants() { return this.newTournamentForm.value.maxParticipants }
  get applicationDeadline() { return this.newTournamentForm.value.applicationDeadline }

  onSubmit() {
    let participants: Player[] = [];
    let ladder: Ladder[] = [];
    let user = this.userService.user;

    if (!user) {
      throw new Error('User is udefined');
    }

    if (this.newTournamentForm.get('addPlayerForm.addMe')?.value) {
      const { addMe, ...info } = this.newTournamentForm.value.addPlayerForm
      let participant: Player = {
        user,
        ...info,
      };

      participants.push(participant);
    }

    let { addPlayerForm, ...tournamentData } = this.newTournamentForm.value;

    let tournament: Tournament = {
      ...tournamentData,
      owner: user,
      participants,
      ladder,
    };

    this.openDialog(tournament);
  }

  openDialog(data: Tournament) {
    const dialogRef = this.dialog.open(AddNewDialogComponent, { data });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.addNewTournament(data);
      }
    })
  }

  addNewTournament(tournament: Tournament) {
    this.tournamentsService.addNewTournament(tournament)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
    // this.router.navigate(['']);
  }
}

export class DateValidators {
  static lesserThan(startControl: AbstractControl | null): ValidatorFn {
    return (endControl: AbstractControl): ValidationErrors | null => {
      const startDate: Date = startControl?.value;
      const endDate: Date = endControl.value;
      if (!startDate || !endDate) {
        return null;
      }
      if (startDate < endDate) {
        return { lesserThan: true };
      }
      return null;
    };
  }
}
