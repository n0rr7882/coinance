import axios from "axios";
import {
  COINANCE_API_ENTRY_POINT,
  GOOGLE_OAUTH2_REDIRECT_URI,
} from "../constants";
import { User } from "../models/user";
import { IGoogleOauth2Data, IToken, IGoogleOauth2Result } from "../models/auth";

const AUTH_API_ENTRY_POINT = `${COINANCE_API_ENTRY_POINT}/auth`;

class AuthRepository {
  private api = axios.create({ baseURL: AUTH_API_ENTRY_POINT });

  async googleOauth2Login(code: string): Promise<IToken> {
    const data: IGoogleOauth2Data = {
      provider: "google-oauth2",
      code,
      redirect_uri: GOOGLE_OAUTH2_REDIRECT_URI,
    };
    const res = await this.api.post<IGoogleOauth2Result>(
      `/login/social/jwt-pair/${data.provider}/`,
      data
    );

    return { access: res.data.token, refresh: res.data.refresh };
  }

  async refresh(token: IToken): Promise<IToken> {
    const data = { refresh: token.refresh };
    const res = await this.api.post<{ access: string }>(
      "/token/refresh/",
      data
    );

    return { access: res.data.access, refresh: data.refresh };
  }

  async me(token: IToken): Promise<User> {
    const headers = { authorization: `Bearer ${token.access}` };
    const res = await this.api.get<User>("/me/", { headers });

    return new User(res.data);
  }
}

export const authRepository = new AuthRepository();
