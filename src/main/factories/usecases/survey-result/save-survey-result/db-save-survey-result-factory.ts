import { DbSaveSurveyResult } from '@/data/usecases/survey/save-survey-result/db-save-survey-result'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey/survey-result/db-survey-result-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyMongoRepository)
}
