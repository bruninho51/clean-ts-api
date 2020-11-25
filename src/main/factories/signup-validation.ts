import { Validation } from '../../presentations/helpers/validators'
import { RequiredFieldValidation } from '../../presentations/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentations/helpers/validators/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
