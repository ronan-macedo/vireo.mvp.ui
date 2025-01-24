import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountLoginResquest } from '../../../shared/models/account-login-request.model';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs';
import { AccountLoginResponse } from '../../../shared/models/account-login-response.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const accessTokenStorageKey = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAdmin: boolean = false;

  constructor(private readonly httpClient: HttpClient) { }

  getAccessToken() {
    return sessionStorage.getItem(accessTokenStorageKey);
  }

  login(accountLogin: AccountLoginResquest) {
    return this.httpClient.post<AccountLoginResponse>(`${environment.apiBaseUrl}/accounts/login`, accountLogin, httpOptions).pipe(
      tap((response: AccountLoginResponse) => {
        localStorage.setItem(accessTokenStorageKey, response.accessToken);
        this.isAdmin = response.isAdmin;
      })
    );
  }

  logout() {
    return this.httpClient.post(`${environment.apiBaseUrl}/accounts/logout`, null, httpOptions).pipe(
      tap(() => {
        localStorage.removeItem(accessTokenStorageKey);
        this.isAdmin = false;
      })
    );
  }

  isAuthenticated() {
    return !!localStorage.getItem(accessTokenStorageKey);
  }

  isAdminUser() {
    return this.isAdmin;
  }
}
