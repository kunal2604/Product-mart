import { Injectable } from '@angular/core';
import {of, Subject, throwError, EMPTY} from 'rxjs';
import {switchMap, catchError} from 'rxjs/operators';
import {User} from './user';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';

interface UserDto {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new Subject<User>();
  private apiUrl = '/api/auth/';

  constructor(private httpClient: HttpClient, private tokenStorage: TokenStorageService) { }

  login(email: string, password: string) {
    const loginCredentials = {email, password};
    console.log('User login credentials', loginCredentials);
    return this.httpClient
      .post<UserDto>(`${this.apiUrl}login`, loginCredentials)
      .pipe(
      switchMap(({user, token}) => {
        this.setUser(user);
        this.tokenStorage.setToken(token);
        console.log(`user found`, user);
        return of(user);
      }),
      catchError(e => {
        console.log(`Server error Occured ${e.error.message}`, e);
        return throwError(`Your login details could not be , please try again.`);
      })
    );
  }

  logout() {
    // clean up subject or remove user from subject
    // remove token from local storage (browser)
    this.tokenStorage.removeToken();
    this.setUser(null);
    console.log('User Logged out succesfully');
  }

  getUser() {
    return this.user$.asObservable();
  }

  register(userToSave: any) {
    // register user and save the credentials to it to DB and returning back the token as a response when the user is created..
    return this.httpClient.post<any>(`${this.apiUrl}register`, userToSave).pipe(
      switchMap(({ user, token }) => {
        this.setUser(user);
        this.tokenStorage.setToken(token);
        console.log(`user reistered sucessfully`, user);
        return of(user);
      }),
      catchError (e => {
        console.log(`Server Error occured`, e);
        return throwError(`User Registration Failed, please contact admin`);
      })
    );
  }

  findMe() {
    // check if the token is in browser memory and see if the user is still logged in after the page is refreshesd.
    const token = this.tokenStorage.getToken();
    if (!token) {
      return EMPTY;
    }
    return this.httpClient
      .get<any>(`${this.apiUrl}findme`)
      .pipe(
      switchMap(({user}) => {
        this.setUser(user);
        console.log(`user found`, user);
        return of(user);
      }),
      catchError(e => {
        console.log(`Your login details could not be verified, please try again.`, e);
        return throwError(`Your login details could not be verified, please try again.`);
      })
    );
  }

  private setUser(user) {
    this.user$.next(user);
  }
}
