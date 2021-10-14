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
Doc reviewed 20210915
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file OsmSearchToolbarUI.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module osmSearchPaneUI
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theOsmSearchEngine from '../coreOsmSearch/OsmSearchEngine.js';
import theOsmSearchDictionary from '../coreOsmSearch/OsmSearchDictionary.js';
import theTranslator from '../UILib/Translator.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import theTravelNotesData from '../data/TravelNotesData.js';

import { ZERO } from '../main/Constants.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class SearchButtonClickEL
@classdesc click event listener for the search button
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class SearchButtonClickEL {

	/**
	A reference to the osmSearchTreeUI Object
	@type {OsmSearchTreeUI}
	@private
	*/

	#osmSearchTreeUI = null;

	/**
	A reference to the osmSearchWaitUI Object
	@type {OsmSearchWaitUI}
	@private
	*/

	#osmSearchWaitUI = null;

	/*
	constructor
	@param {OsmSearchTreeUI} osmSearchTreeUI A reference to the OsmSearchTreeUI object
	@param {OsmSearchWaitUI} osmSearchWaitUI A reference to the OsmSearchWaitUI object
	*/

	constructor ( osmSearchTreeUI, osmSearchWaitUI ) {
		Object.freeze ( this );
		this.#osmSearchTreeUI = osmSearchTreeUI;
		this.#osmSearchWaitUI = osmSearchWaitUI;
	}

	/**
	Event listener method
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		theOsmSearchDictionary.dictionary.isExpanded = false;
		this.#osmSearchTreeUI.redraw ( );
		theTravelNotesData.searchData.length = ZERO;
		theEventDispatcher.dispatch ( 'showsearch' );
		this.#osmSearchWaitUI.showWait ( );
		theOsmSearchEngine.search ( );

		// Notice: theOsmSearchEngine send a 'showsearch' event when the search is succesfully done
	}

}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class ExpandButtonClickEL
@classdesc click event listener for the expand tree button
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class ExpandButtonClickEL {

	/**
	A reference to the osmSearchTreeUI Object
	@type {OsmSearchTreeUI}
	@private
	*/

	#osmSearchTreeUI = null;

	/*
	constructor
	@param {OsmSearchTreeUI} osmSearchTreeUI A reference to the OsmSearchTreeUI object
	*/

	constructor ( osmSearchTreeUI ) {
		Object.freeze ( this );
		this.#osmSearchTreeUI = osmSearchTreeUI;
	}

	/**
	Event listener method
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		theOsmSearchDictionary.expand ( );
		this.#osmSearchTreeUI.redraw ( );
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class CollapseButtonClickEL
@classdesc click event listener for the collapse tree button
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class CollapseButtonClickEL {

	/**
	A reference to the osmSearchTreeUI Object
	@type {OsmSearchTreeUI}
	@private
	*/

	#osmSearchTreeUI = null;

	/*
	constructor
	@param {OsmSearchTreeUI} osmSearchTreeUI A reference to the OsmSearchTreeUI object
	*/

	constructor ( osmSearchTreeUI ) {
		Object.freeze ( this );
		this.#osmSearchTreeUI = osmSearchTreeUI;
	}

	/**
	Event listener method
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		theOsmSearchDictionary.collapse ( );
		this.#osmSearchTreeUI.redraw ( );
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class ClearButtonClickEL
@classdesc click event listener for the clear tree button
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class ClearButtonClickEL {

	/**
	A reference to the osmSearchTreeUI Object
	@type {OsmSearchTreeUI}
	@private
	*/

	#osmSearchTreeUI = null;

	/*
	constructor
	@param {OsmSearchTreeUI} osmSearchTreeUI A reference to the OsmSearchTreeUI object
	*/

	constructor ( osmSearchTreeUI ) {
		Object.freeze ( this );
		this.#osmSearchTreeUI = osmSearchTreeUI;
	}

	/**
	Event listener method
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		theOsmSearchDictionary.unselectAll ( );
		this.#osmSearchTreeUI.redraw ( );
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class OsmSearchToolbarUI
@classdesc This class build the search toolbar and contains also the event listeners for the toolbar
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class OsmSearchToolbarUI {

	/**
	The toolbar container
	@type {HTMLElement}
	@private
	*/

	#toolbarHTMLElement = null;

	/*
	constructor
	@param {OsmSearchTreeUI} osmSearchTreeUI A reference to the OsmSearchTreeUI object
	@param {OsmSearchWaitUI} osmSearchWaitUI A reference to the OsmSearchWaitUI object
	*/

	constructor ( osmSearchTreeUI, osmSearchWaitUI ) {

		Object.freeze ( this );

		// container
		this.#toolbarHTMLElement = theHTMLElementsFactory.create (
			'div'
		);

		// Search button
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-UI-Button',
				title : theTranslator.getText ( 'OsmSearchPaneUI - Search OpenStreetMap' ),
				textContent : '🔎'
			},
			this.#toolbarHTMLElement
		)
			.addEventListener ( 'click', new SearchButtonClickEL ( osmSearchTreeUI, osmSearchWaitUI ), false );

		// Expand tree button
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-UI-Button',
				title : theTranslator.getText ( 'OsmSearchPaneUI - Expand tree' ),
				textContent : '▼'
			},
			this.#toolbarHTMLElement
		)
			.addEventListener ( 'click', new ExpandButtonClickEL ( osmSearchTreeUI ), false );

		// Collapse button
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-UI-Button',
				title : theTranslator.getText ( 'OsmSearchPaneUI - Collapse tree' ),
				textContent : '▶'
			},
			this.#toolbarHTMLElement
		)
			.addEventListener ( 'click', new CollapseButtonClickEL ( osmSearchTreeUI ), false );

		// clear button
		theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-OsmSearchPaneUI-ClearAllButton',
				className : 'TravelNotes-UI-Button',
				title : theTranslator.getText ( 'OsmSearchPaneUI - Clear tree' ),
				textContent : '❌'
			},
			this.#toolbarHTMLElement
		)
			.addEventListener ( 'click', new ClearButtonClickEL ( osmSearchTreeUI ), false );

	}

	/**
	The toolbar htmlElement
	@type HTMLElement
	@readonly
	*/

	get toolbarHTMLElement ( ) { return this.#toolbarHTMLElement; }

}

export default OsmSearchToolbarUI;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of OsmSearchToolbarUI.js file

@------------------------------------------------------------------------------------------------------------------------------
*/