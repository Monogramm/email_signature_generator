import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EmailSignatureGeneratorTestModule } from '../../../test.module';
import { PersonalInfoUpdateComponent } from 'app/entities/personal-info/personal-info-update.component';
import { PersonalInfoService } from 'app/entities/personal-info/personal-info.service';
import { PersonalInfo } from 'app/shared/model/personal-info.model';

describe('Component Tests', () => {
  describe('PersonalInfo Management Update Component', () => {
    let comp: PersonalInfoUpdateComponent;
    let fixture: ComponentFixture<PersonalInfoUpdateComponent>;
    let service: PersonalInfoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EmailSignatureGeneratorTestModule],
        declarations: [PersonalInfoUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(PersonalInfoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PersonalInfoUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PersonalInfoService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new PersonalInfo(123);
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
        const entity = new PersonalInfo();
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
