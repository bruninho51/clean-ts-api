export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 5060,
  jwtSecret: process.env.JWT_SECRET || 'TjDJJn75%$d==dkR&$'
}
