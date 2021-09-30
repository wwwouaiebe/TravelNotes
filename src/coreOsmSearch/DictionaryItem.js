/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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

/**
@------------------------------------------------------------------------------------------------------------------------------

@file DictionaryItem.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module coreOsmSearch
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import ObjId from '../data/ObjId.js';
import { NOT_FOUND, INVALID_OBJ_ID } from '../main/Constants.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class DictionaryItem
@classdesc This class is used to represent a branch of the dictionary tree.
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class DictionaryItem {

	/**
	The name displayed to the user
	@type {string}
	@private
	*/

	#name = '';

	/**
	A boolean indicating when the item is the root item.
	@type {boolean}
	@private
	*/

	#isRoot = false;

	/**
	An array with subitems if any
	@type {Array.<DictionaryItem>}
	@private
	*/

	#items = [];

	/**
	The elements type used for the item
	@type {Array<string>}
	@private
	*/

	#elementTypes = [ 'node', 'way', 'relation' ];

	/**
	An array of arrays of objects. This is used to filter the results received from osm.
	Each sub array is a line in the TravelNotesSearchDictionary
	Each object in a sub array is a cell in the TravelNotesSearchDictionary
	@type {Array.<Array.<Objects>>}
	@private
	*/

	#filterTagsArray = [];

	/**
	A boolean indicating when the item is selected by the user
	@type {boolean}
	@private
	*/

	#isSelected = false;

	/**
	A boolean indicating when the item is expanded by the user
	@type {boolean}
	@private
	*/

	#isExpanded = false;

	/**
	A unique identifier given to the DictionaryItem
	@type {!number}
	@private
	*/

	#objId = INVALID_OBJ_ID;

	/*
	constructor
	@param {string } itemName The name of the item
	@param {boolean} isRoot True when the item is the root item ( = the dictionary )
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
	@type {string}
	@readonly
	*/

	get name ( ) { return this.#name; }

	/**
	A boolean indicating when the item is the root item.
	@type {boolean}
	@readonly
	*/

	get isRoot ( ) { return this.#isRoot; }

	/**
	An array with subitems if any
	@type {Array.<DictionaryItem>}
	@readonly
	*/

	get items ( ) { return this.#items; }

	/**
	The element types used for the item
	@type {Array<string>}
	*/

	get elementTypes ( ) { return this.#elementTypes; }

	/**
	Change the value of elementTypes to only one value
	@param {string} elementType The element type to set must be one of 'node', 'way' or 'relation'
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
	@type {Array.<Array.<Objects>>}
	@readonly
	*/

	get filterTagsArray ( ) { return this.#filterTagsArray; }

	/**
	A boolean indicating when the item is selected by the user
	@type {boolean}
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
	@type {boolean}
	*/

	get isExpanded ( ) { return this.#isExpanded; }

	set isExpanded ( isExpanded ) { this.#isExpanded = isExpanded; }

	/**
	A unique identifier given to the DictionaryItem
	@type {!number}
	@readonly
	*/

	get objId ( ) { return this.#objId; }
}

export default DictionaryItem;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of DictionaryItem.js file

@------------------------------------------------------------------------------------------------------------------------------
*/