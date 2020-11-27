import { makeSignUpValidation } from './signup-validation-factory'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { Validation } from '../../../../validation/validators'
import { CompareFieldValidation } from '../../../../validation/validators/compare-field-validation'
import { EmailValidator } from '../../../../validation/protocols/email-validator'
import { EmailValidation } from '../../../../validation/validators/email-validation'

jest.mock('../../../../validation/validators/validation-composite')

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
