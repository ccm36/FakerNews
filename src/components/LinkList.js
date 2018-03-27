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
export default graphql(FEED_QUERY, { name: 'feedQuery' })(LinkList)
