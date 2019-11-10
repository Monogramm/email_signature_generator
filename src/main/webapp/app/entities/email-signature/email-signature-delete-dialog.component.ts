import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEmailSignature } from 'app/shared/model/email-signature.model';
import { EmailSignatureService } from './email-signature.service';

@Component({
  selector: 'jhi-email-signature-delete-dialog',
  templateUrl: './email-signature-delete-dialog.component.html'
})
export class EmailSignatureDeleteDialogComponent {
  emailSignature: IEmailSignature;

  constructor(
    protected emailSignatureService: EmailSignatureService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.emailSignatureService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'emailSignatureListModification',
        content: 'Deleted an emailSignature'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-email-signature-delete-popup',
  template: ''
})
export class EmailSignatureDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ emailSignature }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(EmailSignatureDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.emailSignature = emailSignature;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/email-signature', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/email-signature', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
