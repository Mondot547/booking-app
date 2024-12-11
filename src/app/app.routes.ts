import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [] },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: '**', redirectTo: 'login'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
