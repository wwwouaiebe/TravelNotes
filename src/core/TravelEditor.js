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
		- created from v3.6.0
Doc reviewed 202208
 */

import theTranslator from './uiLib/Translator.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theConfig from '../data/Config.js';
import theErrorsUI from '../uis/errorsUI/ErrorsUI.js';
import theRouteEditor from './RouteEditor.js';
import theUtilities from './uiLib/Utilities.js';
import Travel from '../data/Travel.js';
import theEventDispatcher from './lib/EventDispatcher.js';
import FileCompactor from './lib/FileCompactor.js';
import theProfileDialogsManager from './ProfileDialogsManager.js';
import { INVALID_OBJ_ID, SAVE_STATUS } from '../main/Constants.js';
import theMouseUI from '../uis/mouseUI/MouseUI.js';
import SaveAsDialog from '../dialogs/saveAsDialog/SaveAsDialog.js';
import theDevice from './lib/Device.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class contains methods fot Travel creation or modifications
See theTravelEditor for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelEditor {

	/**
	This method save the travel to a file, removing notes and maneuvers, depending of the user choice.
	@param {SaveAsDialogData} saveAsDialogData an object describing witch data must be saved
	*/

	#saveAsTravel ( saveAsDialogData ) {

		const saveAsTravel = new Travel ( );
		saveAsTravel.jsonObject = theTravelNotesData.travel.jsonObject;
		saveAsTravel.name += '-partial';
		let routesIterator = saveAsTravel.routes.iterator;
		while ( ! routesIterator.done ) {
			routesIterator.value.hidden = false;
		}
		if ( saveAsDialogData.removeTravelNotes ) {
			saveAsTravel.notes.removeAll ( );
		}
		if ( saveAsDialogData.removeRoutesNotes ) {
			routesIterator = saveAsTravel.routes.iterator;
			while ( ! routesIterator.done ) {
				routesIterator.value.notes.removeAll ( );
			}
		}
		if ( saveAsDialogData.removeManeuvers ) {
			routesIterator = saveAsTravel.routes.iterator;
			while ( ! routesIterator.done ) {
				routesIterator.value.itinerary.maneuvers.removeAll ( );
			}
		}
		const compressedSaveAsTravel = new FileCompactor ( ).compress ( saveAsTravel );
		theUtilities.saveFile (
			compressedSaveAsTravel.name + '.' +
				( theDevice.isTouch ? theConfig.files.writeTouch : theConfig.files.writeOthers ),
			JSON.stringify ( compressedSaveAsTravel ),
			'application/json'
		);
	}

	/**
	Verify that the travel have a name.
	Show an error and the TravelPropertiesDialog if no name
	@return {Boolean} true when the travel is named
	*/

	#verifyTravelName ( ) {
		if ( '' === theTravelNotesData.travel.name ) {
			theErrorsUI.showError ( theTranslator.getText ( 'TravelEditor - Gives a name to the travel' ) );
			theEventDispatcher.dispatch ( 'showtravelproperties' );
			return false;
		}
		return true;
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	This method is called when a route is dropped in the TravelUI and then routes reordered.
	@param {Number} draggedRouteObjId The objId of the dragged route
	@param {Number} targetRouteObjId The objId of the route on witch the drop was executed
	@param {Boolean} draggedBefore when true the dragged route is moved before the target route
	when false after
	*/

	routeDropped ( draggedRouteObjId, targetRouteObjId, draggedBefore ) {
		const newDraggedRouteObjId =
			draggedRouteObjId === theTravelNotesData.travel.editedRoute.objId
				?
				theTravelNotesData.editedRouteObjId
				:
				draggedRouteObjId;

		const newTargetRouteObjId =
			targetRouteObjId === theTravelNotesData.travel.editedRoute.objId
				?
				theTravelNotesData.editedRouteObjId
				:
				targetRouteObjId;

		theTravelNotesData.travel.routes.moveTo ( newDraggedRouteObjId, newTargetRouteObjId, draggedBefore );
		theRouteEditor.chainRoutes ( );
		theEventDispatcher.dispatch ( 'updatetravelproperties' );
		theEventDispatcher.dispatch ( 'updateroadbook' );
	}

	/**
	This method save the current travel to a file. The user can choose to save the notes and the maneuvers
	*/

	saveAsTravel ( ) {
		if ( ! this.#verifyTravelName ( ) ) {
			return;
		}
		if ( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId ) {
			theErrorsUI.showError (
				theTranslator.getText ( 'TravelEditor - Not possible to partial save when a route is edited.' )
			);
			theEventDispatcher.dispatch ( 'showtravelproperties' );
			return;
		}

		new SaveAsDialog ( ).show ( )
			.then ( removeData => { this.#saveAsTravel ( removeData ); } )
			.catch (
				err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
				}
			);
	}

	/**
	This method save the current travel to a file
	*/

	saveTravel ( ) {
		if ( ! this.#verifyTravelName ( ) ) {
			return;
		}
		const routesIterator = theTravelNotesData.travel.routes.iterator;
		while ( ! routesIterator.done ) {
			routesIterator.value.hidden = false;
		}
		const compressedTravel = new FileCompactor ( ).compress ( theTravelNotesData.travel );
		theUtilities.saveFile (
			compressedTravel.name + '.' +
			( theDevice.isTouch ? theConfig.files.writeTouch : theConfig.files.writeOthers ),
			JSON.stringify ( compressedTravel ),
			'application/json'
		);
		theMouseUI.saveStatus = SAVE_STATUS.saved;
	}

	/**
	This method clear the current travel and start a new travel
	*/

	newTravel ( ) {
		if (
			theConfig.travelNotes.haveBeforeUnloadWarning &&
			( ! window.confirm ( theTranslator.getText (
				'TravelEditor - This page ask to close; data are perhaps not saved.' ) ) )
		) {
			return;
		}
		theProfileDialogsManager.deleteAllProfiles ( );
		theEventDispatcher.dispatch ( 'removeallobjects' );

		theTravelNotesData.editedRouteObjId = INVALID_OBJ_ID;
		theTravelNotesData.travel.jsonObject = new Travel ( ).jsonObject;

		theEventDispatcher.dispatch ( 'updatetravelproperties' );
		theEventDispatcher.dispatch ( 'updateroadbook' );
		theEventDispatcher.dispatch ( 'updatetravelnotes' );
		if ( theConfig.travelNotes.startupRouteEdition ) {
			theRouteEditor.editRoute ( theTravelNotesData.travel.routes.first.objId );
		}
		theMouseUI.saveStatus = SAVE_STATUS.saved;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of TravelEditor class
@type {TravelEditor}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theTravelEditor = new TravelEditor ( );

export default theTravelEditor;

/* --- End of file --------------------------------------------------------------------------------------------------------- */