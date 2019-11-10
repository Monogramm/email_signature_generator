import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EmailSignatureGeneratorTestModule } from '../../../test.module';
import { PersonalInfoComponent } from 'app/entities/personal-info/personal-info.component';
import { PersonalInfoService } from 'app/entities/personal-info/personal-info.service';
import { PersonalInfo } from 'app/shared/model/personal-info.model';

describe('Component Tests', () => {
  describe('PersonalInfo Management Component', () => {
    let comp: PersonalInfoComponent;
    let fixture: ComponentFixture<PersonalInfoComponent>;
    let service: PersonalInfoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EmailSignatureGeneratorTestModule],
        declarations: [PersonalInfoComponent],
        providers: []
      })
        .overrideTemplate(PersonalInfoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PersonalInfoComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PersonalInfoService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new PersonalInfo(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.personalInfos[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
