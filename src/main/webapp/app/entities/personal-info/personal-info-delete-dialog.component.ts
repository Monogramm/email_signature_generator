import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPersonalInfo } from 'app/shared/model/personal-info.model';
import { PersonalInfoService } from './personal-info.service';

@Component({
  selector: 'jhi-personal-info-delete-dialog',
  templateUrl: './personal-info-delete-dialog.component.html'
})
export class PersonalInfoDeleteDialogComponent {
  personalInfo: IPersonalInfo;

  constructor(
    protected personalInfoService: PersonalInfoService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.personalInfoService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'personalInfoListModification',
        content: 'Deleted an personalInfo'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-personal-info-delete-popup',
  template: ''
})
export class PersonalInfoDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ personalInfo }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(PersonalInfoDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.personalInfo = personalInfo;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/personal-info', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/personal-info', { outlets: { popup: null } }]);
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
