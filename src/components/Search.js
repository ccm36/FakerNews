import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

class Search extends Component {
  state = {
    links: [],
    filter: '',
  }

  render() {
    return (
      <div>
        <div>
          Search
          <input
            type="text"
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <button
            onClick={() => this._executeSearch()}
          >
            Ok
          </button>
        </div>
        {this.state.links.map((link, index) => {
          <Link 
            key={link.id}
            link={link}
            index={index}
          />
        })}
      </div>
    )
  }

  _executeSearch = async () => {
    const { filter } = this.state
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    })
    const links = result.data.feed.links
    this.setState({ links })
  }
}

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
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
`

export default withApollo(Search)
// This is so we can load the data everytime the user hits 'search'
  // not upon initial load of the component
// withApollo injects the ApolloClient instance (from index.js)
// into the Search component as a new prop, called 'client'
  // client has a method called 'query'
    // allows you to manually send a query instead of
    // using the 'graphql' HOC
