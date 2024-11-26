import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
// import { JwtHelperService } from '@auth0/angular-jwt';
import { Country, IUser, LoginResponse, ResponseRegister, updateTokenWebPushRequest } from '../interfaces/interface.interface';
import { environments } from '../../../../environments/environments';
import { isPlatformBrowser } from '@angular/common';
import { AppComponent } from '../../../app.component';
// import { AppComponent } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environments.baseUrl;
  private user?: IUser | undefined;
  private userId?: number;
  private authTokenKey: string = 'accessToken';
  private userIdKey: string = 'userId';
  public userSubject = new BehaviorSubject<IUser | undefined>(undefined);
  private headers: HttpHeaders;

  private currentUserSubject: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);
  public currentUserSub$: Observable<IUser | null> = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const accessToken = localStorage.getItem(this.authTokenKey);
      if (accessToken) {
        this.headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set('Authorization', `Bearer ${accessToken}`);
      } else {
        this.headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
      }
    } else {
      this.headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    }
    this.loading(false);
  }

  get currentUser(): IUser|undefined {
    if ( !this.user ) return undefined;
    return {...this.user};
  }

  generateOtp(data: any): Observable<boolean> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    
    return this.http.post<IUser>(`${ this.baseUrl }/user/generate_otp`, data, { headers: headers })
      .pipe(
        tap((user) => {
          this.user = user;
          this.userId = user.id;
          this.userSubject.next(user);
        }),
        map(() => true),
        catchError((err) => {
          if (err.message) {
            return throwError( () => this.errorHandlerLogin(err.error) );
          } else {
            //err.error.errors.[0].msg
            return throwError( () => 'AN_ERROR_OCURRED' );
          }
        })
      );
  }

  verifyAccount(data: any): Observable<boolean> {
    return this.http.post<IUser>(`${ this.baseUrl }/user/validate_otp`, data)
      .pipe(
        tap((res) => {
          console.log('success: ', res)
        }),
        map(() => true),
        catchError((err) => {
          if (err.message) {
            return throwError( () => this.errorHandlerVerifyAccount(err) );
          } else {
            return throwError( () => 'AN_ERROR_OCURRED' );
          }
        })
      );
  }

  create(data: FormData): Observable<boolean> {
    return this.http.post<IUser>(`${ this.baseUrl }/user`, data)
      .pipe(
        tap((user) => {
          this.user = user;
        }),
        map(() => true),
        catchError((err) => {
          console.log('err:', err);
          if (err.message) {
            return throwError( () => this.errorHandlerRegister(err) );
          } else {
            return throwError( () => 'AN_ERROR_OCURRED' );
          }
        })
      );
  }

  update(id: number, data: IUser): Observable<boolean> {
    console.log('register service:', data);
    return this.http.patch<LoginResponse>(`${ this.baseUrl }/user/${id}`, data)
      .pipe(
        tap(({ user, accessToken }) => {
          console.log('user: ', user), accessToken;
          this.user = user;
          this.userId = user.id;
          this.userSubject.next(user);
          if (user.isActive) {
            localStorage.setItem(this.authTokenKey, accessToken);
            localStorage.setItem(this.userIdKey, `${ this.userId }`);
          }
        }),
        map(() => true),
        catchError((err) => {
          console.log('err:', err);
          if (err.message) {
            return throwError( () => this.errorHandlerRegister(err) );
          } else {
            return throwError( () => 'AN_ERROR_OCURRED' );
          }
        })
      );
  }

  updateUsername(id: number, data: IUser): Observable<boolean> {
    console.log('register service:', data);
    return this.http.patch<IUser>(`${ this.baseUrl }/user/update_username/${id}`, data)
      .pipe(
        tap((user ) => {
          console.log('user: ', user);
          this.user = user;
          this.userId = user.id;
          this.userSubject.next(user);
        }),
        map(() => true),
        catchError((err) => {
          console.log('err:', err);
          if (err.message) {
            return throwError( () => this.errorHandlerRegister(err) );
          } else {
            return throwError( () => 'AN_ERROR_OCURRED' );
          }
        })
      );
  }

  login(data: any): Observable<boolean> {
    return this.http.post<LoginResponse>(`${ this.baseUrl }/auth/login`, data, { headers: this.headers })
      .pipe(
        tap(({ user, accessToken }) => {
          this.user = user;
          this.userId = user.id;
          this.userSubject.next(user);
          if (user.isActive) {
            localStorage.setItem(this.authTokenKey, accessToken);
            localStorage.setItem(this.userIdKey, `${ this.userId }`);
          }
        }),
        map(() => true),
        catchError((err) => {
          if (err.message) {
            return throwError( () => this.errorHandlerLogin(err.error) );
          } else {
            return throwError( () => 'AN_ERROR_OCURRED' );
          }
        })
      );
  }

  checkAuthentication(): Observable<boolean> {

    if (typeof localStorage === 'undefined' || localStorage === null) {
      return of(false);
    }

    if (!localStorage.getItem(this.authTokenKey)) {
        return of(false);
    }

    const accessToken = localStorage.getItem(this.authTokenKey);
    const userId      = localStorage.getItem(this.userIdKey);
    const headers     = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${ accessToken }`)

    return this.http.get<IUser>(`${ this.baseUrl }/user/${ userId }`, { headers: headers })
      .pipe(
        tap((res) => {
          this.user = res;
          this.currentUserSubject.next(res);
          this.userSubject.next(res);
        }),
        map(() => true),
        catchError( (err) => {
          return of(false)
        })
      );

  }

  get currentUserSub(): IUser | null {
    return this.currentUserSubject.value;
  }

  getAuthToken() : string|undefined {
    const accessToken = localStorage.getItem(this.authTokenKey);
    if (!accessToken) return undefined;
    return accessToken;
  }

  getUserById(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${ this.baseUrl }/user/${ id }`, { headers: this.headers })
      .pipe(
        tap((res) => this.user = res),
        catchError((err) => {
          return throwError( () => 'Error to get userById' );
        })
      );
  }


  updateTokenWebPush(data: updateTokenWebPushRequest): Observable<boolean> {
    return this.http.patch<any>(`${ this.baseUrl }/user/update_webpush`, data, { headers: this.headers })
      .pipe(
        map(() => true),
        catchError((err) => {
          return throwError( () => 'Error to update token_webpush' );
        })
      );
  }

  errorHandlerLogin(error: any): string {
    if (error.message == 'Error al iniciar sesión') {
      switch (error.error) {
        case 'Usuario o contraseña invalido':
          return error.error
          break;
        case 'Usuario no encontrado por email':
          return error.error
          break;  
      
        default:
          return 'Ocurrio un error inesperado'
          break;
      }
    } else {
      return 'Ocurrio un error inesperado'
    }
  }

  errorHandlerRegister(error: any): string {
    if (error.message == 'Error al crear usuario') {
      switch (error.error) {
        case 'Ya existe un usuario con este username':
          return 'EXISTS_USERNAME'
          break;
        case 'Ya existe un usuario con este teléfono':
          return 'EXISTS_PHONE'
          break;
      
        default:
          return 'AN_ERROR_OCURRED'
          break;
      }
    } else {
      switch (error.message[0]) {
        case 'PASSWORD is not strong enough':
          return 'INSECURE_PASSWORD'
          break;
      
        default:
          return 'AN_ERROR_OCURRED';
          break;
      }
    }
  }

  errorHandlerVerifyAccount(error: any): string {
    if (error.message == 'Error al validar OTP') {
      switch (error.error) {
        case 'Código inválido':
          return 'INVALID_CODE'
          break;
        case 'Tiempo expirado':
          return 'EXPIRED_CODE'
          break;  
      
        default:
          return 'AN_ERROR_OCURRED'
          break;
      }
    } else {
      return 'AN_ERROR_OCURRED'
    }
  }

  errorHandlerRecoverPassword(error: any): string {
    if (error.message == 'Error al recuperar contraseña') {
      switch (error.error) {
        case 'Username no registrado':
          return 'NOT_EXIST_USERNAME'
          break;
      
        default:
          return 'AN_ERROR_OCURRED'
          break;
      }
    } else {
      return 'AN_ERROR_OCURRED'
    }
  }

    /**
	 * Setter para el accessToken en el storage.
	 *
	 * @memberof AuthService
	 */
  set accessToken(token: string)
  {
		localStorage.setItem('accessToken', token);
  }

  /**
   * Getter para el accessToken en el storage.
   *
   * @memberof AuthService
   */
  get accessToken(): string
  {
		return localStorage.getItem('accessToken') ?? '';
  }

