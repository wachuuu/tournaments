import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user$ = new BehaviorSubject<firebase.User | null>(null);
  user$ = this._user$.asObservable()
  get firebaseUser() { return this._user$.getValue(); }
  set firebaseUser(value: firebase.User | null) { this._user$.next(value); }

  get user(): User { return {
    uid: this.firebaseUser?.uid,
    name: this.firebaseUser?.displayName ?? ''
  }}
  
  constructor(private readonly auth: AuthService) {
    this.auth.user$.subscribe(data => {
      this.firebaseUser = data;
    })

    this.auth.getCurrenUser().then(data => {
      this.firebaseUser = data
    })
  }
}
