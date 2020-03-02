import { observable, action } from 'mobx';
import Validator from 'validatorjs';

export interface FormStoreField {
  value: string;
  errors: string[];
  rule: string;
}

export interface FormStoreFields {
  [key: string]: FormStoreField;
}

export interface FormStoreMeta {
  isValid: boolean;
  error?: string;
}

export interface FormStoreForm {
  fields: FormStoreFields;
  meta: FormStoreMeta;
}

export interface FormStore {
  form: FormStoreForm;
  onFieldChange: (field: string, value: string) => void;
  setError: (error: string) => void;
}

export default abstract class GenericFormStore implements FormStore {
  @observable abstract form: FormStoreForm;

  @action
  onFieldChange(field: string, value: string) {
    this.form.fields[field].value = value;

    const allFields = Object.keys(this.form.fields)
    const validatorValues: { [key: string]: string } = {};
    const validatorRules: { [key: string]: string } = {};

    for (const f of allFields) {
      validatorValues[f] = this.form.fields[f].value;
      validatorRules[f] = this.form.fields[f].rule;
    }

    const validation = new Validator(validatorValues, validatorRules);

    this.form.meta.isValid = validation.passes() || false;
    this.form.fields[field].errors = validation.errors.get(field);
  }

  @action
  setError(error: string) {
    this.form.meta.error = error;
  }
}