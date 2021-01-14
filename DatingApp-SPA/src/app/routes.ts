import { Routes } from '@angular/router';

import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
      {
        path: 'members',
        component: MemberListComponent,
      },
      {
        path: 'members/:username',
        component: MemberDetailComponent,
        resolve: { member: MemberDetailResolver },
      },
      {
        path: 'member/edit',
        component: MemberEditComponent,
        resolve: { user: MemberEditResolver },
        canDeactivate: [PreventUnsavedChanges],
      },
    ],
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];
