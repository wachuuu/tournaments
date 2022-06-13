import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tournament } from 'src/app/models/tournament.model';
import { TournamentsService } from 'src/app/services/tournaments.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Tournament,
    private readonly fb: FormBuilder,
    private readonly tournamentsService: TournamentsService,
  ) {}

  tournamentForm = this.fb.group({
    name: [this.data.name, Validators.required],
    description: [this.data.description],
    discipline: [this.data.discipline, Validators.required],
    time: [new Date(this.data.time), [Validators.required]],
    location: [this.data.location, Validators.required], // TODO: use google maps for localization
    maxParticipants: [this.data.maxParticipants, [Validators.required, Validators.min(2)]],
    applicationDeadline: [new Date(this.data.applicationDeadline), [Validators.required]],
  })

  get name() { return this.tournamentForm.value.name }
  get discipline() { return this.tournamentForm.value.discipline }
  get time() { return this.tournamentForm.value.time }
  get location() { return this.tournamentForm.value.location }
  get maxParticipants() { return this.tournamentForm.value.maxParticipants }
  get applicationDeadline() { return this.tournamentForm.value.applicationDeadline }

  onSubmit() {
    if(!this.data.id) {
      throw new Error('Object ID is not defined');
    }
    this.tournamentForm.value.time = this.tournamentForm.value.time.toString()
    this.tournamentForm.value.applicationDeadline = this.tournamentForm.value.applicationDeadline.toString()
    this.tournamentsService.editTournament(this.data.id, this.tournamentForm.value);
  }
}
