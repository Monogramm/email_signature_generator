import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EmailSignature } from 'app/shared/model/email-signature.model';
import { EmailSignatureService } from './email-signature.service';
import { EmailSignatureComponent } from './email-signature.component';
import { EmailSignatureDetailComponent } from './email-signature-detail.component';
import { EmailSignatureUpdateComponent } from './email-signature-update.component';
import { EmailSignatureDeletePopupComponent } from './email-signature-delete-dialog.component';
import { IEmailSignature } from 'app/shared/model/email-signature.model';
import { PersonalInfoSelectorComponent } from './personal-info-selector.component';
import { GeneratedEmailComponent } from 'app/entities/email-signature/generated-email.component';

@Injectable({ providedIn: 'root' })
export class EmailSignatureResolve implements Resolve<IEmailSignature> {
  constructor(private service: EmailSignatureService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEmailSignature> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EmailSignature>) => response.ok),
        map((emailSignature: HttpResponse<EmailSignature>) => emailSignature.body)
      );
    }
    return of(new EmailSignature());
  }
}

export const emailSignatureRoute: Routes = [
  {
    path: '',
    component: EmailSignatureComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'emailSignatureGeneratorApp.emailSignature.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: EmailSignatureDetailComponent,
    resolve: {
      emailSignature: EmailSignatureResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'emailSignatureGeneratorApp.emailSignature.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: EmailSignatureUpdateComponent,
    resolve: {
      emailSignature: EmailSignatureResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'emailSignatureGeneratorApp.emailSignature.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: EmailSignatureUpdateComponent,
    resolve: {
      emailSignature: EmailSignatureResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'emailSignatureGeneratorApp.emailSignature.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/with/personal-info',
    component: PersonalInfoSelectorComponent,
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':signatureId/with/personal-info/:infoId',
    component: GeneratedEmailComponent,
    canActivate: [UserRouteAccessService]
  }
];

export const emailSignaturePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: EmailSignatureDeletePopupComponent,
    resolve: {
      emailSignature: EmailSignatureResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'emailSignatureGeneratorApp.emailSignature.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
