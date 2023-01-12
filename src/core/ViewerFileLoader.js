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

import theTravelNotesData from '../data/TravelNotesData.js';
import theEventDispatcher from './lib/EventDispatcher.js';
import FileCompactor from './lib/FileCompactor.js';
import Zoomer from './Zoomer.js';
import { ROUTE_EDITION_STATUS, INVALID_OBJ_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class load a file from a web server and display the travel
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ViewerFileLoader {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Open a distant file from a web server and display the content of the file
	@param {JsonObject} travelJsonObject the json object readed from the file
	*/

	openDistantFile ( travelJsonObject ) {
		new FileCompactor ( ).decompress ( travelJsonObject );
		theTravelNotesData.travel.jsonObject = travelJsonObject;
		theTravelNotesData.travel.readOnly = true;
		document.title =
			'Travel & Notes' +
			( '' === theTravelNotesData.travel.name ? '' : ' - ' + theTravelNotesData.travel.name );
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
			else {
				theTravelNotesData.editedRouteObjId = routesIterator.value.objId;
			}
		}

		if ( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId ) {
			theEventDispatcher.dispatch (
				'routeupdated',
				{
					removedRouteObjId : INVALID_OBJ_ID,
					addedRouteObjId : theTravelNotesData.travel.editedRoute.objId
				}
			);
		}
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
		new Zoomer ( ).zoomToTravel ( );
	}

}

export default ViewerFileLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */