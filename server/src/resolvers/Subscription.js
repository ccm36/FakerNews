const newLink = {
  subscribe: (parent, args, context, info) => {
    return context.db.subscription.link(
      { },
      info,
    )
  }
}

const newVote = {
  subscribe: (parent, args, context, info) => {
    return context.db.subscription.vote(
      { },
      info,
    )
  }
}

// Normally pass in filter (i.e. already created events)
  // to the resolver but there is a bug (just pass in empty object)
  // [https://github.com/graphcool/prisma/issues/1734]
  
  // { where: { mutation_in: ['CREATED'] } },

module.exports = {
  newLink,
  newVote,
}