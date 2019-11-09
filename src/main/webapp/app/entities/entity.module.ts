import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'personal-info',
        loadChildren: () => import('./personal-info/personal-info.module').then(m => m.EmailSignatureGeneratorPersonalInfoModule)
      },
      {
        path: 'email-signature',
        loadChildren: () => import('./email-signature/email-signature.module').then(m => m.EmailSignatureGeneratorEmailSignatureModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class EmailSignatureGeneratorEntityModule {}
