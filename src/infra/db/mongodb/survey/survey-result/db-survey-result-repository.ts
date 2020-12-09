import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'
import { MongoHelper } from '../../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  private readonly mongo: MongoHelper = MongoHelper.instance
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyCollection = await this.mongo.getCollection('surveyResults')
    const res = await surveyCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId
    }, {
      $set: {
        answer: data.answer,
        date: new Date()
      }
    }, {
      upsert: true,
      returnOriginal: false
    })
    return res.value && this.mongo.map(res.value)
  }
}
