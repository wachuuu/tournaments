import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  constructor(
    private readonly auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  resetPasswordForm = this.fb.group({
    email: ['', [
      Validators.email,
      Validators.required
    ]]
  })

  get email() { return this.resetPasswordForm.get('email') }

  resetPassword() {
    this.auth.sendPasswordResetEmail(this.resetPasswordForm.value.email)
      .then(_ => {
        const message = `Reset password instructions has been sent to ${this.resetPasswordForm.value.email}`
        this.snackBar.open(message, "OK");
        this.router.navigate(['/login']);
      })
      .catch(_ => {
        this.snackBar.open('There was some error with resetting your password. Try again later.', "OK", {
          panelClass: ['snack-err']
        });
        this.resetPasswordForm.reset();
      })
  }
}
