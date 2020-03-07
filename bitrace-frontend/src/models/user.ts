import { observable } from "mobx";

export class User {
  public readonly id?: number;
  @observable public username: string;
  @observable public password?: string;
  @observable public first_name: string;
  @observable public last_name: string;
  @observable public email: string;
  public readonly is_staff?: boolean;
  public readonly is_active?: boolean;
  public readonly is_superuser?: boolean;
  public readonly created?: Date;
  public readonly modified?: Date;

  constructor(data: User) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.email = data.email;
  }
}