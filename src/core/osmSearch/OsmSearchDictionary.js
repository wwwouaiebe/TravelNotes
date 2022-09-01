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

import DictionaryItem from '../coreOsmSearch/DictionaryItem.js';
import { NOT_FOUND, ZERO, ONE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class contains the OsmSearch dictionary and methods to perform changes in the dictionary

See DictionaryItem for dictionary items

See theOsmSearchDictionary for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmSearchDictionary {

	/**
	the root item of the dictionary
	@type {DictionaryItem}
	*/

	#dictionary;

	/**
	A map with the all the DictionaryItem created, selectable by their objId
	@type {Map}
	*/

	#itemsMap;

	/**
	the currentItem treated by the #parseLine method
	@type {DictionaryItem}
	*/

	#currentItem;

	/**
	Array used to store a reference to the items property  of the DictionaryItem Objects
	and so build the tree.
	@type {Array.<Array.<DictionaryItem>>}
	*/

	#itemsArray;

	/**
	Split a line from the csv file into cells and add a DictionaryItem or a filterTag to the dictionary
	@param {String} line A line of the csv file that will be parsed
	*/

	#parseLine ( line ) {

		// split the linres into cells
		const cells = line.split ( ';' );

		// removing empty cells at the end of the line
		while ( '' === cells [ cells.length - ONE ] ) {
			cells.pop ( );
		}

		// The cell position in line. Used to build the tree
		let cellPos = ZERO;

		// An array with filterTags objects used to filter the osm elements. See DictionaryItem
		const filterTags = [];
		cells.forEach (
			cell => {
				if ( '' !== cell ) {

					// The cell contains something
					if ( NOT_FOUND === cell.indexOf ( '=' ) ) {

						// The cell don't contains the = char. A new DictionaryItem is created
						this.#currentItem = new DictionaryItem ( cell );

						// The item is added to the itemsMap
						this.#itemsMap.set ( this.#currentItem.objId, this.#currentItem );

						this.#itemsArray [ cellPos ].push ( this.#currentItem );
						this.#itemsArray [ cellPos + ONE ] = this.#currentItem.items;
					}
					else {

						// Each cell is splited into a key and a value
						let keyAndValue = cell.split ( '=' );

						if ( 'element' === keyAndValue [ ZERO ] ) {

							// Only one elementType is acceptable for this item
							this.#currentItem.setElementType ( keyAndValue [ ONE ] );
						}
						else {

							// A filterTag object is created...
							let filterTag = {};

							// ...and a property added to the object. The property name is the key found in the cell
							// and the property value is the value found in the cell, except when the value is *
							filterTag [ keyAndValue [ ZERO ] ] =
								'*' === keyAndValue [ ONE ] ? null : keyAndValue [ ONE ];

							// ...and the filterTag object pushed in the array
							filterTags.push ( filterTag );
						}
					}
				}
				cellPos ++;
			}
		);
		if ( ZERO !== filterTags.length ) {
			this.#currentItem.filterTagsArray.push ( filterTags );
		}
	}

	/**
	Mark as expanded an item and all the childrens
	@param {DictionaryItem} item The item to mark as expanded
	*/

	#expand ( item ) {
		item.items.forEach (
			subItem => { this.#expand ( subItem ); }
		);
		item.isExpanded = true;
	}

	/**
	Mark as not expanded an item and all the childrens
	@param {DictionaryItem} item The item to mark as not expanded
	*/

	#collapse ( item ) {
		item.items.forEach (
			subItem => { this.#collapse ( subItem ); }
		);
		item.isExpanded = false;
	}

	/**
	The constructor
	*/

	constructor ( ) {
		this.#dictionary = new DictionaryItem ( '', true );
		this.#itemsMap = new Map ( );
		this.#itemsMap.set ( this.#dictionary.objId, this.#dictionary );
		this.#itemsArray = [ this.#dictionary.items ];
		Object.freeze ( this );
	}

	/**
	The dictionary
	@type {DictionaryItem}
	*/

	get dictionary ( ) { return this.#dictionary; }

	/**
	Parse the content of the TravelNotesSearchDictionaryXX.csv and build a tree of DictionaryItem
	with this content
	@param {String} dictionaryTextContent The content of the TravelNotesSearchDictionaryXX.csv file
	*/

	parseDictionary ( dictionaryTextContent ) {

		// split the dictionary content into lines and analyse each line
		dictionaryTextContent.split ( /\r\n|\r|\n/ ).forEach (
			line => {
				if ( '' !== line ) {
					this.#parseLine ( line );
				}
			}
		);
	}

	/**
	Mark as selected/not selected an item identified by it's objId and all the chidrens of this item
	@param {Number} itemObjId The objId of the item
	@param {Boolean} isSelected The value to set for isSelected
	*/

	selectItem ( itemObjId, isSelected ) {
		this.#itemsMap.get ( itemObjId ).isSelected = isSelected;
	}

	/**
	Mark the complete dictionary as not selected
	*/

	unselectAll ( ) {
		this.#dictionary.isSelected = false;
	}

	/**
	Mark as expanded an item identified by it's objId
	@param {Number} itemObjId The objId of the item
	*/

	expandItem ( itemObjId ) {
		let item = this.#itemsMap.get ( itemObjId );
		item.isExpanded = ! item.isExpanded;
	}

	/**
	Mark the complete dictionary as expanded
	*/

	expand ( ) {
		this.#expand ( this.#dictionary );
	}

	/**
	Mark the complete dictionary except the root item as not expanded
	*/

	collapse ( ) {
		this.#dictionary.items.forEach (
			item => this.#collapse ( item )
		);
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of OsmSearchDictionary class
@type {OsmSearchDictionary}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theOsmSearchDictionary = new OsmSearchDictionary ( );

export default theOsmSearchDictionary;

/* --- End of file --------------------------------------------------------------------------------------------------------- */