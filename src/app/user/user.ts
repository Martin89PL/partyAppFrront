import { UserAttrs } from './user-attrs';
import { environment } from '../../environments/environment';

export class User implements UserAttrs {
  
    _id: string;
    email: string;
    username: string;
    avatar: string;
    active: boolean;

    constructor(attrs: Partial<UserAttrs>) {
        this._id = attrs._id;
        this.email = attrs.email;
        this.username = attrs.username;
        this.avatar = `${environment.upload}${attrs.avatar}`;
        this.active = attrs.active;
    }
}
