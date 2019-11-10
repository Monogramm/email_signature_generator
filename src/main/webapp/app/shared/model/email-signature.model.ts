import { IUser } from 'app/core/user/user.model';

export interface IEmailSignature {
  id?: number;
  template?: string;
  user?: IUser;
}

export class EmailSignature implements IEmailSignature {
  constructor(public id?: number, public template?: string, public user?: IUser) {}
}
