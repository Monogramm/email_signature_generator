import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PersonalInfo } from 'app/shared/model/personal-info.model';
import { PersonalInfoService } from './personal-info.service';
import { PersonalInfoComponent } from './personal-info.component';
import { PersonalInfoDetailComponent } from './personal-info-detail.component';
import { PersonalInfoUpdateComponent } from './personal-info-update.component';
import { PersonalInfoDeletePopupComponent } from './personal-info-delete-dialog.component';
import { IPersonalInfo } from 'app/shared/model/personal-info.model';

@Injectable({ providedIn: 'root' })
export class PersonalInfoResolve implements Resolve<IPersonalInfo> {
  constructor(private service: PersonalInfoService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPersonalInfo> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<PersonalInfo>) => response.ok),
        map((personalInfo: HttpResponse<PersonalInfo>) => personalInfo.body)
      );
    }
    return of(new PersonalInfo());
  }
}

export const personalInfoRoute: Routes = [
  {
    path: '',
    component: PersonalInfoComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'emailSignatureGeneratorApp.personalInfo.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PersonalInfoDetailComponent,
    resolve: {
      personalInfo: PersonalInfoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'emailSignatureGeneratorApp.personalInfo.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PersonalInfoUpdateComponent,
    resolve: {
      personalInfo: PersonalInfoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'emailSignatureGeneratorApp.personalInfo.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PersonalInfoUpdateComponent,
    resolve: {
      personalInfo: PersonalInfoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'emailSignatureGeneratorApp.personalInfo.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const personalInfoPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: PersonalInfoDeletePopupComponent,
    resolve: {
      personalInfo: PersonalInfoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'emailSignatureGeneratorApp.personalInfo.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
