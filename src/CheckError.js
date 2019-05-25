import React, { Component } from 'react';

class CheckError extends Component {
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
          <h2>Section has an error.</h2>
        );
      }
    return this.props.children;
  }
}

export default CheckError;