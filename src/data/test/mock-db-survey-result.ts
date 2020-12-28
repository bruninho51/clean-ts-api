import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usecases/survey/save-survey-result/db-save-survey-result-protocols'
import { LoadSurveyResultRepository } from '@/data/usecases/survey/load-survey-result/db-load-survey-result-protocols'
import { mockSurveyResultModel } from '@/domain/test'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<void> {}
  }
  const addSurveyRepositoryStub = new SaveSurveyResultRepositoryStub()
  return addSurveyRepositoryStub
}

export const makeLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub()
  return loadSurveyResultRepositoryStub
}
