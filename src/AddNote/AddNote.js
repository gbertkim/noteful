import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddNote.css'
import ValidationError from '../ValidationError.js'
import PropTypes from 'prop-types';


export default class AddNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Name',
      content: 'Content',
      folderId: '',
      nameValid: true,
      contentValid: true,
      folderIdValid: true,
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
  

  handleSubmit = e => {
    e.preventDefault()
    console.log(this.state)
    const newNote = {
      name: this.state.name,
      content: this.state.content,
      folderId: this.state.folderId,
      modified: new Date(),
    }
    if (this.state.formValid === true){
      fetch(`${config.API_ENDPOINT}/notes`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(newNote),
      })
        .then(res => {
          if (!res.ok)
            return res.json().then(e => Promise.reject(e))
          return res.json()
        })
        .then(note => {
          this.context.addNote(note)
          this.props.history.push(`/folder/${note.folderId}`)
        })
        .catch(error => {
          console.error({ error })
        })
    } else {
      console.log(this.state);
      return new Error(`Form is invalid`);
    }
  }

  updateName(name) {
    this.setState({name}, () => {this.validateName(name)});
  }
  updateContent(content) {
    this.setState({content}, () => {this.validateContent(content)});
  }
  updateFolderId(folderId) {
    this.setState({folderId}, () => {this.validateFolderId(folderId)});
  }

  validateName(fieldValue) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;

    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0) {
      fieldErrors.name = 'Note name is required';
      hasError = true;
    } else {
      if(fieldValue.length < 3){
        fieldErrors.name = 'Note name must be greater than 3 characters long';
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


  validateContent(fieldValue) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;

    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0) {
      fieldErrors.content = 'Content is required';
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        fieldErrors.content = 'Note content must be at least 3 characters long';
        hasError = true;
      } else {
        fieldErrors.content = '';
        hasError = false;
      }
    }

    this.setState({
      validationMessages: fieldErrors,
      contentValid: !hasError
    }, this.formValid );

  }

  validateFolderId(fieldValue) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;
    console.log(fieldValue);
    fieldValue = fieldValue.trim();
    if(fieldValue.detail === null) {
      fieldErrors.folderId = 'Please select a folder';
      hasError = true;
    } else {
        fieldErrors.folderId = '';
        hasError = false;
    }


    this.setState({
      validationMessages: fieldErrors,
      folderIdValid: !hasError
    }, this.formValid );

  }

  formValid() {
    this.setState({
      formValid: this.state.nameValid && this.state.contentValid && this.state.folderIdValid
    });
  }

  render() {
    const { folders=[] } = this.context
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={e => this.handleSubmit(e)}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input 
              type='text'
              id='note-name-input' 
              name='note-name' 
              defaultValue='name' 
              onChange={e => this.updateName(e.target.value)} 
              aria-label='Note Name Input'
              aria-required='true'
            />
            <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name}/>  
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea 
              id='note-content-input' 
              name='note-content' 
              defaultValue='Note Content' 
              onChange={e => this.updateContent(e.target.value)} 
              aria-label='Note Content Input'
              aria-required='true'
            />
            <ValidationError hasError={!this.state.contentValid} message={this.state.validationMessages.content}/>  
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='note-folder-id' onChange={e => this.updateFolderId(e.target.value)}>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
            <ValidationError hasError={!this.state.folderIdValid} message={this.state.validationMessages.folderId}/>  
          </div>
          <div className='buttons'>
            <button type="submit" className="addNote__button" disabled={!this.state.formValid}>
                Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}

AddNote.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })),
}
AddNote.defaultProps = {
  folders: []
};