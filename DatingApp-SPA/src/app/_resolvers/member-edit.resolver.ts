import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Member } from '../_models/member';
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
    return this.memberService.getUser(this.authService.decodedToken.nameid).pipe(
      catchError(() => {
        this.toastr.error('Problem retrieving data');
        this.router.navigate(['/member/edit']);

        return of(null);
      })
    );
  }
}
