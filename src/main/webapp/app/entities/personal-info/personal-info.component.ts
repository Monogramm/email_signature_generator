import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';

import { IPersonalInfo } from 'app/shared/model/personal-info.model';
import { AccountService } from 'app/core/auth/account.service';
import { PersonalInfoService } from './personal-info.service';

@Component({
  selector: 'jhi-personal-info',
  templateUrl: './personal-info.component.html'
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  personalInfos: IPersonalInfo[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected personalInfoService: PersonalInfoService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
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
}
