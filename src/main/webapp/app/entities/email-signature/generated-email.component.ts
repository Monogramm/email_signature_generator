import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { AccountService } from 'app/core/auth/account.service';
import { HttpClient } from '@angular/common/http';
import { EmailSignatureService } from 'app/entities/email-signature/email-signature.service';

@Component({
  selector: 'jhi-email-signature-detail',
  templateUrl: './generated-email.component.html'
})
export class GeneratedEmailComponent implements OnInit {
  emailSignatureId: number;
  personalInfoId: number;
  email: string;

  constructor(
    protected route: ActivatedRoute,
    protected http: HttpClient,
    protected emailSignatureService: EmailSignatureService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  ngOnInit() {
    this.emailSignatureId = parseInt(this.route.snapshot.paramMap.get('signatureId'), 10);
    this.personalInfoId = parseInt(this.route.snapshot.paramMap.get('infoId'), 10);
    this.emailSignatureService
      .generate(this.emailSignatureId, this.personalInfoId)
      .subscribe(response => (this.email = response.body.trim()));
  }

  previousState() {
    window.history.back();
  }
}
