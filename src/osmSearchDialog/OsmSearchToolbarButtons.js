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
import theOsmSearchEngine from '../coreOsmSearch/OsmSearchEngine.js';
import theOsmSearchDictionary from '../coreOsmSearch/OsmSearchDictionary.js';
import theTranslator from '../UILib/Translator.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import theTravelNotesData from '../data/TravelNotesData.js';

import { ZERO } from '../main/Constants.js';

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
		theEventDispatcher.dispatch ( 'showsearch' );
		this.#osmSearchWait.showWait ( );
		theOsmSearchEngine.search ( );

		// Notice: theOsmSearchEngine send a 'showsearch' event when the search is succesfully done
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the expand tree button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ExpandTreeButtonClickEL {

	/**
	A reference to the osmSearchTree Object
	@type {OsmSearchTree}
	*/

	#osmSearchTree;

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
		theOsmSearchDictionary.expand ( );
		this.#osmSearchTree.redraw ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the collapse tree button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class CollapseButtonClickEL {

	/**
	A reference to the osmSearchTree Object
	@type {OsmSearchTree}
	*/

	#osmSearchTree;

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
		theOsmSearchDictionary.collapse ( );
		this.#osmSearchTree.redraw ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the clear tree button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ClearButtonClickEL {

	/**
	A reference to the osmSearchTree Object
	@type {OsmSearchTree}
	*/

	#osmSearchTree;

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
		theOsmSearchDictionary.unselectAll ( );
		this.#osmSearchTree.redraw ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class build the search toolbar and contains also the event listeners for the toolbar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmSearchToolbarButtons {

	/**
	The toolbar container
	@type {HTMLElement}
	*/

	#toolbarButtonsHTMLElement;

	/**
	The constructor
	@param {OsmSearchTree} osmSearchTree A reference to the OsmSearchTree object
	@param {OsmSearchWait} osmSearchWait A reference to the OsmSearchWait object
	*/

	constructor ( osmSearchTree, osmSearchWait ) {

		Object.freeze ( this );

		// container
		this.#toolbarButtonsHTMLElement = theHTMLElementsFactory.create (
			'div'
		);

		// Search button
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-OsmSearchDialog-Button',
				title : theTranslator.getText ( 'OsmSearchToolbarButtons - Start the search' ),
				textContent : '🔎'
			},
			this.#toolbarButtonsHTMLElement
		)
			.addEventListener ( 'click', new SearchButtonClickEL ( osmSearchTree, osmSearchWait ), false );

		// Expand tree button
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-OsmSearchDialog-Button',
				title : theTranslator.getText ( 'OsmSearchToolbarButtons - Expand the tree' ),
				textContent : '▼'
			},
			this.#toolbarButtonsHTMLElement
		)
			.addEventListener ( 'click', new ExpandTreeButtonClickEL ( osmSearchTree ), false );

		// Collapse button
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-OsmSearchDialog-Button',
				title : theTranslator.getText ( 'OsmSearchToolbarButtons - Collapse the tree' ),
				textContent : '▶'
			},
			this.#toolbarButtonsHTMLElement
		)
			.addEventListener ( 'click', new CollapseButtonClickEL ( osmSearchTree ), false );

		// clear button
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-OsmSearchDialog-Button',
				title : theTranslator.getText ( 'OsmSearchToolbarButtons - Clear the tree' ),
				textContent : '❌'
			},
			this.#toolbarButtonsHTMLElement
		)
			.addEventListener ( 'click', new ClearButtonClickEL ( osmSearchTree ), false );

	}

	/**
	The toolbar htmlElement
	@type {HTMLElement}
	*/

	get toolbarButtonsHTMLElement ( ) { return this.#toolbarButtonsHTMLElement; }

}

export default OsmSearchToolbarButtons;

/* --- End of file --------------------------------------------------------------------------------------------------------- */