import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EmailSignatureGeneratorTestModule } from '../../../test.module';
import { EmailSignatureUpdateComponent } from 'app/entities/email-signature/email-signature-update.component';
import { EmailSignatureService } from 'app/entities/email-signature/email-signature.service';
import { EmailSignature } from 'app/shared/model/email-signature.model';

describe('Component Tests', () => {
  describe('EmailSignature Management Update Component', () => {
    let comp: EmailSignatureUpdateComponent;
    let fixture: ComponentFixture<EmailSignatureUpdateComponent>;
    let service: EmailSignatureService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EmailSignatureGeneratorTestModule],
        declarations: [EmailSignatureUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(EmailSignatureUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmailSignatureUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EmailSignatureService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new EmailSignature(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new EmailSignature();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
