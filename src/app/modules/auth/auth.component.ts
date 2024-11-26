import { Component } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, RegisterComponent],
  templateUrl: './auth.component.html',
})
export class AuthComponent {

}
