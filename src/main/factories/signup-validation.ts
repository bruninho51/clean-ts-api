import { Validation } from '../../presentations/helpers/validators'
import { CompareFieldValidation } from '../../presentations/helpers/validators/compare-field-validation'
import { RequiredFieldValidation } from '../../presentations/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentations/helpers/validators/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  return new ValidationComposite(validations)
}