//   /**
//    * Verifica si el token ha expirado.
//    *
//    * @returns boolean
//    * @memberof AuthService
//    */
//   loggedIn(): boolean {
// 		const token = this._jwtHelperService.tokenGetter();
// 		if (typeof token === 'string') {
// 				if (!token) {
// 						this.logout();
// 						return false;
// 				}
// 				const tokenExpired: boolean = this._jwtHelperService.isTokenExpired(token);
// 				if (!tokenExpired) {
// 						return !tokenExpired;
// 				} else {
// 						this.logout();
// 						return tokenExpired;
// 				}
// 		} else {
// 				this.logout();
// 				return false;
// 		}
//   }

  /**
   * Remueve el token, redireccionando el usuario al login.
   *
   * @memberof AuthService
   */
  logout(): void {
		localStorage.removeItem('accessToken');
		this.user = undefined;
    this.userSubject.next(undefined);
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.userIdKey);
		location.replace("/");
  }

//   /**
//    * Obtiene el usuario a partir del token de autenticación.
//    *
//    * @returns {string} Nombre de usuario
//    * @memberof AuthService
//    */
//   getUser(): any {
// 		if (this.accessToken === null || this.accessToken === '') {
// 			return {};
// 		}
// 		const token = this.accessToken;
// 		const decodedToken = this._jwtHelperService.decodeToken(token);
// 		const user = { 
// 			ID: decodedToken.ID, 
// 			USERNAME: decodedToken.USERNAME,
// 		};
// 		return user;
//   }

  /**
   * Activa el loading en la pagina.
   *
   * @param {*} flag
   * @memberof AuthService
   */
  loading(flag: any): void {
		AppComponent.loading = flag;
  }
}
