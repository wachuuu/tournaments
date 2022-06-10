import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private readonly auth: AuthService, 
    private fb: FormBuilder,
    private router: Router) { }

  error: string | null = null

  loginForm = this.fb.group({
    email: ['', [
      Validators.email,
      Validators.required
    ]],
    password: ['', Validators.required],
  })

  get email() { return this.loginForm.get('email') }
  get password() { return this.loginForm.get('password') }

  signIn() {
    this.auth.signIn(this.loginForm.value.email, this.loginForm.value.password)
    .then(res => {
      this.router.navigate(['']);
    })
    .catch(err => {
      this.error = err.message;
      this.loginForm.reset();
    })
  }
}
