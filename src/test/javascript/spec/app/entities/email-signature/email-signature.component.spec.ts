import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EmailSignatureGeneratorTestModule } from '../../../test.module';
import { EmailSignatureComponent } from 'app/entities/email-signature/email-signature.component';
import { EmailSignatureService } from 'app/entities/email-signature/email-signature.service';
import { EmailSignature } from 'app/shared/model/email-signature.model';

describe('Component Tests', () => {
  describe('EmailSignature Management Component', () => {
    let comp: EmailSignatureComponent;
    let fixture: ComponentFixture<EmailSignatureComponent>;
    let service: EmailSignatureService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EmailSignatureGeneratorTestModule],
        declarations: [EmailSignatureComponent],
        providers: []
      })
        .overrideTemplate(EmailSignatureComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmailSignatureComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EmailSignatureService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new EmailSignature(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.emailSignatures[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
