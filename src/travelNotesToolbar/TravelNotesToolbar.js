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
Doc reviewed 20220821
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
import theFullScreenUI from '../fullScreenUI/FullScreenUI.js';
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
A simple container to store the font size
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class FontSizeManager {

	/**
	The font size
	@type {Number}
	*/

	#fontSize;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );

		// It's needed to initialize the fontSize in the increment or decrement functions because
		// theFontSizeManager is a global object created before theConfig initialization
		this.#fontSize = null;
	}

	/**
	Increment the font size
	*/

	increment ( ) {
		if ( ! this.#fontSize ) {
			this.#fontSize = theConfig.fontSize;
		}
		document.body.style [ 'font-size' ] = String ( ++ this.#fontSize ) + 'px';
	}

	/**
	Decrement the font size
	*/

	decrement ( ) {
		if ( ! this.#fontSize ) {
			this.#fontSize = theConfig.fontSize;
		}
		document.body.style [ 'font-size' ] = String ( -- this.#fontSize ) + 'px';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of FontSizeManager class
@type {FontSizeManager}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theFontSizeManager = new FontSizeManager ( );

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
				( theConfig.TravelNotesToolbar.contactMail.url || window.location.origin )
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				( ) => document.fullscreenElement ? '⬇️' : '🔝',
				theTranslator.getText (
					document.fullscreenElement
						?
						'TravelNotesToolbar - disable fullscreen'
						:
						'TravelNotesToolbar - enable fullscreen'
				),
				( ) => theFullScreenUI.toogle ( )
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'+',
				theTranslator.getText ( 'TravelNotesToolbar - Increment the font size' ),
				( ) => { theFontSizeManager.increment ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'-',
				theTranslator.getText ( 'TravelNotesToolbar - Decrement the font size' ),
				( ) => { theFontSizeManager.decrement ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'🔑',
				theTranslator.getText ( 'TravelNotesToolbar - API keys' ),
				( ) => { theAPIKeysManager.setKeysFromDialog ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'🌐',
				theTranslator.getText ( 'TravelNotesToolbar - Geo location' ),
				( ) => { theGeoLocator.switch ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'☢️',
				theTranslator.getText ( 'TravelNotesToolbar - Save as travel' ),
				( ) => { theTravelEditor.saveAsTravel ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'❌',
				theTranslator.getText ( 'TravelNotesToolbar - Cancel travel' ),
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
				theTranslator.getText ( 'TravelNotesToolbar - Save travel' ),
				( ) => { theTravelEditor.saveTravel ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'📂',
				theTranslator.getText ( 'TravelNotesToolbar - Open travel' ),
				( ) => {
					if (
						theConfig.travelNotes.haveBeforeUnloadWarning
						&&
						(
							! window.confirm ( theTranslator.getText (
								'TravelNotesToolbar - This page ask to close; data are perhaps not saved.' )
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
				theTranslator.getText ( 'TravelNotesToolbar - Import travel' ),
				( ) => {
					if ( INVALID_OBJ_ID === theTravelNotesData.editedRouteObjId ) {
						theUtilities.openFile ( new ImportInputChangeEL ( ), '.trv,.gpx' );
					}
					else {
						theErrorsUI.showError (
							theTranslator.getText (
								'TravelNotesToolbar - Not possible to merge a travel when a route is edited'
							)
						);
					}
				}
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'📙',
				theTranslator.getText ( 'TravelNotesToolbar - Open travel roadbook' ),
				'TravelNotesRoadbook.html?lng=' +
						theConfig.travelNotes.language + '&page=' +
						theTravelNotesData.UUID
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'🛄',
				theTranslator.getText ( 'TravelNotesToolbar - Travel properties' ),
				( ) => { theDockableDialogsManager.travelPropertiesDialog.show ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'🗨️',
				theTranslator.getText ( 'TravelNotesToolbar - Travel notes' ),
				( ) => { theDockableDialogsManager.travelNotesDialog.show ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'🔍',
				theTranslator.getText ( 'Search with OpenStreetMap' ),
				( ) => { theDockableDialogsManager.osmSearchDialog.show ( ); }
			)
		);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of TravelNotesToolbar class
@type {TravelNotesToolbar}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theTravelNotesToolbar = new TravelNotesToolbar ( );

export default theTravelNotesToolbar;

/* --- End of file --------------------------------------------------------------------------------------------------------- */