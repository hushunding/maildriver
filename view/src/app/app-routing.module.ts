import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainWindComponent } from './main-wind/main-wind.component';
import { LoginWindComponent } from './login-wind/login-wind.component';


const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginWindComponent },
    { path: 'main', component: MainWindComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

