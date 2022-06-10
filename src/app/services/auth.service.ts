import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User | null>

  constructor(private readonly angularFireAuth: AngularFireAuth, private readonly router: Router) {
    this.user$ = angularFireAuth.authState;
  }

  checkUser() {
    this.angularFireAuth.currentUser.then(data => {
      console.log(data);
    })
  }

  signUp(email: string, password: string) {
    this.angularFireAuth.createUserWithEmailAndPassword(email, password)
    .then(res => {
      this.signIn(email, password)
    })
    .catch(err => {
      console.log('error', err.message);
    })
  }

  signIn(email: string, password: string) {
    this.angularFireAuth.signInWithEmailAndPassword(email, password).then(res => {
      this.router.navigate(['']);
    })
    .catch(err => {
      console.log('error', err.message);
    })
  }

  signOut() {
    this.angularFireAuth.signOut();
  }
}
