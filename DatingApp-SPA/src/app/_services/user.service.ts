import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.baseUrl + 'users');
  }

  getUser(username: string): Observable<Member> {
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateUser(user: Member) {
    return this.http.put(this.baseUrl + 'users', user);
  }
}
