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
Doc reviewed 20220825
Tests ...
*/

import theTravelNotesData from '../../data/TravelNotesData.js';
import theEventDispatcher from '../../core/lib/EventDispatcher.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouseenter event listener for search result
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SearchResultMouseEnterEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} mouseEvent The event to handle
	*/

	handleEvent ( mouseEvent ) {
		mouseEvent.stopPropagation ( );
		const osmElement = theTravelNotesData.searchData [ Number.parseInt ( mouseEvent.target.dataset.tanElementIndex ) ];
		theEventDispatcher.dispatch (
			'addsearchpointmarker',
			{
				objId : Number.parseInt ( mouseEvent.target.dataset.tanObjId ),
				latLng : [ osmElement.lat, osmElement.lon ],
				geometry : osmElement.geometry
			}
		);
	}

}

export default SearchResultMouseEnterEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */