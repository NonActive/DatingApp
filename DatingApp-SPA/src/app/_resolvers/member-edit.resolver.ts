import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { Member } from '../_models/member';
import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';
import { MemberService } from '../_services/member.service';

@Injectable()
export class MemberEditResolver implements Resolve<Member> {
  constructor(
    private memberService: MemberService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Member> {
    let currentUser: User;

    this.authService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);

    return this.memberService
      .getMember(currentUser.username)
      .pipe(
        catchError(() => {
          this.toastr.error('Problem retrieving data');
          this.router.navigate(['/member/edit']);

          return of(null);
        })
      );
  }
}
