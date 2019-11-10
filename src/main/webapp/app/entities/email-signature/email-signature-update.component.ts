import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { EmailSignature, IEmailSignature } from 'app/shared/model/email-signature.model';
import { EmailSignatureService } from './email-signature.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-email-signature-update',
  templateUrl: './email-signature-update.component.html'
})
export class EmailSignatureUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];

  editForm = this.fb.group({
    id: [],
    template: [null, [Validators.required]],
    user: []
  });

  templateFile: File = null;
  fileReader: FileReader = new FileReader();

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected emailSignatureService: EmailSignatureService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ emailSignature }) => {
      this.updateForm(emailSignature);
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(emailSignature: IEmailSignature) {
    this.editForm.patchValue({
      id: emailSignature.id,
      template: this.fileReader.result,
      user: emailSignature.user
    });
  }

  previousState() {
    window.history.back();
  }

  handleFileInput(files: FileList) {
    this.templateFile = files.item(0);
    this.fileReader.onload = e => {
      this.editForm.patchValue({
        template: this.fileReader.result
      });
    };
    this.fileReader.readAsText(this.templateFile);
  }

  save() {
    if (!this.fileReader.result) {
      alert('Please wait, file is being loaded!');
      return;
    }
    this.isSaving = true;
    const emailSignature = this.createFromForm();
    if (emailSignature.id !== undefined) {
      this.subscribeToSaveResponse(this.emailSignatureService.update(emailSignature));
    } else {
      this.subscribeToSaveResponse(this.emailSignatureService.create(emailSignature));
    }
  }

  private createFromForm(): IEmailSignature {
    return {
      ...new EmailSignature(),
      id: this.editForm.get(['id']).value,
      template: this.editForm.get(['template']).value,
      user: this.editForm.get(['user']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmailSignature>>) {
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
