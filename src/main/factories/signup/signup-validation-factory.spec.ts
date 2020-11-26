import { makeSignUpValidation } from './signup-validation-factory'
import { ValidationComposite } from '../../../presentations/helpers/validators/validation-composite'
import { RequiredFieldValidation } from '../../../presentations/helpers/validators/required-field-validation'
import { Validation } from '../../../presentations/helpers/validators'
import { CompareFieldValidation } from '../../../presentations/helpers/validators/compare-field-validation'
import { EmailValidator } from '../../../presentations/protocols/email-validator'
import { EmailValidation } from '../../../presentations/helpers/validators/email-validation'

jest.mock('../../../presentations/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()

    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
