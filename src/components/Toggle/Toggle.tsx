import React, { useCallback } from 'react'
import Helpers from '../../utils/Helpers'
import './Toggle.scss'

const { classnames } = Helpers

const Toggle = ({
  leftText,
  rightText,
  value = false,
  onChange = (_: boolean): void => {},
}) => {
  const onChangeFalse = useCallback(() => value ? onChange(false) : null, [value, onChange])
  const onChangeTrue = useCallback(() => value ? null : onChange(true), [value, onChange])

  return (
    <div className="toggle-input">
      <div className={classnames(`left`, value ?  `` : `active`)} onClick={onChangeFalse}>
        {leftText}
      </div>
      <div className={classnames(`right`, value ? `active` : ``)} onClick={onChangeTrue}>
        {rightText}
      </div>
    </div>
  )
}

export default Toggle