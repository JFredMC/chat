import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { GeneralReportService } from './general.service';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { IUser } from '../auth/interfaces/interface.interface';
import { IContact } from '../../models/models.model';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
    private isModalOpenSubject = new BehaviorSubject<boolean>(false);
    isModalOpen$ = this.isModalOpenSubject.asObservable();
    private baseUrl: string = environments.baseUrl;
    private user?: IUser | undefined;
    private userId?: number;
    private authTokenKey: string = 'accessToken';
    private userIdKey: string = 'userId';
    public userSubject = new BehaviorSubject<IUser | undefined>(undefined);
    private headers: HttpHeaders;

    constructor(
        private http: HttpClient, 
    ) {
        const accessToken = localStorage.getItem(this.authTokenKey);
        if (accessToken) {
            this.headers = new HttpHeaders()
            .set('Content-Type', 'application/json').set('Authorization', `Bearer ${accessToken}`);
        } else {
            this.headers = new HttpHeaders()
            .set('Content-Type', 'application/json');
        }
    }

    getById(id: number): Observable<IContact[]> {
        return this.http.get<IContact[]>(`${this.baseUrl}/contact/${id}`, { headers: this.headers })
        .pipe(
            tap((res) => {
                return res;
            }),
            catchError((err) => {
                return throwError( () => 'Error to get userById' );
            })
        );
    }

    getAll(): Observable<IContact[]> {
        return this.http.get<IContact[]>(`${this.baseUrl}/contact`, { headers: this.headers })
        .pipe(
            tap((res) => {
                return res;
            }),
            catchError((err) => {
                return throwError( () => 'Error to get userById' );
            })
        );
    }

    findAllByUserId(userId: number): Observable<IContact[]> {
        return this.http.get<IContact[]>(`${this.baseUrl}/contact/by_user/${userId}`, { headers: this.headers })
        .pipe(
            tap((res) => {
                return res;
            }),
            catchError((err) => {
                return throwError( () => 'Error to get userById' );
            })
        );
    }

     // Verificar si el nombre de usuario existe
  checkUsernameExists(username: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseUrl}/user/by_username/${username}`)
      .pipe(
        map(response => response),
        catchError(() => of())
      );
  }

  // Crear un nuevo contacto
  createContact(contact: IContact): Observable<IContact> {
    return this.http.post<IContact>(`${this.baseUrl}/contact`, contact, { headers: this.headers } )
        .pipe(
            tap((res) => {
                return res;
            }),
            catchError((err) => {
                return throwError( () => 'Error to get userById' );
            })
        );
  }
}
