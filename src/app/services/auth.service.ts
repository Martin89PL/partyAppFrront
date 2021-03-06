import {catchError, map } from 'rxjs/operators';
import {environment} from './../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, BehaviorSubject, of} from 'rxjs';
import {User} from '../user/user';
import {UserService} from './user.service';
import {PartyListsService} from './party-lists.service';

interface Login {
  email: string;
  password: string;
}

interface ChangePassword {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
}

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private partyService: PartyListsService
    ) {}

  /** change loggedIn to a subject */
  loggedIn = new BehaviorSubject<boolean>(false);
  /** user profile */
  user = new BehaviorSubject<any>(false);
  /** make isLoggedIn public readonly */
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  getProfile(): Observable<any> {
    return this.user.asObservable();
  }

  login(loginData: Login) {
    return this.http.post(`${environment.api}/auth`, loginData, {responseType: 'json'}).pipe(
      map((data: any) => {
        if (data && data.auth) {
          localStorage.setItem('auth', JSON.stringify(data));
          this.loggedIn.next(true);
          this.userService.getUser().subscribe((user: User) => {
            this.user.next(user);
            this.partyService.getParties(true);
          });
        }
        return data;
      }),
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          throw new Error(err.error.message);
        }
        return of();
      })
    );
  }


  logout() {
    localStorage.removeItem('auth');
    this.loggedIn.next(false);
    this.partyService.getParties(false);
  }

  checkIsUserLogin() {
    return this.http.post(`${environment.api}/auth/check`, null)
      .subscribe((data: any) => {
          if (data && data.auth) {
            localStorage.setItem('auth', JSON.stringify(data));
            this.loggedIn.next(true);
            this.userService.getUser().subscribe((user: User) => {
              this.user.next(user);
            });
          }
        },
        (err) => {
          localStorage.setItem('auth', JSON.stringify({auth: false, token: null}));
          this.loggedIn.next(false);
        }
      );
  }

  updatePassword(data: ChangePassword): Observable<User> {
    return this.http.post(`${environment.api}/auth/update-password`, data).pipe(
      map((userAttrs) => new User(userAttrs))
    );
  }
}
