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
	A reference to the osmSearchTreeUI Object
	@type {OsmSearchTreeUI}
	*/

	#osmSearchTreeUI = null;

	/**
	The constructor
	@param {OsmSearchTreeUI} osmSearchTreeUI A reference to the OsmSearchTreeUI object
	*/

	constructor ( osmSearchTreeUI ) {
		Object.freeze ( this );
		this.#osmSearchTreeUI = osmSearchTreeUI;
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

		this.#osmSearchTreeUI.redraw ( );
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
	A reference to the OsmSearchTreeUI object
	@type {OsmSearchTreeUI}
	*/

	#osmSearchTreeUI = null;

	/**
	The constructor
	@param {OsmSearchTreeUI} osmSearchTreeUI A reference to the OsmSearchTreeUI object
	*/

	constructor ( osmSearchTreeUI ) {
		Object.freeze ( this );
		this.#osmSearchTreeUI = osmSearchTreeUI;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		theOsmSearchDictionary.expandItem ( Number.parseInt ( clickEvent.target.parentNode.dataset.tanObjId ) );
		this.#osmSearchTreeUI.redraw ( );
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class build the search tree and contains also methods to modify this tree
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmSearchTreeUI {

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
		const itemDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-OsmSearchPaneUI-SearchItem ' +
					'TravelNotes-OsmSearchPaneUI-SearchItemMargin' + this.#deepTree,
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
				itemDiv
			);
			itemCheckbox.addEventListener ( 'change', this.#treeCheckboxChangeEL, false );
		}

		// arrow
		if ( ZERO === item.filterTagsArray.length ) {
			const itemArrow = theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-UI-Button TravelNotes-OsmSearchPaneUI-TreeArrow',
					textContent : item.isExpanded ? '▼' : '▶'
				},
				itemDiv
			);
			itemArrow.addEventListener ( 'click', this.#treeArrowClickEL, false );
		}

		// text
		theHTMLElementsFactory.create (
			'text',
			{
				value : item.name
			},
			itemDiv
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
				id : 'TravelNotes-OsmSearchPaneUI-SearchTree'
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

export default OsmSearchTreeUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */