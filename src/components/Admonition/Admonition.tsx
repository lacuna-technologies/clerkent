import React, { useCallback, useState } from 'react'
import Helpers from '../../utils/Helpers'
import './Admonition.scss'

const Admonition = ({
  className = ``,
  title = ``,
  children = null,
  onClick = null,
}) => {
  const [shouldHide, setShouldHide] = useState(false)
  const dismissAdmonition = useCallback((event) => {
    event.stopPropagation()
    setShouldHide(true)
  }, [])

  return shouldHide ? null : (
    <div
      className={Helpers.classnames(`admonition`, className, onClick ? `clickable` : ``)}
      onClick={onClick ? onClick : () => {}}
    >
      <div className="left">
        <div className="header">
          <strong>{title}</strong>
        </div>
        <div className="content">
          {children}
        </div>
      </div>
      <div className="right">
        <div className="dismiss-button" onClick={dismissAdmonition}>✕</div>
      </div>
    </div>
  )
}

export default Admonition