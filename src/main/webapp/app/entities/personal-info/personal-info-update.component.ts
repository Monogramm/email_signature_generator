import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPersonalInfo, PersonalInfo } from 'app/shared/model/personal-info.model';
import { PersonalInfoService } from './personal-info.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-personal-info-update',
  templateUrl: './personal-info-update.component.html'
})
export class PersonalInfoUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];

  editForm = this.fb.group({
    id: [],
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    jobTitle: [],
    service: [],
    companyName: [],
    phoneNumber: [],
    mobileNumber: [],
    website: [],
    emailAddress: [null, [Validators.required]],
    address: [],
    user: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected personalInfoService: PersonalInfoService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ personalInfo }) => {
      this.updateForm(personalInfo);
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(personalInfo: IPersonalInfo) {
    this.editForm.patchValue({
      id: personalInfo.id,
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      jobTitle: personalInfo.jobTitle,
      service: personalInfo.service,
      companyName: personalInfo.companyName,
      phoneNumber: personalInfo.phoneNumber,
      mobileNumber: personalInfo.mobileNumber,
      website: personalInfo.website,
      emailAddress: personalInfo.emailAddress,
      address: personalInfo.address,
      user: personalInfo.user
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const personalInfo = this.createFromForm();
    if (personalInfo.id !== undefined) {
      this.subscribeToSaveResponse(this.personalInfoService.update(personalInfo));
    } else {
      this.subscribeToSaveResponse(this.personalInfoService.create(personalInfo));
    }
  }

  private createFromForm(): IPersonalInfo {
    return {
      ...new PersonalInfo(),
      id: this.editForm.get(['id']).value,
      firstName: this.editForm.get(['firstName']).value,
      lastName: this.editForm.get(['lastName']).value,
      jobTitle: this.editForm.get(['jobTitle']).value,
      service: this.editForm.get(['service']).value,
      companyName: this.editForm.get(['companyName']).value,
      phoneNumber: this.editForm.get(['phoneNumber']).value,
      mobileNumber: this.editForm.get(['mobileNumber']).value,
      website: this.editForm.get(['website']).value,
      emailAddress: this.editForm.get(['emailAddress']).value,
      address: this.editForm.get(['address']).value,
      user: this.editForm.get(['user']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPersonalInfo>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }
}
