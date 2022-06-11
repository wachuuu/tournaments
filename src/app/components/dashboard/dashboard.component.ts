import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  userName: string | null = null;
  
  constructor(private readonly userService: UserService) {
    this.userService.user$.subscribe(data => {
      this.userName = data?.displayName ?? null;
    })
  }
}
