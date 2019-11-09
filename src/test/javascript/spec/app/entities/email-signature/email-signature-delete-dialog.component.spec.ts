import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { EmailSignatureGeneratorTestModule } from '../../../test.module';
import { EmailSignatureDeleteDialogComponent } from 'app/entities/email-signature/email-signature-delete-dialog.component';
import { EmailSignatureService } from 'app/entities/email-signature/email-signature.service';

describe('Component Tests', () => {
  describe('EmailSignature Management Delete Component', () => {
    let comp: EmailSignatureDeleteDialogComponent;
    let fixture: ComponentFixture<EmailSignatureDeleteDialogComponent>;
    let service: EmailSignatureService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EmailSignatureGeneratorTestModule],
        declarations: [EmailSignatureDeleteDialogComponent]
      })
        .overrideTemplate(EmailSignatureDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EmailSignatureDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EmailSignatureService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
