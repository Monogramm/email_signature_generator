import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { EmailSignatureGeneratorTestModule } from '../../../test.module';
import { PersonalInfoDeleteDialogComponent } from 'app/entities/personal-info/personal-info-delete-dialog.component';
import { PersonalInfoService } from 'app/entities/personal-info/personal-info.service';

describe('Component Tests', () => {
  describe('PersonalInfo Management Delete Component', () => {
    let comp: PersonalInfoDeleteDialogComponent;
    let fixture: ComponentFixture<PersonalInfoDeleteDialogComponent>;
    let service: PersonalInfoService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EmailSignatureGeneratorTestModule],
        declarations: [PersonalInfoDeleteDialogComponent]
      })
        .overrideTemplate(PersonalInfoDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PersonalInfoDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PersonalInfoService);
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
