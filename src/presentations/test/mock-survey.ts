import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { mockSurveyModels } from '@/data/test'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return null
    }
  }

  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return mockSurveyModels()
    }
  }
  const loadSurveysStub = new LoadSurveysStub()
  return loadSurveysStub
}
