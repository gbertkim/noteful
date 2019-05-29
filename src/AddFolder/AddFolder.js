import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddFolder.css'
import ValidationError from '../ValidationError.js'
import PropTypes from 'prop-types';

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Folder',
      nameValid: true,
      formValid: true,
      validationMessages: {
        name: '',
      }
    }
  }
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  updateName(name) {
    this.setState({name}, () => {this.validateName(name)});
    console.log(this.state.props);
  }
  validateName(fieldValue) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;

    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0) {
      fieldErrors.name = 'Name is required';
      hasError = true;
    } else {
      if(/[^a-zA-Z]/.test(fieldValue)){
        fieldErrors.name = 'Folder name must be letters only. No Spaces.';
        hasError = true;
      } else {
        fieldErrors.name = '';
        hasError = false;
      }
    }

    this.setState({
      validationMessages: fieldErrors,
      nameValid: !hasError
    }, this.formValid );

  }

  handleSubmit = e => {
    e.preventDefault()
    console.log(this.state)
    const folder = {
      name: this.state.name
    }
    if (this.state.formValid === true){
      fetch(`${config.API_ENDPOINT}/folders`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(folder),
      })
        .then(res => {
          if (!res.ok)
            return res.json().then(e => Promise.reject(e))
          return res.json()
        })
        .then(folder => {
          this.context.addFolder(folder)
          this.props.history.push(`/folder/${folder.id}`)
        })
        .catch(error => {
          console.error({ error })
      })
    } else {
      return new Error(`Form is invalid`);
    }
  }

  formValid() {
    this.setState({
      formValid: this.state.nameValid
    });
  }

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={e => this.handleSubmit(e)}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input type='text' id='folder-name-input' name='folder-name' defaultValue='Folder' onChange={e => this.updateName(e.target.value)}/>
            <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name}/>  
          </div>
          <div className='buttons'>
            <button type="submit" className="addFolder__button">
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}

AddFolder.propTypes = {
  name: PropTypes.string.isRequired
};

AddFolder.defaultProps = {
  name: 'Folder'
};
