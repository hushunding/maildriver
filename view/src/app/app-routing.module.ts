import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainWindComponent } from './main-wind/main-wind.component';
import { LoginWindComponent } from './login-wind/login-wind.component';


const routes: Routes = [
    { path: '', redirectTo: '/login/true', pathMatch: 'full' },
    { path: 'login/:canAutoLogin', component: LoginWindComponent, data :{canAutoLogin: true} },
    { path: 'main/:username', component: MainWindComponent, data: {username: '匿名'} }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

