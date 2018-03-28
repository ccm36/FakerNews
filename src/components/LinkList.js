import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'
import { LINKS_PER_PAGE } from '../constants'

class LinkList extends Component {
  render() {
    if (this.props.feedQuery && this.props.feedQuery.loading) {
      return <div>Loading...</div>
    }

    if (this.props.feedQuery && this.props.feedQuery.error) {
      return <div>Error</div>
    }

    const isNewPage = this.props.location.pathname.includes('new')
    const linksToRender = this._getLinksToRender(isNewPage)
    const page = parseInt(this.props.match.params.page, 10)

    return (
      <div>
        <div>
          {linksToRender.map((link, index) => (
            <Link
              key={link.id}
              updateStoreAfterVote={this._updateCacheAfterVote}
              index={index}
              link={link}
            />
          ))}
        </div>
        {isNewPage && (
          <div className="flex ml4 mv3 yellow">
            <div className="pointer mr2" onClick={() => this._previousPage()}>Previous</div>
            <div className="pointer" onClick={() => this._nextPage()}>Next</div>
          </div>
        )}
      </div>
    )
  }

  _getLinksToRender = (isNewPage) => {
    if (isNewPage) {
      return this.props.feedQuery.feed.links
    }
    const rankedLinks = this.props.feedQuery.feed.links.slice()
    rankedLinks.sort((link1, link2) => link2.votes.length - link1.votes.length)
    return rankedLinks
  }

  _nextPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page <= this.props.feedQuery.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const page = parseInt(this.props.match.params.page, 10)
    const isNewPage = this.props.location.pathname.includes('new')
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy }
    })

    // retrieve link just voted on by user from cache
    // assign votes just returned from server as the link's new votes
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes

    // write the newly added votes back to the store
    store.writeQuery({ query: FEED_QUERY, data })
  }

  // can access 'feedQuery' on props because its wrapped in graphql container below
  // which calls 'subscribeToMore' opening a websocket connection to the subscription server
    // document: represents the subscription we want (i.e. fires when newLink is created)
    // updateQuery: determines how store should be updated with new server data
      // similar to a Redux Reducer
        // takes prev state and new data, merges, and returns new state
  _subscribeToNewLinks = () => {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newLink {
            node {
              id
              url
              description
              createdAt
              postedBy {
                id
                name
              }
              votes {
                id
                user {
                  id
                }
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const newAllLinks = [
          subscriptionData.data.newLink.node,
          ...previous.feed.links
        ]
        const result = {
          ...previous,
          feed: {
            links: newAllLinks,
          },
        }
        return result
      },
    })
  }

  _subscribeToNewVotes = () => {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newVote {
            node {
              id
              link {
                id
                url
                description
                createdAt
                postedBy {
                  id
                  name
                }
                votes {
                  id
                  user {
                    id
                  }
                }
              }
              user {
                id
              }
            }
          }
        }
      `,
    })
  }

  componentDidMount() {
    this._subscribeToNewLinks()
    this._subscribeToNewVotes()
  }
}

// Query sent to the server, returns data as a prop for the LinkList Component
  // because of the optionally passed second argument in graphql (i.e. name)
  // you will reference 'feedQuery' as the prop name (otherwise defaults to 'data')
export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      count
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`
export default graphql(FEED_QUERY, { 
  name: 'feedQuery',
  options: ownProps => {
    const page = parseInt(ownProps.match.params.page, 10)
    const isNewPage = ownProps.location.pathname.includes('new')
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    return {
      variables: { first, skip, orderBy },
    }
  },
})(LinkList)
