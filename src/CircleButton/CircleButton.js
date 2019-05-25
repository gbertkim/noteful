import React from 'react'
import PropTypes from 'prop-types';
import './CircleButton.css'

export default function NavCircleButton(props) {
  const { tag, className, childrenm, ...otherProps } = props
  return React.createElement(
    props.tag,
    {
      className: ['NavCircleButton', props.className].join(' '),
      ...otherProps
    },
    props.children
  )
}

NavCircleButton.defaultProps ={
  tag: 'a',
}

NavCircleButton.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  to: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  role: PropTypes.string
}