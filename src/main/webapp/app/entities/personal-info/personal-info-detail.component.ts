import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPersonalInfo } from 'app/shared/model/personal-info.model';

@Component({
  selector: 'jhi-personal-info-detail',
  templateUrl: './personal-info-detail.component.html'
})
export class PersonalInfoDetailComponent implements OnInit {
  personalInfo: IPersonalInfo;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ personalInfo }) => {
      this.personalInfo = personalInfo;
    });
  }

  previousState() {
    window.history.back();
  }
}
