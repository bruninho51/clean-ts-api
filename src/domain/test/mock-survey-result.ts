import { SaveSurveyResultParams, SurveyResultModel } from '@/data/usecases/survey/save-survey-result/db-save-survey-result-protocols'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  question: 'any_question',
  surveyId: 'any_survey_id',
  answers: [{
    answer: 'any_answer',
    count: 1,
    percent: 50
  }, {
    answer: 'other_answer',
    count: 1,
    percent: 50
  }],
  date: new Date()
})

export const mockSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})
