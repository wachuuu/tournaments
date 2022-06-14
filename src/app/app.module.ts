import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddNewDialogComponent } from './components/add-new-tournament/add-new-dialog/add-new-dialog.component';
import { AddNewTournamentComponent } from './components/add-new-tournament/add-new-tournament.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditComponent } from './components/edit/edit.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { RemoveComponent } from './components/remove/remove.component';
import { SignMeOutComponent } from './components/sign-me-out/sign-me-out.component';
import { SignMeUpComponent } from './components/sign-me-up/sign-me-up.component';
import { TournamentComponent } from './components/tournament/tournament.component';
import { TournamentsListComponent } from './components/tournaments-list/tournaments-list.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    NavbarComponent,
    AddNewTournamentComponent,
    AddNewDialogComponent,
    TournamentsListComponent,
    EditComponent,
    RemoveComponent,
    SignMeUpComponent,
    SignMeOutComponent,
    TournamentComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule,
    FormsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
