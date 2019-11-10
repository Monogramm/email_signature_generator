import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmailSignatureGeneratorTestModule } from '../../../test.module';
import { PersonalInfoDetailComponent } from 'app/entities/personal-info/personal-info-detail.component';
import { PersonalInfo } from 'app/shared/model/personal-info.model';

describe('Component Tests', () => {
  describe('PersonalInfo Management Detail Component', () => {
    let comp: PersonalInfoDetailComponent;
    let fixture: ComponentFixture<PersonalInfoDetailComponent>;
    const route = ({ data: of({ personalInfo: new PersonalInfo(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EmailSignatureGeneratorTestModule],
        declarations: [PersonalInfoDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(PersonalInfoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PersonalInfoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.personalInfo).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
