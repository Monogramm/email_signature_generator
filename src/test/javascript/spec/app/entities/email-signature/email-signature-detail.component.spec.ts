import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmailSignatureGeneratorTestModule } from '../../../test.module';
import { EmailSignatureDetailComponent } from 'app/entities/email-signature/email-signature-detail.component';
import { EmailSignature } from 'app/shared/model/email-signature.model';

describe('Component Tests', () => {
  describe('EmailSignature Management Detail Component', () => {
    let comp: EmailSignatureDetailComponent;
    let fixture: ComponentFixture<EmailSignatureDetailComponent>;
    const route = ({ data: of({ emailSignature: new EmailSignature(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EmailSignatureGeneratorTestModule],
        declarations: [EmailSignatureDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(EmailSignatureDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EmailSignatureDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.emailSignature).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
