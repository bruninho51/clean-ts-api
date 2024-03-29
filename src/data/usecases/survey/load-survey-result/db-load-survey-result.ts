import { LoadSurveyByIdRepository } from '../load-survey-by-id/db-load-survey-by-id-protocols'
import { SurveyResultModel, LoadSurveyResult, LoadSurveyResultRepository } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId)
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        date: survey.date,
        answers: survey.answers.map(answer => Object.assign({
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }, answer))
      }
    }
    return surveyResult
  }
}
