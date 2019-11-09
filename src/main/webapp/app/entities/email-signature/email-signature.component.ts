import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';

import { IEmailSignature } from 'app/shared/model/email-signature.model';
import { AccountService } from 'app/core/auth/account.service';
import { EmailSignatureService } from './email-signature.service';

@Component({
  selector: 'jhi-email-signature',
  templateUrl: './email-signature.component.html'
})
export class EmailSignatureComponent implements OnInit, OnDestroy {
  emailSignatures: IEmailSignature[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected emailSignatureService: EmailSignatureService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.emailSignatureService
      .query()
      .pipe(
        filter((res: HttpResponse<IEmailSignature[]>) => res.ok),
        map((res: HttpResponse<IEmailSignature[]>) => res.body)
      )
      .subscribe((res: IEmailSignature[]) => {
        this.emailSignatures = res;
      });
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInEmailSignatures();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IEmailSignature) {
    return item.id;
  }

  registerChangeInEmailSignatures() {
    this.eventSubscriber = this.eventManager.subscribe('emailSignatureListModification', response => this.loadAll());
  }
}
