import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { IUser } from '../auth/interfaces/interface.interface';
import { IChat, IChatMembers, IContact } from '../../models/models.model';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
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

    create(data?: IChat): Observable<IChat> {
        return this.http.post<IChat>(`${this.baseUrl}/chat`, data, { headers: this.headers })
        .pipe(
            tap((res) => {
                return res;
            }),
            catchError((err) => {
                return throwError( () => 'Error to get userById' );
            })
        );
    }

    createMembersChat(data: IChatMembers): Observable<IChatMembers> {
        return this.http.post<IChatMembers>(`${this.baseUrl}/chat_member`, data , { headers: this.headers })
        .pipe(
            tap((res) => {
                return res;
            }),
            catchError((err) => {
                return throwError( () => 'Error to get userById' );
            })
        );
    }

    getAll(): Observable<IChat[]> {
        return this.http.get<IChat[]>(`${this.baseUrl}/chat`, { headers: this.headers })
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

