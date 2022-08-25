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

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theOsmSearchDictionary from '../coreOsmSearch/OsmSearchDictionary.js';
import { ZERO, MOUSE_WHEEL_FACTORS } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the tree checkboxes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TreeCheckboxChangeEL {

	/**
	A reference to the osmSearchTree Object
	@type {OsmSearchTree}
	*/

	#osmSearchTree = null;

	/**
	The constructor
	@param {OsmSearchTree} osmSearchTree A reference to the OsmSearchTree object
	*/

	constructor ( osmSearchTree ) {
		Object.freeze ( this );
		this.#osmSearchTree = osmSearchTree;
	}

	/**
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		theOsmSearchDictionary.selectItem (
			Number.parseInt ( changeEvent.target.parentNode.dataset.tanObjId ),
			changeEvent.target.checked
		);

		this.#osmSearchTree.redraw ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
wheel event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TreeWheelEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} wheelEvent The event to handle
	*/

	handleEvent ( wheelEvent ) {
		wheelEvent.stopPropagation ( );
		if ( wheelEvent.deltaY ) {
			wheelEvent.target.scrollTop +=
				wheelEvent.deltaY * MOUSE_WHEEL_FACTORS [ wheelEvent.deltaMode ];
		}
		wheelEvent.stopPropagation ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
cick event listener for the tree arrows
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TreeArrowClickEL {

	/**
	A reference to the OsmSearchTree object
	@type {OsmSearchTree}
	*/

	#osmSearchTree = null;

	/**
	The constructor
	@param {OsmSearchTree} osmSearchTree A reference to the OsmSearchTree object
	*/

	constructor ( osmSearchTree ) {
		Object.freeze ( this );
		this.#osmSearchTree = osmSearchTree;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		theOsmSearchDictionary.expandItem ( Number.parseInt ( clickEvent.target.parentNode.dataset.tanObjId ) );
		this.#osmSearchTree.redraw ( );
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class build the search tree and contains also methods to modify this tree
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmSearchTree {

	/**
	A reference to the tree HTMLElement
	@type {HTMLElement}
	*/

	#treeHTMLElement;

	/**
	Tree arrow click event listener
	@type {TreeArrowClickEL}
	*/

	#treeArrowClickEL;

	/**
	Tree checkbox change event listener
	@type {TreeCheckboxChangeEL}
	*/

	#treeCheckboxChangeEL;

	/**
	Recursivity counter for the #addItem method
	@type {Number}
	*/

	#deepTree;

	/**
	Add a dictionary item in the SearchTree and do the same for all descendants
	@param {DictionaryItem} item The dictionary item to add
	*/

	#addItem ( item ) {

		this.#deepTree ++;

		// Container for the item
		const itemHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-OsmSearchDialog-SearchItemMargin' + this.#deepTree,
				dataset : { ObjId : item.objId }
			},
			this.#treeHTMLElement
		);

		// checkbox
		if ( ! item.isRoot ) {
			const itemCheckbox = theHTMLElementsFactory.create (
				'input',
				{
					type : 'checkbox',
					checked : item.isSelected
				},
				itemHTMLElement
			);
			itemCheckbox.addEventListener ( 'change', this.#treeCheckboxChangeEL, false );
		}

		// arrow
		if ( ZERO === item.filterTagsArray.length ) {
			const itemArrow = theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-OsmSearchDialog-Button TravelNotes-OsmSearchDialog-TreeArrow',
					textContent : item.isExpanded ? '▼' : '▶'
				},
				itemHTMLElement
			);
			itemArrow.addEventListener ( 'click', this.#treeArrowClickEL, false );
		}

		// text
		theHTMLElementsFactory.create (
			'text',
			{
				value : item.name
			},
			itemHTMLElement
		);

		// Recurse on sub items
		if ( item.isExpanded ) {
			item.items.forEach ( tmpItem => this.#addItem ( tmpItem ) );
		}

		// return to parent item
		this.#deepTree --;
	}

	/**
	The constructor
	*/

	constructor ( ) {

		Object.freeze ( this );

		this.#deepTree = ZERO;

		// Container creation
		this.#treeHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-OsmSearchDialog-SearchTree'
			}
		);

		// event listeners
		this.#treeHTMLElement.addEventListener ( 'wheel', new TreeWheelEL ( ), { passive : true } );
		this.#treeCheckboxChangeEL = new TreeCheckboxChangeEL ( this );
		this.#treeArrowClickEL = new TreeArrowClickEL ( this );

		// items
		this.#addItem ( theOsmSearchDictionary.dictionary );
	}

	/**
	rebuild the complete tree
	*/

	redraw ( ) {
		this.#treeHTMLElement.textContent = '';
		this.#addItem ( theOsmSearchDictionary.dictionary );
	}

	/**
	The tree HTML element
	@type {HTMLElement}
	*/

	get treeHTMLElement ( ) { return this.#treeHTMLElement; }
}

export default OsmSearchTree;

/* --- End of file --------------------------------------------------------------------------------------------------------- */