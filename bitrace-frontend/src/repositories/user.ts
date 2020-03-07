import axios from 'axios';
import { BITRACE_API_ENTRY_POINT } from '../constants';
import { User } from '../models/user';
import { getAccessToken } from '../utils/token-storage';

const USER_API_ENTRY_POINT = `${BITRACE_API_ENTRY_POINT}/users`;

class UserRepository {
  private api = axios.create({ baseURL: USER_API_ENTRY_POINT });

  async create(user: User) {
    const res = await this.api.post<User>(`/`, user);

    return res.data;
  }

  async retrieve(id: number) {
    const headers = { authorization: `Bearer ${getAccessToken()}` };
    const res = await this.api.get<User>(`/${id}/`, { headers });

    return res.data;
  }

  async update(user: User) {
    const headers = { authorization: `Bearer ${getAccessToken()}` };
    const res = await this.api.put<User>(`/${user.id}/`, user, { headers });

    return res.data;
  }

  async delete(user: User) {
    const headers = { authorization: `Bearer ${getAccessToken()}` };
    await this.api.delete(`/${user.id}/`, { headers });
  }

}

export const userRepository = new UserRepository();
