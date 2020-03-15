import axios from 'axios';
import { COINANCE_API_ENTRY_POINT } from '../constants';
import { UserSetting } from '../models/user';
import { IToken } from '../models/auth';

class UserSettingRepository {
  private api = axios.create({ baseURL: `${COINANCE_API_ENTRY_POINT}/user/settings` });

  public async create(token: IToken, userSetting: UserSetting) {
    const headers = { authorization: `Bearer ${token.access}` };
    const res = await this.api.post<UserSetting>('/', userSetting, { headers });

    return res.data;
  }

  public async delete(token: IToken, userSetting: UserSetting) {
    const headers = { authorization: `Bearer ${token.access}` };
    await this.api.delete(`/${userSetting.id}/`, { headers });
  }
}

export const userSettingRepository = new UserSettingRepository();
