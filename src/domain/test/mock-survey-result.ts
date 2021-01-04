import { SaveSurveyResultParams, SurveyResultModel } from '@/data/usecases/survey/save-survey-result/db-save-survey-result-protocols'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  question: 'any_question',
  surveyId: 'any_survey_id',
  answers: [{
    answer: 'any_answer',
    image: 'any_image',
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: true
  }, {
    answer: 'other_answer',
    image: 'other_image',
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
  }],
  date: new Date()
})

export const mockSurveyResultModelEmpty = (): SurveyResultModel => ({
  question: 'any_question',
  surveyId: 'any_survey_id',
  answers: [{
    answer: 'any_answer',
    image: 'any_image',
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
  }, {
    answer: 'other_answer',
    image: 'other_image',
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
  }],
  date: new Date()
})

export const mockSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})
