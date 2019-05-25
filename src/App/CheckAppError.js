import React, { Component } from 'react';

class CheckAppError extends Component {
    constructor(props) {
        super(props);
        this.state = {
          hasError: false
        };
    }  
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

  render() {
    if (this.state.hasError) {      
        return (
          <h2>App has an error.</h2>
        );
      }
    return this.props.children;
  }
}

export default CheckAppError;