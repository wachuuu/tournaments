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

  signUp(email: string, password: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }

  signIn(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    this.angularFireAuth.signOut();
  }

  updateName(credential: firebase.auth.UserCredential, value: string) {
    return credential.user?.updateProfile({ displayName: value });
  }

  sendEmailVerification(credential: firebase.auth.UserCredential) {
    return credential.user?.sendEmailVerification();
  }

  sendPasswordResetEmail(email: string) {
    return this.angularFireAuth.sendPasswordResetEmail(email);
  }
}
