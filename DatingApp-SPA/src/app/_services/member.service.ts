import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AuthService } from './auth.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  baseUrl = environment.apiUrl;
  user: User;
  userParams: UserParams;
  memberCache = new Map();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
    }

    let params = getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('gender', userParams.gender);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(this.http, this.baseUrl + 'users', params)
      .pipe(
        map(response => {
          this.memberCache.set(Object.values(userParams).join('-'), response)
          return response;
        })
      );
  }

  getMember(username: string): Observable<Member> {
    const member = [...this.memberCache.values()]
      .reduce((members: Member[], paginatedResult) => members.concat(paginatedResult.result), [])
      .find((m: Member) => m.username === username);

    if (member) {
      return of(member);
    }

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member);
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize)
    params = params.append('predicate', predicate);

    return getPaginatedResult<Partial<Member[]>>(this.http, this.baseUrl + 'likes', params);
  }
}
