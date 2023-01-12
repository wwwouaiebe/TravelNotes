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

import theOsmSearchEngine from '../../../core/osmSearch/OsmSearchEngine.js';
import theOsmSearchDictionary from '../../../core/osmSearch/OsmSearchDictionary.js';
import theEventDispatcher from '../../../core/lib/EventDispatcher.js';
import theTravelNotesData from '../../../data/TravelNotesData.js';

import { ZERO } from '../../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the search button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SearchButtonClickEL {

	/**
	A reference to the osmSearchTree Object
	@type {OsmSearchTree}
	*/

	#osmSearchTree;

	/**
	A reference to the osmSearchWait Object
	@type {OsmSearchWait}
	*/

	#osmSearchWait;

	/**
	The constructor
	@param {OsmSearchTree} osmSearchTree A reference to the OsmSearchTree object
	@param {OsmSearchWait} osmSearchWait A reference to the OsmSearchWait object
	*/

	constructor ( osmSearchTree, osmSearchWait ) {
		Object.freeze ( this );
		this.#osmSearchTree = osmSearchTree;
		this.#osmSearchWait = osmSearchWait;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		theOsmSearchDictionary.dictionary.isExpanded = false;
		this.#osmSearchTree.redraw ( );
		theTravelNotesData.searchData.length = ZERO;
		theEventDispatcher.dispatch ( 'updateosmsearch' );
		this.#osmSearchWait.showWait ( );
		theOsmSearchEngine.search ( );

		// Notice: theOsmSearchEngine send a 'updateosmsearch' event when the search is succesfully done
	}
}

export default SearchButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */