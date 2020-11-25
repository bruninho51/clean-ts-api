import { Validation } from './validation'
import { MissingParamError } from '../../errors'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return new MissingParamError('field')
    }
  }

  const validationStub = new ValidationStub()
  return validationStub
}

const makeSut = (): ValidationComposite => {
  return new ValidationComposite([makeValidation()])
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
