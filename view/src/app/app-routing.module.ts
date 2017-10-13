import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { TransmitListComponent } from './transmit-list/transmit-list.component';


const routes: Routes = [
    { path: '', redirectTo: '/fileexplorer', pathMatch: 'full' },
    { path: 'fileexplorer', component: FileExplorerComponent },
    { path: 'transmit', component: TransmitListComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

