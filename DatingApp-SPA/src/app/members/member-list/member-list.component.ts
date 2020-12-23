import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Member } from '../../_models/member';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members: Member[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.members = data.users;
    });
  }
}
