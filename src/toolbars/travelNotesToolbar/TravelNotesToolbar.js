/*
Copyright - 2017 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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
		- created from v3.6.0
Doc reviewed 202208
 */

import AboutDialog from '../../dialogs/aboutDialog/AboutDialog.js';
import BaseToolbar from '../baseToolbar/BaseToolbar.js';
import ToolbarItem from '../baseToolbar/ToolbarItem.js';
import theApiKeysManager from '../../core/ApiKeysManager.js';
import theGeoLocator from '../../core/GeoLocator.js';
import theConfig from '../../data/Config.js';
import theTranslator from '../../core/uiLib/Translator.js';
import theTravelNotesData from '../../data/TravelNotesData.js';
import theUtilities from '../../core/uiLib/Utilities.js';
import theErrorsUI from '../../uis/errorsUI/ErrorsUI.js';
import theTravelEditor from '../../core/TravelEditor.js';
import theDockableDialogsManager from '../../core/DockableDialogsManager.js';
import theFullScreenUI from '../../uis/fullScreenUI/FullScreenUI.js';
import theFontSizeManager from '../../core/FontSizeManager.js';
import OpenInputChangeEL from './OpenInputChangeEL.js';
import ImportInputChangeEL from './ImportInputChangeEL.js';
import theDevice from '../../core/lib/Device.js';
import { INVALID_OBJ_ID, TOOLBAR_POSITION, GEOLOCATION_STATUS, ZERO, ONE } from '../../main/Constants.js';

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
		const writeExtension = theDevice.isTouch ? theConfig.files.writeTouch : theConfig.files.writeOthers;
		const translationVar = Object.seal ( { openTaN : '', openGpx : '' } );
		theConfig.files.openTaN.forEach ( fileExtension => translationVar.openTaN += '.' + fileExtension + ',' );
		theConfig.files.openGpx.forEach ( fileExtension => translationVar.openGpx += '.' + fileExtension + ',' );
		const fileExtensions = ( translationVar.openTaN + translationVar.openGpx ).slice ( ZERO, -ONE );
		translationVar.openTaN = translationVar.openTaN.slice ( ZERO, -ONE );
		translationVar.openGpx = translationVar.openGpx.slice ( ZERO, -ONE );
		translationVar.openTaN.replaceAll ( ',', ', ' );
		translationVar.openGpx.replaceAll ( ',', ', ' );

		this.addToolbarItem (
			theGeoLocator.status === GEOLOCATION_STATUS.active
				?
				new ToolbarItem (
					'🏀',
					theTranslator.getText ( 'TravelNotesToolbar - Stop Geo location' ),
					( ) => { theGeoLocator.switch ( ); }
				)
				:
				new ToolbarItem (
					'🌐',
					theTranslator.getText ( 'TravelNotesToolbar - Start Geo location' ),
					( ) => { theGeoLocator.switch ( ); }
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
				theTranslator.getText ( 'TravelNotesToolbar - Save travel', { extension : writeExtension } ),
				( ) => { theTravelEditor.saveTravel ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'📂',
				theTranslator.getText ( 'TravelNotesToolbar - Open travel', translationVar ),
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
					theUtilities.openFile ( new OpenInputChangeEL ( ), fileExtensions );
				}
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'🌏',
				theTranslator.getText ( 'TravelNotesToolbar - Import travel', translationVar ),
				( ) => {
					if ( INVALID_OBJ_ID === theTravelNotesData.editedRouteObjId ) {
						theUtilities.openFile ( new ImportInputChangeEL ( ), fileExtensions );
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
		if ( theConfig.ApiKeysDialog.showButton ) {
			this.addToolbarItem (
				new ToolbarItem (
					'🔑',
					theTranslator.getText ( 'TravelNotesToolbar - api keys' ),
					( ) => { theApiKeysManager.setKeysFromDialog ( ); }
				)
			);
		}
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
		this.addToolbarItem (
			new ToolbarItem (
				'☢️',
				theTranslator.getText ( 'TravelNotesToolbar - Save as travel', { extension : writeExtension } ),
				( ) => { theTravelEditor.saveAsTravel ( ); }
			)
		);
		this.addToolbarItem (
			new ToolbarItem (
				'🛠️',
				theTranslator.getText ( 'TravelNotesToolbar - About Travel & Notes' ),
				( ) => new AboutDialog ( ).show ( )
			)
		);
		if ( document.fullscreenEnabled ) {
			this.addToolbarItem (
				document.fullscreenElement
					?
					new ToolbarItem (
						'🔻',
						theTranslator.getText ( 'TravelNotesToolbar - disable fullscreen' ),
						( ) => theFullScreenUI.toggle ( )
					)
					:
					new ToolbarItem (
						'🔺',
						theTranslator.getText ( 'TravelNotesToolbar - enable fullscreen' ),
						( ) => theFullScreenUI.toggle ( )
					)
			);
		}
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
				( theConfig.travelNotesToolbar.contactMail.url || window.location.origin )
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