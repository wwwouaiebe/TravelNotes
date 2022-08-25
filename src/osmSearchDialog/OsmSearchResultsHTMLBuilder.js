import theTravelNotesData from '../data/TravelNotesData.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import theNoteDialogToolbarData from '../notesDialog/NoteDialogToolbarData.js';
import OsmSearchContextMenu from '../contextMenus/OsmSearchContextMenu.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import ObjId from '../data/ObjId.js';

import { ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
contextmenu event listener for search result
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SearchResultContextMenuEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} contextMenuEvent The event to handle
	*/

	handleEvent ( contextMenuEvent ) {
		contextMenuEvent.stopPropagation ( );
		contextMenuEvent.preventDefault ( );
		new OsmSearchContextMenu ( contextMenuEvent, this.paneDataDiv ).show ( );
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouseenter event listener for search result
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SearchResultMouseEnterEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} mouseEvent The event to handle
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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouseenter event listener for search result
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SearchResultMouseLeaveEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} mouseEvent The event to handle
	*/

	handleEvent ( mouseEvent ) {
		mouseEvent.stopPropagation ( );
		theEventDispatcher.dispatch ( 'removeobject', { objId : Number.parseInt ( mouseEvent.target.dataset.tanObjId ) } );
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
HTML builder for the search results
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmSearchResultsHTMLBuilder {

	/**
	An array to store the alredy build HTMLElements
	@type {Array.<HTMLElement>}
	*/

	#resultsHTMLElements;

	/**
	Temp reference to the OsmElement for witch the HTMLElement is currently build
	@type {OsmElement}
	*/

	#currentOsmElement;

	/**
	Temp var to store the currently builded HTMLElement
	@type {HTMLElement}
	*/

	#currentContainer;

	/**
	The index of the current OsmElement in the theTravelNotesData.searchData array
	@type {Number}
	*/

	#elementIndex;

	/**
	Temp var to store the currently builded HTMLElement
	@type {HTMLElement}
	*/

	#currentSearchResultCell;

	/**
	Search result contextmenu event listener
	@type {SearchResultContextMenuEL}
	*/

	#searchResultContextMenuEL;

	/**
	Search result  mouseenter event listener
	@type {SearchResultMouseEnterEL}
	*/

	#searchResultMouseEnterEL;

	/**
	Search result contextmenu event listener
	@type {SearchResultMouseLeaveEL}
	*/

	#searchResultMouseLeaveEL;

	/**
	Icon builder
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
			iconContent = theNoteDialogToolbarData.preDefinedIconDataFromName ( this.#currentOsmElement.description ) || '';
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
	@param {String} osmTagValue The value of the OSM tag
	*/

	#addOsmTag ( osmTagValue ) {
		if ( osmTagValue ) {
			theHTMLElementsFactory.create ( 'div', { textContent : osmTagValue }, this.#currentSearchResultCell	);
		}
	}

	/**
	Address builder
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
	*/

	#addPhone ( ) {
		if ( this.#currentOsmElement.tags.phone ) {
			this.#addOsmTag ( '☎️ : ' + this.#currentOsmElement.tags.phone, this.#currentSearchResultCell );
		}
	}

	/**
	Mail builder
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
	*/

	#addTitle ( ) {
		for ( const [ KEY, VALUE ] of Object.entries ( this.#currentOsmElement.tags ) ) {
			this.#currentContainer.title += KEY + '=' + VALUE + '\n';
		}

	}

	/**
	Add event listeners
	*/

	#addEventListeners ( ) {

		// this.#currentContainer.addEventListener ( 'contextmenu', this.#searchResultContextMenuEL, false );
		this.#currentContainer.addEventListener ( 'mouseenter', this.#searchResultMouseEnterEL, false );
		this.#currentContainer.addEventListener ( 'mouseleave', this.#searchResultMouseLeaveEL, false );
	}

	/**
	Build the html for current osm element
	*/

	#buildHtmlElement ( ) {
		this.#currentContainer = theHTMLElementsFactory.create (
			'div',
			{
				className :	'TravelNotes-OsmSearchPaneUI-SearchResult-Row',
				dataset : { ObjId : ObjId.nextObjId, ElementIndex : this.#elementIndex ++ }
			}
		);

		this.#buildIcon ( );
		this.#addOsmData ( );
		this.#addTitle ( );
		this.#addEventListeners ( );
		this.#resultsHTMLElements.push ( this.#currentContainer );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#resultsHTMLElements = [];
		this.#searchResultContextMenuEL = new SearchResultContextMenuEL ( );
		this.#searchResultMouseEnterEL = new SearchResultMouseEnterEL ( );
		this.#searchResultMouseLeaveEL = new SearchResultMouseLeaveEL ( );
	}

	/**
	Get an array with the HTMLElements created from the osm elements
	@type {Array.<HTMLElement>}
	*/

	get resultsHTMLElements ( ) {
		this.#resultsHTMLElements = [];
		this.#currentOsmElement = null;
		this.#currentContainer = null;
		this.#currentSearchResultCell = null;
		this.#elementIndex = ZERO;

		// loop on osm elements
		theTravelNotesData.searchData.forEach (
			osmElement => {
				this.#currentOsmElement = osmElement;
				this.#buildHtmlElement ( );
			}
		);

		return this.#resultsHTMLElements;
	}

}

export default OsmSearchResultsHTMLBuilder;