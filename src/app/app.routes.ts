import { Routes } from '@angular/router';
import { PublicGuard } from './modules/auth/guards/public.guard';
import { AuthGuard } from './modules/auth/guards/auth.guard';

export const routes: Routes = [
    {
        path: '', 
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        canActivate: [ PublicGuard ],
        loadComponent: () => import('./modules/auth/auth.component').then((m) => m.AuthComponent),
        children: [
            {
              path: 'login',
              loadComponent: () => import('./modules/auth/components/login/login.component').then((m) => m.LoginComponent),
            },
            {
              path: 'register',
              loadComponent: () => import('./modules/auth/components/register/register.component').then((m) => m.RegisterComponent),
            },
        ]
    },
    {
        path: 'dashboard',
        canActivate: [ AuthGuard ],
        loadComponent: () => import('./modules/chat-dashboard/chat-dashboard.component').then((m) => m.ChatDashboardComponent),
        children: [
            // {
            //   path: 'chat',
            //   loadComponent: () => import('./modules/chats/chat/chat.component').then((m) => m.ChatComponent),
            // },
        ]
    }
];
