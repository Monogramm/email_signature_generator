import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EmailSignatureGeneratorSharedModule } from 'app/shared/shared.module';
import { PersonalInfoComponent } from './personal-info.component';
import { PersonalInfoDetailComponent } from './personal-info-detail.component';
import { PersonalInfoUpdateComponent } from './personal-info-update.component';
import { PersonalInfoDeletePopupComponent, PersonalInfoDeleteDialogComponent } from './personal-info-delete-dialog.component';
import { personalInfoRoute, personalInfoPopupRoute } from './personal-info.route';

const ENTITY_STATES = [...personalInfoRoute, ...personalInfoPopupRoute];

@NgModule({
  imports: [EmailSignatureGeneratorSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    PersonalInfoComponent,
    PersonalInfoDetailComponent,
    PersonalInfoUpdateComponent,
    PersonalInfoDeleteDialogComponent,
    PersonalInfoDeletePopupComponent
  ],
  entryComponents: [PersonalInfoDeleteDialogComponent]
})
export class EmailSignatureGeneratorPersonalInfoModule {}
