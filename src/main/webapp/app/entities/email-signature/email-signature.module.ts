import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EmailSignatureGeneratorSharedModule } from 'app/shared/shared.module';
import { EmailSignatureComponent } from './email-signature.component';
import { EmailSignatureDetailComponent } from './email-signature-detail.component';
import { EmailSignatureUpdateComponent } from './email-signature-update.component';
import { EmailSignatureDeletePopupComponent, EmailSignatureDeleteDialogComponent } from './email-signature-delete-dialog.component';
import { emailSignatureRoute, emailSignaturePopupRoute } from './email-signature.route';

const ENTITY_STATES = [...emailSignatureRoute, ...emailSignaturePopupRoute];

@NgModule({
  imports: [EmailSignatureGeneratorSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    EmailSignatureComponent,
    EmailSignatureDetailComponent,
    EmailSignatureUpdateComponent,
    EmailSignatureDeleteDialogComponent,
    EmailSignatureDeletePopupComponent
  ],
  entryComponents: [EmailSignatureDeleteDialogComponent]
})
export class EmailSignatureGeneratorEmailSignatureModule {}
