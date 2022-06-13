import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
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
}
