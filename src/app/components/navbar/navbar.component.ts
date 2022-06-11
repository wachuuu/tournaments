import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  buttonMsg = 'Login';

  constructor(private readonly auth: AuthService, private readonly router: Router) {
    this.auth.user$.subscribe(usr => {
      if (usr) {
        this.buttonMsg = 'Log out';
      } else {
        this.buttonMsg = 'Log in';
      } 
    })
  }

  ngOnInit() {
    this.auth.getCurrenUser().then(usr => {
      if (usr) {  
        this.buttonMsg = 'Log out';
      } else {
        this.buttonMsg = 'Log in';
      }
    })
  }

  handleButton() {
    this.auth.getCurrenUser().then(usr => {
      if (usr) {
        this.auth.signOut();
        this.router.navigate(['/login'])
      } else {
        this.router.navigate(['/login'])
      }
    })
  }
}
