import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatIconModule, MatTabsModule, MatAutocompleteModule, MatToolbarModule, MatButtonModule, MatCardModule, MatTableModule 
} from '@angular/material';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { UserManComponent } from './user-man/user-man.component';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { TransmitListComponent } from './transmit-list/transmit-list.component';
import { CdkTableModule } from '@angular/cdk/table';


@NgModule({
  declarations: [
    AppComponent,
    FileExplorerComponent,
    TransmitListComponent,
    UserManComponent
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
    MatTableModule,
    CdkTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
