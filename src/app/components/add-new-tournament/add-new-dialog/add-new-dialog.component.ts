import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tournament } from 'src/app/models/tournament.model';

@Component({
  selector: 'app-add-new-dialog',
  templateUrl: './add-new-dialog.component.html',
  styleUrls: ['./add-new-dialog.component.scss']
})
export class AddNewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Tournament) {}
}
