import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../../domain/models/survey'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  private readonly mongo: MongoHelper = MongoHelper.instance
  async add (survey: AddSurveyModel): Promise<void> {
    const surveyCollection = await this.mongo.getCollection('surveys')
    await surveyCollection.insertOne(survey)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await this.mongo.getCollection('surveys')
    const surveys: SurveyModel[] = await surveyCollection.find().toArray()
    return surveys
  }
}
