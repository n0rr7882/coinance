import { observable, action } from "mobx";
import { boundClass } from "autobind-decorator";

@boundClass
export default class LayoutStore {
  @observable public userSettingDialogOpen: boolean = false;

  @action
  public toggleUserSettingDialog() {
    this.userSettingDialogOpen = !this.userSettingDialogOpen;
  }
}
