import { AddSurveyParams, AddSurveyRepository } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { LoadSurveyByIdRepository, SurveyModel } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { mockSurveyModel, mockSurveyModels } from '@/data/test'
import { LoadSurveysRepository } from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (survey: AddSurveyParams): Promise<void> {}
  }
  const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
  return addSurveyRepositoryStub
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }
  const loadSurveysRepositoryStub = new LoadSurveyByIdRepositoryStub()
  return loadSurveysRepositoryStub
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (accountId: string): Promise<SurveyModel[]> {
      return mockSurveyModels()
    }
  }
  const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
  return loadSurveysRepositoryStub
}
