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

import theIndexedDb from '../core/uiLib/IndexedDb.js';
import theRoadbookUpdater from './RoadbookUpdater.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
storage event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class StorageEL {

	/**
	The UUID of the page
	@type {String}
	*/

	#UUID = null;

	/**
	The constructor
	@param {String} UUID The UUID of the page
	*/

	constructor ( UUID ) {
		this.#UUID = UUID;
	}

	/**
	Event listener method
	*/

	handleEvent ( ) {
		theIndexedDb.getReadPromise ( this.#UUID )
			.then (
				pageContent => {
					if ( pageContent ) {
						theRoadbookUpdater.updateRoadbook ( pageContent );
					}
					else {
						theRoadbookUpdater.updateRoadbook ( '' );
					}
				}
			)
			.catch (
				err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
				}
			);
	}
}

export default StorageEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */