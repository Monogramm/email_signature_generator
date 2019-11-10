import { IUser } from 'app/core/user/user.model';

export interface IPersonalInfo {
  id?: number;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  service?: string;
  companyName?: string;
  phoneNumber?: string;
  mobileNumber?: string;
  website?: string;
  emailAddress?: string;
  address?: string;
  user?: IUser;
}

export class PersonalInfo implements IPersonalInfo {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public jobTitle?: string,
    public service?: string,
    public companyName?: string,
    public phoneNumber?: string,
    public mobileNumber?: string,
    public website?: string,
    public emailAddress?: string,
    public address?: string,
    public user?: IUser
  ) {}
}
