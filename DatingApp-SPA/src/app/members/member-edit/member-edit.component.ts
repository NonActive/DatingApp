import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';

import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';

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
    private alertify: AlertifyService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.member = data.user;
    });
  }

  updateUser() {
    this.userService.updateUser(this.member).subscribe(
      (next) => {
        this.alertify.success('Profile updated succesfully');
        this.editForm.reset(this.member);
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }
}
