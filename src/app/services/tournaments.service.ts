import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Duel } from '../models/duel.model';
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

  async editTournament(id: string, body: Object, message: string = 'Tournament has been updated') {
    return this.tournamentsCol.doc(id).update(body)
      .then(res => {
        let index = this.tournaments.findIndex(it => it.id === id)
        if (index > -1) {
          let updated = { ...this.tournaments[index], ...body };
          let newTournaments = [...this.tournaments];
          newTournaments[index] = updated;
          this.tournaments = newTournaments;
          this.snackBar.open(message, "OK");
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

  generateLadder(data: Tournament) {
    if (!data || !data.id) {
      return Promise.reject({ mesage: 'Cannot generate Ladder. Tournament is incomplete.' });
    }
    let participants = [...data.participants];
    if (participants.length % 2 !== 0) {
      this.snackBar.open('Ladder generating failed. There must be an even number of participants.', "OK", {
        panelClass: ['snack-err']
      });
      return Promise.reject({ mesage: 'Ladder generating failed. There must be an even number of participants.' });
    }

    participants = this.shuffle(participants);
    let duels: Duel[] = []

    let index = 0;
    while (participants.length > 0) {
      let [playerA, playerB] = participants.splice(0, 2);
      let playerOne = {
        player: playerA,
        previousDuelId: null,
      };
      
      let playerTwo = {
        player: playerB,
        previousDuelId: null,
      };

      let duel: Duel = {
        id: index,
        playerOne,
        playerTwo,
        round: 0,
        winner: null,
      }

      duels = [...duels, duel];
      index++;
    }

    return this.editTournament(data.id, { ladder: duels }, 'Ladder has been initialized');
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

    this.editTournament(id, body, 'Signed up to a tournament');
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

    this.editTournament(id, body, 'Signed out from a tournament');
  }

  private shuffle(array: Array<any>) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
}
