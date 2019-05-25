import React from 'react';
import PropTypes from 'prop-types';

export default function ValidationError(props) {
  if(props.hasError) {
    return (
      <div className="error">{props.message}</div>
    );
  }

  return <></>
}

ValidationError.propTypes = {
  hasError: PropTypes.bool,
  message: PropTypes.string
}
