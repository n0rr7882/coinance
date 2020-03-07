import axios from 'axios';
import { BITRACE_API_ENTRY_POINT } from '../constants';
import { IRequestLogin, IResponseLogin, IRequestRefresh, IResponseRefresh } from '../models/auth';
import { User } from '../models/user';
import { getAccessToken } from '../utils/token-storage';

const AUTH_API_ENTRY_POINT = `${BITRACE_API_ENTRY_POINT}/auth`;

class AuthRepository {
  private api = axios.create({ baseURL: AUTH_API_ENTRY_POINT });

  async login(data: IRequestLogin) {
    const res = await this.api.post<IResponseLogin>('/token/', data)

    return res.data;
  }
  async refresh(data: IRequestRefresh) {
    const res = await this.api.post<IResponseRefresh>('/token/refresh/', data);

    return res.data;
  }
  async me() {
    const headers = { authorization: `Bearer ${getAccessToken()}` };
    const res = await this.api.get<User>('/me/', { headers });

    return res.data;
  }
}

export const authRepository = new AuthRepository();
