import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { IPersonalInfo } from 'app/shared/model/personal-info.model';
import { PersonalInfoService } from 'app/entities/personal-info/personal-info.service';
import { JhiEventManager } from 'ng-jhipster';
import { AccountService } from 'app/core/auth/account.service';
import { Subscription } from 'rxjs';
import { EmailSignatureService } from 'app/entities/email-signature/email-signature.service';
import { IEmailSignature } from 'app/shared/model/email-signature.model';

@Component({
  selector: 'jhi-email-signature-detail',
  templateUrl: './personal-info-selector.component.html'
})
export class PersonalInfoSelectorComponent implements OnInit, OnDestroy {
  personalInfos: IPersonalInfo[];
  currentAccount: any;
  eventSubscriber: Subscription;
  emailSignature: IEmailSignature;
  emailSignatureId: number;

  constructor(
    private route: ActivatedRoute,
    protected emailSignatureService: EmailSignatureService,
    protected personalInfoService: PersonalInfoService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.emailSignatureService.find(this.emailSignatureId).subscribe(response => (this.emailSignature = response.body));
    this.personalInfoService
      .query()
      .pipe(
        filter((res: HttpResponse<IPersonalInfo[]>) => res.ok),
        map((res: HttpResponse<IPersonalInfo[]>) => res.body)
      )
      .subscribe((res: IPersonalInfo[]) => {
        this.personalInfos = res;
      });
  }

  ngOnInit() {
    this.emailSignatureId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInPersonalInfos();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IPersonalInfo) {
    return item.id;
  }

  registerChangeInPersonalInfos() {
    this.eventSubscriber = this.eventManager.subscribe('personalInfoListModification', response => this.loadAll());
  }

  previousState() {
    window.history.back();
  }
}
