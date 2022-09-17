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
import GpxParser from './lib/GpxParser.js';
import theErrorsUI from '../uis/errorsUI/ErrorsUI.js';
import theMouseUI from '../uis/mouseUI/MouseUI.js';
import theMapLayersManager from './MapLayersManager.js';
import theRouteEditor from './RouteEditor.js';
import FileCompactor from './lib/FileCompactor.js';
import theEventDispatcher from './lib/EventDispatcher.js';
import theProfileDialogsManager from './ProfileDialogsManager.js';
import Zoomer from './Zoomer.js';
import Travel from '../data/Travel.js';

import { INVALID_OBJ_ID, ROUTE_EDITION_STATUS, SAVE_STATUS } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class load a file from the computer disk and display the travel
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class FileLoader {

	/**
	Display the travel and fires event for updating the map and the UI
	*/

	#display ( ) {

		// the map is cleaned
		theEventDispatcher.dispatch ( 'removeallobjects' );

		// document title
		document.title =
			'Travel & Notes' +
			( '' === theTravelNotesData.travel.name ? '' : ' - ' + theTravelNotesData.travel.name );

		// displaying all not edited routes
		const routesIterator = theTravelNotesData.travel.routes.iterator;
		while ( ! routesIterator.done ) {
			if ( ROUTE_EDITION_STATUS.notEdited === routesIterator.value.editionStatus ) {
				theEventDispatcher.dispatch (
					'routeupdated',
					{
						removedRouteObjId : INVALID_OBJ_ID,
						addedRouteObjId : routesIterator.value.objId
					}
				);
			}
		}

		// displaying the edited route if any
		if ( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId ) {
			theEventDispatcher.dispatch (
				'routeupdated',
				{
					removedRouteObjId : INVALID_OBJ_ID,
					addedRouteObjId : theTravelNotesData.travel.editedRoute.objId
				}
			);
		}

		// displaying travel notes
		const notesIterator = theTravelNotesData.travel.notes.iterator;
		while ( ! notesIterator.done ) {
			theEventDispatcher.dispatch (
				'noteupdated',
				{
					removedNoteObjId : INVALID_OBJ_ID,
					addedNoteObjId : notesIterator.value.objId
				}
			);
		}
		theEventDispatcher.dispatch ( 'updatetravelnotes' );

		// zoom on travel
		new Zoomer ( ).zoomToTravel ( );

		// Setting the correct map
		theMapLayersManager.setMapLayer ( theTravelNotesData.travel.layerName );

		// Changing provider and transit mode if an edited route is found and if possible
		if ( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId ) {
			const providerName = theTravelNotesData.travel.editedRoute.itinerary.provider;
			if (
				( '' !== providerName )
				&&
				! theTravelNotesData.providers.get ( providerName.toLowerCase ( ) )
			) {
				theErrorsUI.showError (
					theTranslator.getText (
						'FileLoader - Not possible to select as provider',
						{ provider : providerName }
					)
				);
			}
			else {

				// Provider and transit mode are changed in the itinerary editor
				theEventDispatcher.dispatch ( 'setprovider', { provider : providerName } );

				const transitMode = theTravelNotesData.travel.editedRoute.itinerary.transitMode;
				if ( '' !== transitMode ) {
					theEventDispatcher.dispatch ( 'settransitmode', { transitMode : transitMode } );
				}
			}
		}

		theRouteEditor.chainRoutes ( );

		// Editors and HTML pages are filled
		theEventDispatcher.dispatch ( 'updatetravelproperties' );
		theEventDispatcher.dispatch ( 'updateroadbook' );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Open a local file and display the content of the file
	@param {String} fileContent The xml content of the selected file
	*/

	openLocalGpxFile ( fileContent ) {

		// Closing all profiles
		theProfileDialogsManager.deleteAllProfiles ( );

		// Parsing the gpx
		theTravelNotesData.travel.jsonObject = new GpxParser ( ).parse ( fileContent ).jsonObject;
		theTravelNotesData.editedRouteObjId = INVALID_OBJ_ID;

		// display the travel
		this.#display ( );

		// Updating theMouseUI
		theMouseUI.saveStatus = SAVE_STATUS.saved;

	}

	/**
	Open a local file and display the content of the file
	@param {String} fileContent The json content of the selected file
	*/

	openLocalTrvFile ( fileContent ) {

		// Closing all profiles
		theProfileDialogsManager.deleteAllProfiles ( );

		const travelJsonObject = JSON.parse ( fileContent );

		// Decompress the json file content and uploading the travel in theTravelNotesData object
		new FileCompactor ( ).decompress ( travelJsonObject );
		theTravelNotesData.travel.jsonObject = travelJsonObject;
		theTravelNotesData.editedRouteObjId = INVALID_OBJ_ID;
		theTravelNotesData.travel.routes.forEach (
			route => {
				if ( ROUTE_EDITION_STATUS.notEdited !== route.editionStatus ) {
					theTravelNotesData.editedRouteObjId = route.objId;
				}
			}
		);

		// display the travel
		this.#display ( );

		// Updating theMouseUI
		theMouseUI.saveStatus = SAVE_STATUS.saved;
	}

	/**
	Merge a Travel with the curently displayed Travel
	@param {Travel} mergedTravel The travel to merge
	*/

	#mergeTravel ( mergedTravel ) {

		// routes are added with their notes
		const routesIterator = mergedTravel.routes.iterator;
		while ( ! routesIterator.done ) {
			theTravelNotesData.travel.routes.add ( routesIterator.value );
		}

		// travel notes are added
		const notesIterator = mergedTravel.notes.iterator;
		while ( ! notesIterator.done ) {
			theTravelNotesData.travel.notes.add ( notesIterator.value );
		}

		// display the travel
		this.#display ( );

		// Updating theMouseUI
		theMouseUI.saveStatus = SAVE_STATUS.modified;
	}

	/**
	Merge the content of a gpx file with the curently displayed Travel
	@param {String} fileContent The gpx file content to merge
	*/

	mergeLocalGpxFile ( fileContent ) {
		this.#mergeTravel ( new GpxParser ( ).parse ( fileContent ) );
	}

	/**
	Merge the content of a TaN file with the currently displayed Travel
	@param {String} fileContent The TaN file content to merge
	*/

	mergeLocalTrvFile ( fileContent ) {

		const travelJsonObject = JSON.parse ( fileContent );

		// Decompress the json file content and uploading the travel in a new Travel object
		new FileCompactor ( ).decompress ( travelJsonObject );
		const mergedTravel = new Travel ( );
		mergedTravel.jsonObject = travelJsonObject;

		this.#mergeTravel ( mergedTravel );
	}
}

export default FileLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */