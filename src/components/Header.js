import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN } from '../constants'

class Header extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <div className="flex pa1 justify-between nowrap green">
        <div className="flex flex-fixed yellow">
          <Link to="/" className="fw7 mr1 no-underline yellow">
            Faker News
          </Link>
          <Link to="/" className="ml1 no-underline yellow">
            new
          </Link>
          <div className="ml1">|</div>
          <Link to="/top" className="ml1 no-underline yellow">
            top
          </Link>
          <div className="ml1">|</div>
          <Link to="/search" className="ml1 no-underline yellow">
            search
          </Link>
          {authToken && (
            <div className="flex">
              <div className="ml1">|</div>
              <Link to="/create" className="ml1 no-underline yellow">
                submit
              </Link>
            </div>
          )}
        </div>
        <div className="flex flex-fixed">
          {authToken
            ? (
                <div
                  className="ml1 pointer yellow"
                  onClick={() => {
                    localStorage.removeItem(AUTH_TOKEN)
                    this.props.history.push('/')
                  }}
                >
                  logout
                </div>
              )
            : (
                <Link to="/login" className="ml1 no-underline yellow">
                  login
                </Link>
              )
          }
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
