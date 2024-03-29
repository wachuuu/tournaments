import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tournament } from 'src/app/models/tournament.model';
import { TournamentsService } from 'src/app/services/tournaments.service';
import { UserService } from 'src/app/services/user.service';
import { EditComponent } from '../edit/edit.component';
import { RemoveComponent } from '../remove/remove.component';
import { SignMeOutComponent } from '../sign-me-out/sign-me-out.component';
import { SignMeUpComponent } from '../sign-me-up/sign-me-up.component';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent {

  id: string | null = null;
  
  private _tournament$ = new BehaviorSubject<Tournament | null>(null);
  tournament$: Observable<Tournament | null> = this._tournament$.asObservable();
  private get tournament() { return this._tournament$.getValue() }
  private set tournament(value) { this._tournament$.next(value) }
  user: firebase.User | null = null;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly tournamentsService: TournamentsService,
    private readonly userService: UserService,
    private readonly dialog: MatDialog,
  ) {
    this.activatedRoute.params.subscribe(data => {
      this.id = data['id'];
      if (this.id) {
        this.tournamentsService.getTournamentById(this.id).subscribe(data => {
          this.tournament = data;
        })
      }
    })

    this.tournamentsService.tournaments$.subscribe(data => {
      if (this.tournament?.id) {
        let item = data.find(it => it.id === this.tournament?.id)
        if (item) {
          this.tournament = item;
        }
      }
    })

    this.userService.user$.subscribe(data => {
      this.user = data;
    })
  }

  isOwner(uid: string | null = null) {
    let userId = uid ? uid : this.user?.uid;

    if (userId === this.tournament?.owner.uid) {
      return true;
    }
    return false;
  }

  timePassed(date: Date) {
    let now = new Date();
    let deadline = new Date(date);
    if (now > deadline) {
      return true;
    }
    return false;
  }

  editTournament() {
    this.dialog.open(EditComponent, { data: this.tournament });
  }

  removeTournament() {
    this.dialog.open(RemoveComponent, { data: this.tournament });
  }

  generateLadder() {
    if (this.tournament)
      this.tournamentsService.generateLadder(this.tournament);
  }

  isParticipating() {
    let index = this.tournament?.participants.findIndex(it => it.user.uid === this.user?.uid)
    if (index !== undefined && index > -1) {
      return true;
    }
    return false;
  }

  signMeUp() {
    if (this.user) {
      this.dialog.open(SignMeUpComponent, { data: this.tournament });
    } else {
      this.router.navigate(['/login']);
    }
  }

  signMeOut() {
    if (this.user) {
      this.dialog.open(SignMeOutComponent, { data: this.tournament });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
