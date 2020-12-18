import { apiKeyAuthSchema } from '@/main/docs/schemas/api-key-auth-schema'
import {
  badRequest,
  unauthorized,
  serverError,
  notFound,
  forbidden
} from './components/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  unauthorized,
  serverError,
  notFound,
  forbidden
}
