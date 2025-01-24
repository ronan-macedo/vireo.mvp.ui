import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        loadComponent: () => import('./shared/layouts/main/main.component').then(c => c.MainComponent),
        children: [
            { path: '', loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent), pathMatch: 'full' },
        ],
    },
    {
        path: '',
        loadComponent: () => import('./shared/layouts/landing/landing.component').then(c => c.LandingComponent),
        children: [
            { path: 'login', loadComponent: () => import('./features/login/login.component').then(c => c.LoginComponent) },
            { path: '**', loadComponent: () => import('./features/not-found/not-found.component').then(c => c.NotFoundComponent) },
        ],
    },
];
