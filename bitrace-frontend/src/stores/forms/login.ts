import { observable } from 'mobx';
import GenericFormStore from '../../utils/store/generic-form-store';

export default class LoginFormStore extends GenericFormStore {
  @observable form = {
    fields: {
      username: {
        value: '', // binds to input value
        errors: [], // shows beneif the input
        rule: 'required',
      },
      password: {
        value: '',
        errors: [],
        rule: 'required',
      }
    },
    meta: {
      isValid: true,
      error: undefined, // some generic error
    }
  }
}