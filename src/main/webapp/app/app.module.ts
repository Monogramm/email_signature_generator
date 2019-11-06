import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { EmailSignatureGeneratorSharedModule } from 'app/shared/shared.module';
import { EmailSignatureGeneratorCoreModule } from 'app/core/core.module';
import { EmailSignatureGeneratorAppRoutingModule } from './app-routing.module';
import { EmailSignatureGeneratorHomeModule } from './home/home.module';
import { EmailSignatureGeneratorEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { JhiMainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    EmailSignatureGeneratorSharedModule,
    EmailSignatureGeneratorCoreModule,
    EmailSignatureGeneratorHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    EmailSignatureGeneratorEntityModule,
    EmailSignatureGeneratorAppRoutingModule
  ],
  declarations: [JhiMainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [JhiMainComponent]
})
export class EmailSignatureGeneratorAppModule {}
