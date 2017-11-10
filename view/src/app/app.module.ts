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
  MatChipsModule
} from '@angular/material';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { UserManComponent } from './user-man/user-man.component';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { TransmitListComponent } from './transmit-list/transmit-list.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    FileExplorerComponent,
    TransmitListComponent,
    UserManComponent,
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
    MatChipsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
