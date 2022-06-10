import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(
    private readonly auth: AuthService, 
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  error: string | null = null

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    email: ['', [
      Validators.email,
      Validators.required
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
    ]],
  })

  get firstName() { return this.registerForm.get('firstName') }
  get email() { return this.registerForm.get('email') }
  get password() { return this.registerForm.get('password') }

  signUp() {
    this.auth.signUp(this.registerForm.value.email, this.registerForm.value.password)
    .then(res => {
      this.auth.sendEmailVerification(res)?.then(_ => {
        const message = `Email verification message has been sent to ${this.registerForm.value.email}`
        this.snackBar.open(message, "OK")
      })
      const name = `${this.registerForm.value.firstName} ${this.registerForm.value.lastName}`
      this.auth.updateName(res, name)?.catch(err => {
        this.snackBar.open('There was some error with updating your Name. Try again later', "OK", {
          panelClass: ['snack-err']
        })      
      })
      this.auth.signIn(this.registerForm.value.email, this.registerForm.value.password).then(_ => {
        this.router.navigate(['']);
      })
      .catch(err => {
        this.error = err.message;
      })
    })
    .catch(err => {
      this.error = err.message;
    })
  }
}
