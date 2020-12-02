import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  private readonly mongo: MongoHelper = MongoHelper.instance
  async add (survey: AddSurveyModel): Promise<void> {
    const surveyCollection = await this.mongo.getCollection('surveys')
    await surveyCollection.insertOne(survey)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await this.mongo.getCollection('surveys')
    const surveys: SurveyModel[] = await surveyCollection.find().toArray()
    return surveys && this.mongo.mapCollection(surveys)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await this.mongo.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: id })
    return survey && this.mongo.map(survey)
  }
}
