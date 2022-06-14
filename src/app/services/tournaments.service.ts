import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Player } from '../models/player.model';
import { Tournament } from '../models/tournament.model';

@Injectable({
  providedIn: 'root'
})
export class TournamentsService {

  private _tournaments$ = new BehaviorSubject<Tournament[]>([]);
  tournaments$ = this._tournaments$.asObservable()
  get tournaments() { return this._tournaments$.getValue(); }
  set tournaments(value: Tournament[]) { this._tournaments$.next(value) }

  tournamentsCol: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore, private snackBar: MatSnackBar) {
    this.tournamentsCol = this.db.collection("tournaments");
    this.getAllTournaments().subscribe()
  }

  async addNewTournament(data: Tournament) {
    return this.tournamentsCol.add(data)
      .then(res => {
        let newObj: Tournament = {
          id: res.id,
          path: res.path,
          ...data,
        };
        this.tournaments = [newObj, ...this.tournaments];
        return newObj;
      })
      .catch(e => {
        this.snackBar.open('Adding your tournament failed. Try again later.', "OK", {
          panelClass: ['snack-err']
        });
        return e;
      })
  }

  async editTournament(id: string, body: Object) {
    return this.tournamentsCol.doc(id).update(body)
      .then(res => {
        let index = this.tournaments.findIndex(it => it.id === id)
        if (index > -1) {
          let updated = { ...this.tournaments[index], ...body };
          let newTournaments = [...this.tournaments];
          newTournaments[index] = updated;
          this.tournaments = newTournaments;
          this.snackBar.open('Tournament has been updated', "OK");
        } else {
          this.snackBar.open('Could not find tournament id', "OK", {
            panelClass: ['snack-err']
          });
        }
        return res;
      })
      .catch(e => {
        this.snackBar.open('Tournament update failed. Try again later', "OK", {
          panelClass: ['snack-err']
        });
        return e;
      })
  }

  async removeTournament(id: string) {
    return this.tournamentsCol.doc(id).delete()
      .then(res => {
        let index = this.tournaments.findIndex(it => it.id === id)
        let newTournaments = [...this.tournaments];
        newTournaments.splice(index, 1);
        this.tournaments = newTournaments;
        this.snackBar.open('Tournament has been removed', "OK");
        return res;
      })
      .catch(e => {
        this.snackBar.open('Tournament deletion failed. Try again later', "OK", {
          panelClass: ['snack-err']
        });
        return e;
      })
  }

  getTournamentById(id: string): Observable<Tournament | null> {
    return this.tournamentsCol.doc(id).get()
    .pipe(
      map(doc => {
        if (doc.data()) {
          return {
            id: doc.id,
            path: doc.ref.path,
            ...doc.data()
          };
        }
        return null;
      })
    )
  }

  getAllTournaments(): Observable<Tournament[]> {
    return this.tournamentsCol.get()
      .pipe(
        map(snapshot => {
          return snapshot.docs.map(item => {
            return {
              id: item.id,
              path: item.ref.path,
              ...item.data()
            }
          });
        }),
        tap(data => this.tournaments = data)
      )
  }

  signUpToATournament(id: string, player: Player) {
    let tournament = this.tournaments.find(it => it.id === id);
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    let participants = tournament.participants;
    participants = [...participants, player];
    let body = { participants: participants }

    this.editTournament(id, body);
  }

  signOutFromATournament(id: string, uid: string) {
    let tournament = this.tournaments.find(it => it.id === id);
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    let participants = tournament.participants;
    let index = participants.findIndex(it => it.user.uid === uid);
    participants.splice(index, 1);
    let body = { participants: participants }

    this.editTournament(id, body);
  }
}
