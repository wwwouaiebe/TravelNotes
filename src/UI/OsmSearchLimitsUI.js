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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210915
Tests ...
*/

import ObjId from '../data/ObjId.js';
import theConfig from '../data/Config.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theOsmSearchEngine from '../coreOsmSearch/OsmSearchEngine.js';
import { INVALID_OBJ_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class manages the search limits on the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmSearchLimitsUI {

	/**
	ObjId for the previous search limits
	@type {Number}
	*/

	#previousSearchLimitObjId;

	/**
	ObjId for the  search limits
	@type {Number}
	*/

	#searchLimitObjId;

	/**
	Draw the search limit on the map.
	Also used as event listener for pan and zoom operations on the map.
	*/

	#drawSearchLimit ( ) {
		if ( INVALID_OBJ_ID === this.#searchLimitObjId ) {
			this.#searchLimitObjId = ObjId.nextObjId;
		}
		else {
			theEventDispatcher.dispatch ( 'removeobject', { objId : this.#searchLimitObjId } );
		}

		theEventDispatcher.dispatch (
			'addrectangle',
			{
				objId : this.#searchLimitObjId,
				bounds : theOsmSearchEngine.searchBounds,
				properties : theConfig.osmSearch.nextSearchLimit
			}
		);
	}

	/**
	Draw the previous search limit on the map
	*/

	#drawPreviousSearchlimit ( ) {
		const previousSearchBounds = theOsmSearchEngine.previousSearchBounds;
		if ( ! previousSearchBounds ) {
			return;
		}
		if ( INVALID_OBJ_ID === this.#previousSearchLimitObjId ) {
			this.#previousSearchLimitObjId = ObjId.nextObjId;
		}
		else {
			theEventDispatcher.dispatch ( 'removeobject', { objId : this.#previousSearchLimitObjId } );
		}
		theEventDispatcher.dispatch (
			'addrectangle',
			{
				objId : this.#previousSearchLimitObjId,
				bounds : [
					[ previousSearchBounds.getSouthWest ( ).lat, previousSearchBounds.getSouthWest ( ).lng ],
					[ previousSearchBounds.getNorthEast ( ).lat, previousSearchBounds.getNorthEast ( ).lng ]
				],
				properties : theConfig.osmSearch.previousSearchLimit
			}
		);
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#previousSearchLimitObjId = INVALID_OBJ_ID;
		this.#searchLimitObjId = INVALID_OBJ_ID;
	}

	/**
	Add maps event listeners and search limits on the map
	*/

	show ( ) {
		theTravelNotesData.map.on ( 'zoom', this.#drawSearchLimit, this );
		theTravelNotesData.map.on ( 'move', this.#drawSearchLimit, this );
		this.#drawSearchLimit ( );
		this.#drawPreviousSearchlimit ( );
	}

	/**
	Remove maps event listeners and search limits on the map
	*/

	hide ( ) {
		theTravelNotesData.map.off ( 'zoom', this.#drawSearchLimit, this );
		theTravelNotesData.map.off ( 'move', this.#drawSearchLimit, this );
		if ( INVALID_OBJ_ID !== this.#searchLimitObjId ) {
			theEventDispatcher.dispatch ( 'removeobject', { objId : this.#searchLimitObjId } );
			this.#searchLimitObjId = INVALID_OBJ_ID;
		}
		if ( INVALID_OBJ_ID !== this.#previousSearchLimitObjId ) {
			theEventDispatcher.dispatch ( 'removeobject', { objId : this.#previousSearchLimitObjId } );
			this.#previousSearchLimitObjId = INVALID_OBJ_ID;
		}
	}
}

export default OsmSearchLimitsUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */