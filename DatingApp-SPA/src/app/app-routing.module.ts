import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { appRoutes } from './routes';

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
