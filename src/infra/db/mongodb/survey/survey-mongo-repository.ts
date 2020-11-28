import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  private readonly mongo: MongoHelper = MongoHelper.instance
  async add (survey: AddSurveyModel): Promise<void> {
    const surveyCollection = await this.mongo.getCollection('surveys')
    await surveyCollection.insertOne(survey)
  }
}
