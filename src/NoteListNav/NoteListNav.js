import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircleButton from '../CircleButton/CircleButton'
import ApiContext from '../ApiContext'
import { countNotesForFolder } from '../notes-helpers'
import PropTypes from 'prop-types';
import CheckError from '../CheckError.js'

import './NoteListNav.css'


export default class NoteListNav extends React.Component {
  static contextType = ApiContext;
  
  // Error Check
  forcedMistake(){
    throw new Error ('this is forced')
  }
  render() {
    // Error Check
    // this.forcedMistake();
    const { folders=[], notes=[] } = this.context
    return (
      <div className='NoteListNav'>
      {this.value}
        <ul className='NoteListNav__list'>
          {folders.map(folder =>
            <li key={folder.id}>
              <NavLink
                className='NoteListNav__folder-link'
                to={`/folder/${folder.id}`}
              >
                <span className='NoteListNav__num-notes'>
                  {countNotesForFolder(notes, folder.id)}
                </span>
                {folder.name}
              </NavLink>
            </li>
          )}
        </ul>
        <div className='NoteListNav__button-wrapper'>
          <CheckError>
            <CircleButton
              tag={Link}
              to='/add-folder'
              type='button'
              className='NoteListNav__add-folder-button'
            >
              <FontAwesomeIcon icon='plus' />
              <br />
              Folder
            </CircleButton>
          </CheckError>
        </div>
      </div>
    )
  }
}

NoteListNav.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  notes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
}
NoteListNav.defaultProps = {
  notes: [],
  folders: []
};