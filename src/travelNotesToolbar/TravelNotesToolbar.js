/*
Copyright - 2017 2022 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

/*
Changes:
	- v4.0.0:
		- created
Doc reviewed ...
Tests ...
*/

import BaseToolbar from '../baseToolbar/BaseToolbar.js';
import ToolbarItem from '../baseToolbar/ToolbarItem.js';
import theAPIKeysManager from '../core/APIKeysManager.js';
import theGeoLocator from '../core/GeoLocator.js';
import theConfig from '../data/Config.js';
import theTranslator from '../UILib/Translator.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theUtilities from '../UILib/Utilities.js';
import FileLoader from '../core/FileLoader.js';
import theErrorsUI from '../errorsUI/ErrorsUI.js';
import theTravelEditor from '../core/TravelEditor.js';
import theDockableDialogsManager from '../core/DockableDialogsManager.js';
import { INVALID_OBJ_ID, ZERO, TOOLBAR_POSITION } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the input associated to the open button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OpenInputChangeEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		const fileExtension = changeEvent.target.files [ ZERO ].name.split ( '.' ).pop ( )
			.toLowerCase ( );
		const fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			try {
				switch ( fileExtension ) {
				case 'trv' :
					new FileLoader ( ).openLocalTrvFile ( fileReader.result );
					break;
				case 'gpx' :
					new FileLoader ( ).openLocalGpxFile ( fileReader.result );
					break;
				default :
					break;
				}
			}
			catch ( err ) {
				if ( err instanceof Error ) {
					console.error ( err );
					theErrorsUI.showError ( 'An error occurs when reading the file : ' + err.message );
				}
			}
		};
		fileReader.readAsText ( changeEvent.target.files [ ZERO ] );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the input associated to the import button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ImportInputChangeEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		const fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			try {
				const fileExtension = changeEvent.target.files [ ZERO ].name.split ( '.' ).pop ( )
					.toLowerCase ( );
				switch ( fileExtension ) {
				case 'trv' :
					new FileLoader ( ).mergeLocalTrvFile ( fileReader.result );
					break;
				case 'gpx' :
					new FileLoader ( ).mergeLocalGpxFile ( fileReader.result );
					break;
				default :
					break;
				}
			}
			catch ( err ) {
				if ( err instanceof Error ) {
					console.error ( err );
					theErrorsUI.showError ( 'An error occurs when reading the file : ' + err.message );
				}
			}
		};

		fileReader.readAsText ( changeEvent.target.files [ ZERO ] );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the TravelNotes toolbar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelNotesToolbar extends BaseToolbar {

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
	}

	/**
	Create the UI, adding buttons
	*/

	createUI ( ) {
		super.createUI ( 'Travel & Notes', TOOLBAR_POSITION.topRight );
	}

	/**
	Add the ToolbarItems to the toolbar. Called by the #show ( ) method of the vase class
	*/

	addToolbarItems ( ) {
		this.addToolbarItem (
			new ToolbarItem (
				'🏠',
				'Home',
				window.location.origin
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'?',
				'Help',
				'https://wwwouaiebe.github.io/TravelNotes/userGuides/README.html\u0023'
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'@',
				'Contact',
				( theConfig.travelNotesToolbarUI.contactMail.url || window.location.origin )
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'🔑',
				theTranslator.getText ( 'TravelNotesToolbarUI - API keys' ),
				( ) => { theAPIKeysManager.setKeysFromDialog ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'🌐',
				theTranslator.getText ( 'TravelNotesToolbarUI - Geo location' ),
				( ) => { theGeoLocator.switch ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'☢️',
				theTranslator.getText ( 'TravelNotesToolbarUI - Save as travel' ),
				( ) => { theTravelEditor.saveAsTravel ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'❌',
				theTranslator.getText ( 'TravelNotesToolbarUI - Cancel travel' ),
				( ) => {
					theTravelEditor.newTravel ( );
					document.title =
						'Travel & Notes' +
						( '' === theTravelNotesData.travel.name ? '' : ' - ' + theTravelNotesData.travel.name );
				}
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'💾',
				theTranslator.getText ( 'TravelNotesToolbarUI - Save travel' ),
				( ) => { theTravelEditor.saveTravel ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'📂',
				theTranslator.getText ( 'TravelNotesToolbarUI - Open travel' ),
				( ) => {
					if (
						theConfig.travelNotes.haveBeforeUnloadWarning
						&&
						(
							! window.confirm ( theTranslator.getText (
								'TravelNotesToolbarUI - This page ask to close; data are perhaps not saved.' )
							)
						)
					) {
						return;
					}
					theUtilities.openFile ( new OpenInputChangeEL ( ), '.trv,.gpx' );
				}
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'🌏',
				theTranslator.getText ( 'TravelNotesToolbarUI - Import travel' ),
				( ) => {
					if ( INVALID_OBJ_ID === theTravelNotesData.editedRouteObjId ) {
						theUtilities.openFile ( new ImportInputChangeEL ( ), '.trv,.gpx' );
					}
					else {
						theErrorsUI.showError (
							theTranslator.getText (
								'TravelNotesToolbarUI - Not possible to merge a travel when a route is edited'
							)
						);
					}
				}
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'📙',
				theTranslator.getText ( 'TravelNotesToolbarUI - Open travel roadbook' ),
				'TravelNotesRoadbook.html?lng=' +
						theConfig.travelNotes.language + '&page=' +
						theTravelNotesData.UUID
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'🛄',
				theTranslator.getText ( 'TravelNotesToolbarUI - Travel properties' ),
				( ) => { theDockableDialogsManager.travelPropertiesDialog.show ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'🗨️',
				theTranslator.getText ( 'TravelNotesToolbarUI - Travel notes' ),
				( ) => { theDockableDialogsManager.travelNotesDialog.show ( ); }
			)
		);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of TravelNotesToolbarUI class
@type {TravelNotesToolbar}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theTravelNotesToolbar = new TravelNotesToolbar ( );

export default theTravelNotesToolbar;

/* --- End of file --------------------------------------------------------------------------------------------------------- */