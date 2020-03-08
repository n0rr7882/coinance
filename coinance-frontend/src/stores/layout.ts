import { observable, action } from "mobx";
import { boundClass } from "autobind-decorator";

@boundClass
export default class LayoutStore {
  @observable public loginDialogOpen: boolean = false;
  @observable public registerDialogOpen: boolean = false;

  @action
  public toggleLoginDialog() {
    this.loginDialogOpen = !this.loginDialogOpen;
  }

  @action
  public toggleRegisterDialog() {
    this.registerDialogOpen = !this.registerDialogOpen;
  }
}