import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  MatIconModule,
  MatTabsModule,
  MatAutocompleteModule,
  MatToolbarModule,
  MatButtonModule,
  MatCardModule,
  MatTableModule,
  MatSortModule,
  MatCheckboxModule,
  MatChipsModule,
  MatInputModule,
  MatSelectModule,
  MatListModule,
  MatDialogModule,
  MatStepperModule,
  MatSnackBarModule,
  MatMenuModule
} from '@angular/material';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { UserManComponent } from './user-man/user-man.component';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { TransmitListComponent } from './transmit-list/transmit-list.component';
import { HttpClientModule } from '@angular/common/http';
import { MainWindComponent } from './main-wind/main-wind.component';
import { LoginWindComponent } from './login-wind/login-wind.component';
import { SignupUserComponent } from './signup-user/signup-user.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    FileExplorerComponent,
    TransmitListComponent,
    UserManComponent,
    MainWindComponent,
    LoginWindComponent,
    SignupUserComponent,
    //TableBasicExample
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSortModule,
    MatTableModule,
    HttpClientModule,
    MatCheckboxModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatStepperModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  providers: [],
  entryComponents: [
    SignupUserComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
