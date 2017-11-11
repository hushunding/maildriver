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
  MatListModule
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


@NgModule({
  declarations: [
    AppComponent,
    FileExplorerComponent,
    TransmitListComponent,
    UserManComponent,
    MainWindComponent,
    LoginWindComponent,
    //TableBasicExample
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
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
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
