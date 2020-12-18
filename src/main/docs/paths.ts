import {
  loginPath,
  signUpPath,
  surveyResultPath,
  surveysPath
} from './paths/'

export default {
  '/login': loginPath,
  '/surveys': surveysPath,
  '/signup': signUpPath,
  '/surveys/surveyId/results': surveyResultPath
}
