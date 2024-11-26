import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, tap, throwError } from "rxjs";
import { environments } from "../../../environments/environments";
import { IUser, IUserStatus } from "../auth/interfaces/interface.interface";
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class UserStatusesService {
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

    updateUserStatus(id: number | undefined, newUserStatus: IUserStatus): Observable<IUserStatus> {
        return this.http.patch<IUserStatus>(
          `${this.baseUrl}/user_status/${id}`, newUserStatus , { headers: this.headers }
        )
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
