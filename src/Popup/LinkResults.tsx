import React from 'react'
import type { ParseResult } from '../utils/Parser'
import { DATABASE_URLS } from '../utils/Constants'
import './LinkResults.scss'

interface Props {
  // eslint-disable-next-line quotes
  links: ParseResult['links']
}

const LinkResults: React.FC<Props> = ({ links = {} }) => (
  <section id="link-results">
    <h1>Links</h1>
    <div className="links">
      {
        Object.entries(links).filter(([_, value]) => value !== null).map(([key, value]) => (
          <a href={value}>
            {DATABASE_URLS[key].name}
          </a>
        ))
        }
    </div>
  </section>
)

export default LinkResults