import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RoleOption, RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: Partial<User[]>
  roleModalRef: BsModalRef;

  constructor(private adminService: AdminService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(users => {
      this.users = users;
    })
  }

  openRolesModal(user: User) {
    const config: ModalOptions = {
      class: 'modal-dialog-centered',
      initialState: {
        user,
        roles: this.getRoleOptions(user)
      }
    };

    this.roleModalRef = this.modalService.show(RolesModalComponent, config);
    this.roleModalRef.content.closeBtnName = 'Close';
    this.roleModalRef.content.updateSelectedRoles.subscribe((roleOptions: RoleOption[]) => {
      const rolesToUpdate = roleOptions.filter(ro => ro.checked === true).map(ro => ro.name);

      if (rolesToUpdate) {
        this.adminService.updateUserRoles(user.username, rolesToUpdate).subscribe(() => {
          user.roles = rolesToUpdate;
        });
      }
      
    })
  }

  private getRoleOptions(user: User) {
    const roles = [];
    const availableRoleOptions: RoleOption[] = [
      {name: 'Admin', value: 'admin', checked: false},
      {name: 'Moderator', value: 'moderator', checked: false},
      {name: 'Member', value: 'member', checked: false}
    ];

    availableRoleOptions.forEach(roleOption => {
      for (const userRole of user.roles) {
        if (roleOption.name === userRole) {
          roleOption.checked = true;
          break;
        }
      }

      roles.push(roleOption)
    });

    return roles;
  }
}
