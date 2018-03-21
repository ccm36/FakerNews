function post(parent, args, context, info) {
  const { url, description } = args
  return context.db.mutation.createLink({ data: { url, description } }, info)
}

function signup(parent, args, context, info) {
  const { name, email, password } = args
  return context.db.mutation.createUser({ data: { name, email, password } }, info)
}

function login(parent, args, context, info) {
  const { email, password } = args
  // compare hashed password to login password
    // if correct,
      // generate and return JWT and user info 
}

module.exports = {
  post,
  signup,
  login,
}
