import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'

jest.mock('@/validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    const fields = ['question', 'answers']
    for (const field of fields) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
