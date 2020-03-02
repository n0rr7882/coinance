import axios from 'axios';
import { BITRACE_API_ENTRY_POINT } from '../constants';
import { IRequestLogin, IResponseLogin, IRequestRefresh, IResponseRefresh } from '../interfaces/auth';
import { IUser } from '../interfaces/user';
import { getAccessToken } from '../utils/token-storage';

const AUTH_API_ENTRY_POINT = `${BITRACE_API_ENTRY_POINT}/auth`;

class AuthRepository {
  private api = axios.create({ baseURL: AUTH_API_ENTRY_POINT });

  login(data: IRequestLogin) {
    return this.api.post<IResponseLogin>('/token/', data);
  }
  refresh(data: IRequestRefresh) {
    return this.api.post<IResponseRefresh>('/token/refresh/', data);
  }
  me() {
    const headers = { authorization: `Bearer ${getAccessToken()}` };
    return this.api.get<IUser>('/me/', { headers });
  }

}

export default new AuthRepository();
