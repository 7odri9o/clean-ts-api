import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export const getAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})
