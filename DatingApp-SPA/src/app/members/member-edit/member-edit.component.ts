import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';

import { MemberService } from '../../_services/member.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  member: Member;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.member = data.user;
    });
  }

  updateUser() {
    this.memberService.updateUser(this.member).subscribe(
      (next) => {
        this.toastr.success('Profile updated succesfully');
        this.editForm.reset(this.member);
      },
      (error) => {
        this.toastr.error(error);
      }
    );
  }
}
