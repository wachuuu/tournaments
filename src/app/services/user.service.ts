import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user$ = new BehaviorSubject<firebase.User | null>(null);
  user$ = this._user$.asObservable()
  get user() { return this._user$.getValue(); }
  set user(value: firebase.User | null) { this._user$.next(value); }

  constructor(private readonly auth: AuthService) {
    this.auth.user$.subscribe(data => {
      this.user = data;
    })

    this.auth.getCurrenUser().then(data => {
      this.user = data
    })
  }
}
