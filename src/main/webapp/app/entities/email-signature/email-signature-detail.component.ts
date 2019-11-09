import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmailSignature } from 'app/shared/model/email-signature.model';

@Component({
  selector: 'jhi-email-signature-detail',
  templateUrl: './email-signature-detail.component.html'
})
export class EmailSignatureDetailComponent implements OnInit {
  emailSignature: IEmailSignature;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ emailSignature }) => {
      this.emailSignature = emailSignature;
    });
  }

  previousState() {
    window.history.back();
  }
}
