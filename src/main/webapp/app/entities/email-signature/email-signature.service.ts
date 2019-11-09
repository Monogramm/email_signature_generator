import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IEmailSignature } from 'app/shared/model/email-signature.model';

type EntityResponseType = HttpResponse<IEmailSignature>;
type EntityArrayResponseType = HttpResponse<IEmailSignature[]>;

@Injectable({ providedIn: 'root' })
export class EmailSignatureService {
  public resourceUrl = SERVER_API_URL + 'api/email-signatures';

  constructor(protected http: HttpClient) {}

  create(emailSignature: IEmailSignature): Observable<EntityResponseType> {
    return this.http.post<IEmailSignature>(this.resourceUrl, emailSignature, { observe: 'response' });
  }

  update(emailSignature: IEmailSignature): Observable<EntityResponseType> {
    return this.http.put<IEmailSignature>(this.resourceUrl, emailSignature, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmailSignature>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmailSignature[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
