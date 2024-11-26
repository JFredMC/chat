import { Injectable } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor() {}

  isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};
    //console.log( errors );
    for (const key of Object.keys( errors )) {
      switch ( key ) {
        case 'required':
          // return 'Campo requerido';
          return 'Campo requerido';
        case 'minlength':
          // return `Debe tener mínimo ${ errors['minlength'].requiredLength } caracteres`;
          const minlength = errors['minlength'].requiredLength;
          return `Debe tener mínimo ${minlength} caracteres`;
        case 'maxlength':
          // return `Debe tener maximo ${ errors['maxlength'].requiredLength } caracteres`;
          const maxlength = errors['maxlength'].requiredLength;
          return `Debe tener máximo ${maxlength} caracteres`;
        case 'min':
          // return `El valor debe ser mayor o igual a ${ errors['min'].min }`;
          const min = errors['min'].min;
          return `El valor debe ser mayor o igual a ${min}`;
        case 'max':
          // return `El valor debe ser menor o igual a ${ errors['max'].max }`;
          const max = errors['max'].max;
          return `El valor debe ser menor o igual ${max}`
        case 'onlyLetters':
          // return `Debe ingresar solo letras`
          return 'Debe ingresar solo letras';
        case 'onlyNumbers':
          // return `Debe ingresar solo numeros`
          return 'Debe ingresar solo numeros';
      }
    }

    return null;
  }

  public onlyLetters = (control: FormControl): ValidationErrors | null => {
    const value = control.value;
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/

    if (!regex.test(value)) {
      return {
        onlyLetters: true,
      }
    }

    return null;
  }

  public onlyNumbers = (control: FormControl): ValidationErrors | null => {
    const value = control.value;
    const regex = /^([0-9])*$/;

    if (!regex.test(value)) {
      return {
        onlyNumbers: true,
      }
    }

    return null;
  }

  public isfield1Equalfield2(field1: string, field2: string) {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;

      if (field1Value != field2Value) {
        formGroup.get(field2)?.setErrors({ notEqual: true });
        return {
          notEqual: true
        }
      }

      formGroup.get(field2)?.setErrors(null);
      return null;
    }
  }

  public isValidCustomDate = (control: FormControl): ValidationErrors | null => {
    if (control.value) {
      let { year, month, day } = control.value;
  
      month = month < 10? `0${month}` : month;
      day   = day < 10?   `0${day}`   : day;
  
      const value = `${year}-${month}-${day}`;
      const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
      const date  = new Date(value);

      if (isNaN(date.getFullYear())) {
        return {
          invalidDate: true,
        }
      }
  
      if (!regex.test(value)) {
        return {
          invalidDate: true,
        }
      }
    }

    return null;
  }

  public isFutureDate = (control: FormControl): ValidationErrors | null => {
    const value       = control.value + 'T00:00:00';
    const currentDate = new Date();
    const date        = new Date(value);

    if (date > currentDate) {
      return {
        futureDate: true
      }
    }

    return null;
  }

  public isFutureDateCustomDate = (control: FormControl): ValidationErrors | null => {
    if (control.value) {
      let { year, month, day } = control.value;

      month = month < 10? `0${month}` : month;
      day   = day < 10?   `0${day}`   : day;

      const value       = `${year}-${month}-${day}` + 'T00:00:00';
      const currentDate = new Date();
      const date        = new Date(value);

      if (date > currentDate) {
        return {
          futureDate: true
        }
      }
    }

    return null;
  }

  public isSecurePassword = (control: FormControl): ValidationErrors | null => {
    const value         = control.value;
    const regexCapital  = /^(?=.*[A-Z]).+$/;
    const regexNumber   = /^(?=.*\d).+$/;
    const regexSpecial  = /^(?=.*[.:,;\-/_@+*!"#$%&()=?¿¡]).+$/;
    let validations: any[] = [];
    
    if (value) {
      validations = [];
      if (!regexCapital.test(value)) {
        validations.push({ notSecurePassword: { error: 'capitalLetter' } });
      }

      if (!regexNumber.test(value)) {
        validations.push({ notSecurePassword: { error: 'number' } });
      }

      if (!regexSpecial.test(value)) {
        validations.push({ notSecurePassword: { error: 'specialCharacter' } });
      }
    }
    
    return validations.length > 0? validations[0]: null;
  }

  public validateMinimumValue(currency: string, value: string) {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const currencyValue = formGroup.get(currency)?.value;
      const valueRecharge = Number(formGroup.get(value)?.value);

      switch (currencyValue) {
        case 'COP':
          if (valueRecharge < 1500) {
            formGroup.get(value)?.setErrors({ invalidMinimumValue: { currency: 'COP', minimumValue: '1500' } });
            return {
              invalidMinimumValue: { currency: 'COP', minimunValue: '1500' }
            }
          }
          break;
        case 'USD':
          if (valueRecharge < 2) {
            formGroup.get(value)?.setErrors({ invalidMinimumValue: { currency: 'USD', minimumValue: '2' } });
            return {
              invalidMinimumValue: { currency: 'USD', minimunValue: '2' }
            }
          }
          break;
        case 'MXN':
          if (valueRecharge < 10) {
            formGroup.get(value)?.setErrors({ invalidMinimumValue: { currency: 'MXN', minimumValue: '10' } });
            return {
              invalidMinimumValue: { currency: 'MXN', minimunValue: '10' }
            }
          }
          break;
      
        default:
          break;
      }

      formGroup.get(value)?.setErrors(null);
      return null;
    }
  }
}
