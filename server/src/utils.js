const { APP_SECRET } = require('../config')
const jwt = require('jsonwebtoken')

function getUserId(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    // actual auth token is prepended with 'Bearer ', need to remove
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new Error('Not authenticated')
}

module.exports = {
  getUserId,
}
