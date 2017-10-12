import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransmitListComponent } from './TransmitList/transmit-list.component';
import { FileExplorerComponent } from './FileExplorer/file-explorer.component';


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