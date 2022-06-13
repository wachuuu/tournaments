import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Tournament } from 'src/app/models/tournament.model';
import { TournamentsService } from 'src/app/services/tournaments.service';
import { UserService } from 'src/app/services/user.service';
import { EditComponent } from '../edit/edit.component';
import { RemoveComponent } from '../remove/remove.component';

@Component({
  selector: 'app-tournaments-list',
  templateUrl: './tournaments-list.component.html',
  styleUrls: ['./tournaments-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TournamentsListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<Tournament>;
  searchVal = '';
  displayedColumns = ['name', 'discipline', 'time', 'owner', 'location']
  displayedColumnsExpand = [...this.displayedColumns, 'expand']
  expandedElement: Tournament | null = null;
  user: firebase.User | null = null;

  constructor(
    private readonly tournamentsService: TournamentsService,
    private readonly userService: UserService,    
    private readonly router: Router,
    public dialog: MatDialog,
    ) {
    this.sort = new MatSort();
    this.dataSource = new MatTableDataSource();

    this.userService.user$.subscribe(data => {
      this.user = data;
    })
    
    this.tournamentsService.tournaments$.subscribe(data => {
      this.dataSource.data = data;
    })

    this.dataSource.filterPredicate = (data, filter) => {
      let matchRow = true;
      let keywords = filter.split(' ');
      let dataStr = data.name + ' ' + data.owner.name;

      keywords.forEach(key => {
        if (dataStr.toLowerCase().indexOf(key.toLowerCase()) === -1) {
          matchRow = false;
        }
      })
      return matchRow;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applySearch(filter: string) {
    this.dataSource.filter = filter;
  }

  clearSearch() {
    this.applySearch('');
    this.searchVal = '';
  }

  showDetails(item: Tournament) {
    this.expandedElement = this.expandedElement === item ? null : item;
  }

  signMeUp(id: string) {
    if (this.user) {
      // TODO: interaction with API
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  signMeOut(id: string) {
    if (this.user) {
      // TODO: interaction with API
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToTournament(id: string) {
    // TODO: navigate to /tournaments/id
  }

  editTournament(data: Tournament) {
    this.dialog.open(EditComponent, { data });
  }

  removeTournament(data: Tournament) {
    this.dialog.open(RemoveComponent, { data });
  }

  isOwner(uid: string) {
    if (this.user?.uid === uid) {
      return true;
    }
    return false;
  }

  isParticipating(id: string) {
    let tournament = this.dataSource.data.find(it => it.id === id)
    let index = tournament?.participants.findIndex(it => it.user.uid === this.user?.uid)
    if (index !== undefined && index > -1) {
      return true;
    }
    return false;
  }

  timePassed(date: Date) {
    let now = new Date();
    let deadline = new Date(date);
    if (now > deadline) {
      return true;
    }
    return false;
  }
}
