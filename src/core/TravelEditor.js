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
	- v1.0.0:
		- created
	- v1.1.0:
		- Issue ♯26 : added confirmation message before leaving the page when data modified.
		- Issue ♯27 : push directly the route in the editor when starting a new travel
		- Issue ♯31 : Add a command to import from others maps
		- Issue ♯34 : Add a command to show all routes
		- Issue ♯37 : Add the file name and mouse coordinates somewhere
	- v1.3.0:
		- moved JSON.parse, due to use of Promise
	- v1.4.0:
		- Replacing DataManager with TravelNotesData, Config, Version and DataSearchEngine
		- moving file functions from TravelEditor to the new FileLoader
	- v1.5.0:
		- Issue ♯52 : when saving the travel to the file, save also the edited route.
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v1.7.0:
		- Issue ♯90 : Open profiles are not closed when opening a travel or when starting a new travel
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	-v2.2.0:
		- Issue ♯129 : Add an indicator when the travel is modified and not saved
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests 20210902
*/

import theTranslator from '../UILib/Translator.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theConfig from '../data/Config.js';
import theErrorsUI from '../errorsUI/ErrorsUI.js';
import theRouteEditor from '../core/RouteEditor.js';
import theUtilities from '../UILib/Utilities.js';
import Travel from '../data/Travel.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import FileCompactor from '../coreLib/FileCompactor.js';
import theProfileDialogsManager from '../core/ProfileDialogsManager.js';
import { INVALID_OBJ_ID, SAVE_STATUS } from '../main/Constants.js';
import theMouseUI from '../mouseUI/MouseUI.js';
import SaveAsDialog from '../saveAsDialog/SaveAsDialog.js';

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
			compressedSaveAsTravel.name + '.trv',
			JSON.stringify ( compressedSaveAsTravel ),
			'application/json'
		);
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
		theEventDispatcher.dispatch ( 'setrouteslist' );
		theEventDispatcher.dispatch ( 'roadbookupdate' );
	}

	/**
	This method save the current travel to a file. The user can choose to save the notes and the maneuvers
	*/

	saveAsTravel ( ) {
		if ( '' === theTravelNotesData.travel.name ) {
			theErrorsUI.showError ( theTranslator.getText ( 'TravelEditor - Gives a name to the travel' ) );
			return;
		}

		if ( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId ) {
			theErrorsUI.showError (
				theTranslator.getText ( 'TravelEditor - Not possible to partial save when a route is edited.' )
			);
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
		if ( '' === theTravelNotesData.travel.name ) {
			theErrorsUI.showError ( theTranslator.getText ( 'TravelEditor - Gives a name to the travel' ) );
			return;
		}
		const routesIterator = theTravelNotesData.travel.routes.iterator;
		while ( ! routesIterator.done ) {
			routesIterator.value.hidden = false;
		}
		const compressedTravel = new FileCompactor ( ).compress ( theTravelNotesData.travel );
		theUtilities.saveFile ( compressedTravel.name + '.trv', JSON.stringify ( compressedTravel ), 'application/json' );
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

		theEventDispatcher.dispatch ( 'setrouteslist' );
		theEventDispatcher.dispatch ( 'showitinerary' );
		theEventDispatcher.dispatch ( 'roadbookupdate' );
		if ( theConfig.travelEditor.startupRouteEdition ) {
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