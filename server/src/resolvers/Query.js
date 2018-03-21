function feed(parent, args, context, info) {
  const { filter, first, skip } = args // destructure input args
  const where = filter
    ? { OR: [{ url_contains: filter }, { description_contains: filter }] }
    : {}

  return context.db.query.links({ first, skip, where }, info)
}

module.exports = {
  feed,
}

// resolver function must have same name as field on Root Type (i.e. Query)
  // parent = initial value for resolver chain
  // args = args passed into Root Type (i.e. Query)
  // context = object holding custom data passed through resolver chain
    // NOTE: every resolver can read from/write to
  // info = abstract syntax tree (AST) of query
    // NOTE: describes where currently execution is in the resolver chain

// filter arg builds a filter obj (called where)
  // retrieves link elements where url||description contain the filter string

// the resolver delegates the execution of the incoming query to the
// links resolver from the Prisma API, returns the result of that execution
