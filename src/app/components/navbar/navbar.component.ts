import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent   {
  buttonMsg = 'Login';

  constructor(
    private readonly auth: AuthService,
    private readonly userService: UserService, 
    private readonly router: Router) {
    this.userService.user$.subscribe(data => {
      if (data) {
        this.buttonMsg = 'Log out';
      } else {
        this.buttonMsg = 'Log in';
      } 
    })
  }

  handleButton() {
    if (this.userService.user) {
      this.auth.signOut();
      this.router.navigate(['/login'])
    } else {
      this.router.navigate(['/login'])
    }
  }
}
