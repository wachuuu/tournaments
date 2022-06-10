import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private readonly auth: AuthService) { }

  ngOnInit(): void {
  }

  email = 'gab.wachowski15@gmail.com'
  pass = 'pass123';

  signUp() {
    this.auth.signUp(this.email, this.pass);
  }

  signIn() {
    this.auth.signIn(this.email, this.pass);
  }

  signOut() {
    this.auth.signOut();
  }
}
