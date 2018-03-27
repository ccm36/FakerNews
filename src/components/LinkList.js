import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

class LinkList extends Component {
  render() {
    if (this.props.feedQuery && this.props.feedQuery.loading) {
      return <div>Loading...</div>
    }

    if (this.props.feedQuery && this.props.feedQuery.error) {
      return <div>Error</div>
    }

    const linksToRender = this.props.feedQuery.feed.links

    return (
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
    )
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    // current state of the cached data
    const data = store.readQuery({ query: FEED_QUERY })

    // retrieve link just voted on by user from cache
    // assign votes just returned from server as the link's new votes
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes

    // write the newly added votes back to the store
    store.writeQuery({ query: FEED_QUERY, data })
  }

}

// Query sent to the server, returns data as a prop for the LinkList Component
  // because of the optionally passed second argument in graphql (i.e. name)
  // you will reference 'feedQuery' as the prop name (otherwise defaults to 'data')th
export const FEED_QUERY = gql`
  query FeedQuery {
    feed {
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
    }
  }
`
export default graphql(FEED_QUERY, { name: 'feedQuery' }) (LinkList)
