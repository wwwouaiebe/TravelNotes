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

import theIndexedDb from '../core/uiLib/IndexedDb.js';
import theTravelHTMLViewsFactory from '../viewsFactories/TravelHTMLViewsFactory.js';
import theUtilities from '../core/uiLib/Utilities.js';
import theMouseUI from '../uis/mouseUI/MouseUI.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import { SAVE_STATUS } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
roadbookupdate event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RoadbookUpdateEL {

	/**
	A boolean indicating when the local storage is available
	@type {Boolean}
	*/

	#storageAvailable;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#storageAvailable = theUtilities.storageAvailable ( 'localStorage' );
	}

	/**
	Event listener method
	*/

	handleEvent ( ) {
		theMouseUI.saveStatus = SAVE_STATUS.modified;

		if ( this.#storageAvailable ) {
			theIndexedDb.getOpenPromise ( )
				.then (
					( ) => {
						theIndexedDb.getWritePromise (
							theTravelNotesData.UUID,
							theTravelHTMLViewsFactory.getTravelHTML ( 'TravelNotes-Roadbook-' ).outerHTML
						);
					}
				)
				.then ( ( ) => localStorage.setItem ( theTravelNotesData.UUID, Date.now ( ) ) )
				.catch ( err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
				}
				);
		}
	}
}

export default RoadbookUpdateEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */