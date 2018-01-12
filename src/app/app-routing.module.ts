import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { AuthGuard } from './auth-guard';
import { AuthService } from './auth/auth.service';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [ AuthGuard ]},
  { path: 'home', component: HomeComponent,  canActivate: [ AuthGuard ]},
  { path: 'workspace', loadChildren: 'app/workspace/workspace.module#WorkspaceModule',canActivate: [ AuthGuard ] },
  // { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule',canActivate: [ AuthGuard ] },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
