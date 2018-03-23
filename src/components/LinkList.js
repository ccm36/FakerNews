import React, { Component } from 'react'
import Link from './Link'

class LinkList extends Component {
  render() {
    const linksToRender = [
      {
        id: '1',
        description: 'My Portfolio Site',
        url: 'http://cammalloy.com',
      },
      {
        id: '2',
        description: 'Oh wow, cool site!',
        url: 'https://www.reddit.com',
      },
    ]

    return (
      <div>
        {linksToRender.map(link => <Link key={link.id} link={link} />)}
      </div>
    )
  }
}

export default LinkList
