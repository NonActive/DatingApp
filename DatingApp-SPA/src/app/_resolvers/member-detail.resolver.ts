import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Member } from '../_models/member';
import { MemberService } from '../_services/member.service';

@Injectable()
export class MemberDetailResolver implements Resolve<Member> {
  constructor(
    private memberService: MemberService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Member> {
    return this.memberService.getMember(route.params.username).pipe(
      catchError(() => {
        this.toastr.error('Problem retrieving data');
        this.router.navigate(['/members']);

        return of(null);
      })
    );
  }
}
