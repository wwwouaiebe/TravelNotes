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
Doc reviewed ...
Tests ...
*/

import theTravelNotesData from '../data/TravelNotesData.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import theNoteDialogToolbarData from '../notesDialog/NoteDialogToolbarData.js';
import ObjId from '../data/ObjId.js';

import { ZERO } from '../main/Constants.js';

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
	The max length for displayed links
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #LINKS_MAX_LENGTH ( ) { return 40; }

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
					textContent :
						this.#currentOsmElement.tags.website.length > OsmSearchResultsHTMLBuilder.#LINKS_MAX_LENGTH
							?
							this.#currentOsmElement.tags.website.substring (
								ZERO,
								OsmSearchResultsHTMLBuilder.#LINKS_MAX_LENGTH
							) + '...'
							:
							this.#currentOsmElement.tags.website
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
		this.#resultsHTMLElements.push ( this.#currentContainer );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
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