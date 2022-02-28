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
Doc reviewed 20210914
Tests ...
*/

import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import ObjId from '../data/ObjId.js';
import { NOT_FOUND, INVALID_OBJ_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is used to represent a branch of the dictionary tree.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DictionaryItem {

	/**
	The name displayed to the user
	@type {String}
	*/

	#name = '';

	/**
	A boolean indicating when the item is the root item.
	@type {Boolean}
	*/

	#isRoot = false;

	/**
	An array with subitems if any
	@type {Array.<DictionaryItem>}
	*/

	#items = [];

	/**
	The elements type used for the item
	@type {Array.<string>}
	*/

	#elementTypes = [ 'node', 'way', 'relation' ];

	/**
	An array of arrays of objects. This is used to filter the results received from osm.
	Each sub array is a line in the TravelNotesSearchDictionary
	Each object in a sub array is a cell in the TravelNotesSearchDictionary
	@type {Array.<Array.<Object>>}
	*/

	#filterTagsArray = [];

	/**
	A boolean indicating when the item is selected by the user
	@type {Boolean}
	*/

	#isSelected = false;

	/**
	A boolean indicating when the item is expanded by the user
	@type {Boolean}
	*/

	#isExpanded = false;

	/**
	A unique identifier given to the DictionaryItem
	@type {Number}
	*/

	#objId = INVALID_OBJ_ID;

	/**
	The constructor
	@param {String} itemName The name of the item
	@param {Boolean} isRoot True when the item is the root item ( = the dictionary )
	*/

	constructor ( itemName, isRoot ) {

		this.#name = theHTMLSanitizer.sanitizeToJsString ( itemName );
		if ( isRoot ) {
			this.#isExpanded = true;
			this.#isRoot = true;
		}

		this.#objId = ObjId.nextObjId;

		Object.freeze ( this );
	}

	/**
	The name displayed to the user
	@type {String}
	*/

	get name ( ) { return this.#name; }

	/**
	A boolean indicating when the item is the root item.
	@type {Boolean}
	*/

	get isRoot ( ) { return this.#isRoot; }

	/**
	An array with subitems if any
	@type {Array.<DictionaryItem>}
	*/

	get items ( ) { return this.#items; }

	/**
	The element types used for the item
	@type {Array.<string>}
	*/

	get elementTypes ( ) { return this.#elementTypes; }

	/**
	Change the value of elementTypes to only one value
	@param {String} elementType The element type to set must be one of 'node', 'way' or 'relation'
	*/

	setElementType ( elementType ) {
		if ( NOT_FOUND !== [ 'node', 'way', 'relation' ].indexOf ( elementType ) ) {
			this.#elementTypes = [ elementType ];
		}
	}

	/**
	An array of arrays of objects. This is used to filter the results received from osm.
	Each sub array is a line in the TravelNotesSearchDictionary
	Each object in a sub array is a cell in the TravelNotesSearchDictionary
	@type {Array.<Array.<Object>>}
	*/

	get filterTagsArray ( ) { return this.#filterTagsArray; }

	/**
	A boolean indicating when the item is selected by the user
	@type {Boolean}
	*/

	get isSelected ( ) { return this.#isSelected; }

	set isSelected ( isSelected ) {
		this.#isSelected = isSelected;
		this.items.forEach (
			item => {
				item.isSelected = isSelected;
			}
		);
	}

	/**
	A boolean indicating when the item is expanded by the user
	@type {Boolean}
	*/

	get isExpanded ( ) { return this.#isExpanded; }

	set isExpanded ( isExpanded ) { this.#isExpanded = isExpanded; }

	/**
	A unique identifier given to the DictionaryItem
	@type {Number}
	*/

	get objId ( ) { return this.#objId; }
}

export default DictionaryItem;

/* --- End of file --------------------------------------------------------------------------------------------------------- */