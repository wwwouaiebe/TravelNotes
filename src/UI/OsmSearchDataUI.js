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

@file OsmSearchDataUI.js
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

import theTravelNotesData from '../data/TravelNotesData.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import theNoteDialogToolbarData from '../dialogNotes/NoteDialogToolbarData.js';
import OsmSearchContextMenu from '../contextMenus/OsmSearchContextMenu.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import ObjId from '../data/ObjId.js';

import { ZERO } from '../main/Constants.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class SearchResultContextMenuEL
@classdesc contextmenu event listener for search result
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class SearchResultContextMenuEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	*/

	handleEvent ( contextMenuEvent ) {
		contextMenuEvent.stopPropagation ( );
		contextMenuEvent.preventDefault ( );
		new OsmSearchContextMenu ( contextMenuEvent, this.paneDataDiv ).show ( );
	}

}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class SearchResultMouseEnterEL
@classdesc mouseenter event listener for search result
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class SearchResultMouseEnterEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
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

/**
@------------------------------------------------------------------------------------------------------------------------------

@class SearchResultMouseLeaveEL
@classdesc mouseenter event listener for search result
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class SearchResultMouseLeaveEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	*/

	handleEvent ( mouseEvent ) {
		mouseEvent.stopPropagation ( );
		theEventDispatcher.dispatch ( 'removeobject', { objId : Number.parseInt ( mouseEvent.target.dataset.tanObjId ) } );
	}

}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class OsmSearchDataUI
@classdesc This class add or remove the search data on the pane data
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class OsmSearchDataUI {

	/**
	A reference to the HTMLElement in witch the data have to be added
	@type {HTMLElement}
	@private
	*/

	#paneData = null;

	/**
	Temp reference to the OsmElement for witch the HTMLElement is currently build
	@type {Object}
	@private
	*/

	#currentOsmElement = null;

	/**
	Temp var to store the currently builded HTMLElement
	@type {HTMLElement}
	@private
	*/

	#currentContainer = null;

	/**
	Temp var to store the currently builded HTMLElement
	@type {HTMLElement}
	@private
	*/

	#currentSearchResultCell = null;

	/**
	The index of the currently OsmElement in the theTravelNotesData.searchData array
	*/

	#elementIndex = ZERO;

	/**
	Search result contextmenu event listener
	@type {SearchResultContextMenuEL}
	@private
	*/

	#searchResultContextMenuEL = null;

	/**
	Search result  mouseenter event listener
	@type {SearchResultMouseEnterEL}
	@private
	*/

	#searchResultMouseEnterEL = null;

	/**
	Search result contextmenu event listener
	@type {SearchResultMouseLeaveEL}
	@private
	*/

	#searchResultMouseLeaveEL	 = null;

	/**
	Icon builder
	@private
	*/

	#buildIcon ( ) {
		let iconContent = '';
		if ( this.#currentOsmElement.tags.rcn_ref ) {
			iconContent =
				'<div class=\'TravelNotes-MapNote TravelNotes-MapNoteCategory-0073\'>' +
				'<svg viewBox=\'0 0 20 20\'><text class=\'\' x=10 y=14>' +
				this.#currentOsmElement.tags.rcn_ref +
				'</text></svg></div>';
		}
		else {
			iconContent = theNoteDialogToolbarData.getIconContentFromName ( this.#currentOsmElement.description ) || '';
		}
		const iconCell = theHTMLElementsFactory.create (
			'div',
			{
				className :	'TravelNotes-OsmSearchPaneUI-SearchResult-IconCell'
			},
			this.#currentContainer
		);
		theHTMLSanitizer.sanitizeToHtmlElement ( iconContent, iconCell );
	}

	/**
	generic builder
	@private
	*/

	#addOsmTag ( osmTagValue ) {
		if ( osmTagValue ) {
			theHTMLElementsFactory.create ( 'div', { textContent : osmTagValue }, this.#currentSearchResultCell	);
		}
	}

	/**
	Address builder
	@private
	*/

	#addAddress ( ) {
		const street =
			this.#currentOsmElement.tags [ 'addr:street' ]
				?
				(
					this.#currentOsmElement.tags [ 'addr:housenumber' ]
						?
						this.#currentOsmElement.tags [ 'addr:housenumber' ] + ' '
						:
						''
				) +
				this.#currentOsmElement.tags [ 'addr:street' ] + ' '
				:
				'';
		const city =
			this.#currentOsmElement.tags [ 'addr:city' ]
				?
				(
					this.#currentOsmElement.tags [ 'addr:postcode' ]
						?
						( this.#currentOsmElement.tags [ 'addr:postcode' ] + ' ' )
						:
						''
				) +
				this.#currentOsmElement.tags [ 'addr:city' ]
				:
				'';
		const address = street + city;
		if ( '' !== address ) {
			this.#addOsmTag ( address, this.#currentSearchResultCell );
		}
	}

	/**
	Phone builder
	@private
	*/

	#addPhone ( ) {
		if ( this.#currentOsmElement.tags.phone ) {
			this.#addOsmTag ( '☎️ : ' + this.#currentOsmElement.tags.phone, this.#currentSearchResultCell );
		}
	}

	/**
	Mail builder
	@private
	*/

	#addMail ( ) {
		if ( this.#currentOsmElement.tags.email ) {
			theHTMLElementsFactory.create (
				'a',
				{
					href : 'mailto:' + this.#currentOsmElement.tags.email,
					textContent : this.#currentOsmElement.tags.email
				},
				theHTMLElementsFactory.create ( 'div', { textContent : '📧 : ' }, this.#currentSearchResultCell )
			);
		}
	}

	/**
	Web site builder
	@private
	*/

	#addWebSite ( ) {
		if ( this.#currentOsmElement.tags.website ) {
			theHTMLElementsFactory.create (
				'a',
				{
					href : this.#currentOsmElement.tags.website,
					target : '_blank',
					textContent : this.#currentOsmElement.tags.website
				},
				theHTMLElementsFactory.create ( 'div', null, this.#currentSearchResultCell )
			);
		}
	}

	/**
	Add all osm data
	@private
	*/

	#addOsmData ( ) {
		this.#currentSearchResultCell = theHTMLElementsFactory.create (
			'div',
			{ className :	'TravelNotes-OsmSearchPaneUI-SearchResult-Cell'	},
			this.#currentContainer
		);

		this.#addOsmTag ( this.#currentOsmElement.description );
		this.#addOsmTag ( this.#currentOsmElement.tags.name );
		this.#addOsmTag ( this.#currentOsmElement.tags.rcn_ref );
		this.#addAddress ( );
		this.#addPhone ( );
		this.#addMail ( );
		this.#addWebSite ( );

	}

	/**
	Title builder
	@private
	*/

	#addTitle ( ) {
		for ( const [ KEY, VALUE ] of Object.entries ( this.#currentOsmElement.tags ) ) {
			this.#currentContainer.title += KEY + '=' + VALUE + '\n';
		}

	}

	/**
	Add event listeners
	@private
	*/

	#addEventListeners ( ) {
		this.#currentContainer.addEventListener ( 'contextmenu', this.#searchResultContextMenuEL, false );
		this.#currentContainer.addEventListener ( 'mouseenter', this.#searchResultMouseEnterEL, false );
		this.#currentContainer.addEventListener ( 'mouseleave', this.#searchResultMouseLeaveEL, false );
	}

	/**
	Element builder
	@private
	*/

	#buildHtmlElement ( parentNode ) {
		this.#currentContainer = theHTMLElementsFactory.create (
			'div',
			{
				className :	'TravelNotes-OsmSearchPaneUI-SearchResult-Row',
				dataset : { ObjId : ObjId.nextObjId, ElementIndex : this.#elementIndex ++ }
			},
			parentNode
		);
		this.#buildIcon ( );
		this.#addOsmData ( );
		this.#addTitle ( );
		this.#addEventListeners ( );
	}

	/*
	constructor
	@param {HTMLElement} paneData The HTMLElement in witch the data have to be added
	*/

	constructor ( paneData ) {
		this.#paneData = paneData;
		this.#searchResultContextMenuEL = new SearchResultContextMenuEL ( );
		this.#searchResultMouseEnterEL = new SearchResultMouseEnterEL ( );
		this.#searchResultMouseLeaveEL = new SearchResultMouseLeaveEL ( );
	}

	/**
	Add data to the pane data
	*/

	addData ( ) {
		this.#currentOsmElement = null;
		this.#currentContainer = null;
		this.#currentSearchResultCell = null;
		this.#elementIndex = ZERO;
		theTravelNotesData.searchData.forEach (
			osmElement => {
				this.#currentOsmElement = osmElement;
				this.#buildHtmlElement ( this.#paneData );
			}
		);
	}

	/**
	Remove data from the pane data
	*/

	clearData ( ) {
		while ( this.#paneData.firstChild ) {
			this.#paneData.firstChild.removeEventListener ( 'contextmenu', this.#searchResultContextMenuEL, false );
			this.#paneData.firstChild.removeEventListener ( 'mouseenter', this.#searchResultMouseEnterEL, false );
			this.#paneData.firstChild.removeEventListener ( 'mouseleave', this.#searchResultMouseLeaveEL, false );
			theEventDispatcher.dispatch (
				'removeobject',
				{ objId : Number.parseInt ( this.#paneData.firstChild.dataset.tanObjId ) }
			);
			this.#paneData.removeChild ( this.#paneData.firstChild );
		}
	}
}

export default OsmSearchDataUI;

/*
--- End of OsmSearchDataUI.js file --------------------------------------------------------------------------------------------
*/