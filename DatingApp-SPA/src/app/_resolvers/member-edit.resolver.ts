import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Member } from '../_models/member';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Injectable()
export class MemberEditResolver implements Resolve<Member> {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Member> {
    return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
      catchError(() => {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/member/edit']);

        return of(null);
      })
    );
  }
}
