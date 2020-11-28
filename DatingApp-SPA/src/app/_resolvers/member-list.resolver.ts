import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Member } from '../_models/member';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';

@Injectable()
export class MemberListResolver implements Resolve<Member[]> {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Member[]> {
    return this.userService.getUsers().pipe(
      catchError(() => {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/home']);

        return of(null);
      })
    );
  }
}
