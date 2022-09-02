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

import theHTMLElementsFactory from '../../../core/uiLib/HTMLElementsFactory.js';
import theHTMLSanitizer from '../../../core/htmlSanitizer/HTMLSanitizer.js';
import theNoteDialogToolbarData from '../../notesDialog/toolbar/NoteDialogToolbarData.js';
import ObjId from '../../../data/ObjId.js';
import { ZERO } from '../../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
HTML builder for the search results
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmSearchResultsHTMLBuilder {

	/**
	The currently build search result HTMLElement
	@type {HTMLElement}
	*/

	#searchResultsHTMLElement;

	/**
	Reference to the OsmElement for witch the HTMLElement is currently build
	@type {OsmElement}
	*/

	#osmElement;

	/**
	An HTMLElement included in the search result HTMLElement with the text data
	@type {HTMLElement}
	*/

	#searchResultCellHTMLElement;

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
		if ( this.#osmElement.tags.rcn_ref ) {
			iconContent =
				'<div class=\'TravelNotes-MapNote TravelNotes-MapNoteCategory-0073\'>' +
				'<svg viewBox=\'0 0 20 20\'><text class=\'\' x=10 y=14>' +
				this.#osmElement.tags.rcn_ref +
				'</text></svg></div>';
		}
		else {
			iconContent = theNoteDialogToolbarData.preDefinedIconDataFromName ( this.#osmElement.description ) || '';
		}
		const iconCell = theHTMLElementsFactory.create (
			'div',
			{
				className :	'TravelNotes-OsmSearchDialog-SearchResult-IconCell'
			},
			this.#searchResultsHTMLElement
		);
		theHTMLSanitizer.sanitizeToHtmlElement ( iconContent, iconCell );
	}

	/**
	generic builder
	@param {String} osmTagValue The value of the OSM tag
	*/

	#addOsmTag ( osmTagValue ) {
		if ( osmTagValue ) {
			theHTMLElementsFactory.create ( 'div', { textContent : osmTagValue }, this.#searchResultCellHTMLElement	);
		}
	}

	/**
	Address builder
	*/

	#addAddress ( ) {
		const street =
			this.#osmElement.tags [ 'addr:street' ]
				?
				(
					this.#osmElement.tags [ 'addr:housenumber' ]
						?
						this.#osmElement.tags [ 'addr:housenumber' ] + ' '
						:
						''
				) +
				this.#osmElement.tags [ 'addr:street' ] + ' '
				:
				'';
		const city =
			this.#osmElement.tags [ 'addr:city' ]
				?
				(
					this.#osmElement.tags [ 'addr:postcode' ]
						?
						( this.#osmElement.tags [ 'addr:postcode' ] + ' ' )
						:
						''
				) +
				this.#osmElement.tags [ 'addr:city' ]
				:
				'';
		const address = street + city;
		if ( '' !== address ) {
			this.#addOsmTag ( address );
		}
	}

	/**
	Phone builder
	*/

	#addPhone ( ) {
		if ( this.#osmElement.tags.phone ) {
			this.#addOsmTag ( '☎️ : ' + this.#osmElement.tags.phone, this.#searchResultCellHTMLElement );
		}
	}

	/**
	Mail builder
	*/

	#addMail ( ) {
		if ( this.#osmElement.tags.email ) {
			theHTMLElementsFactory.create (
				'a',
				{
					href : 'mailto:' + this.#osmElement.tags.email,
					textContent : this.#osmElement.tags.email
				},
				theHTMLElementsFactory.create ( 'div', { textContent : '📧 : ' }, this.#searchResultCellHTMLElement )
			);
		}
	}

	/**
	Web site builder
	*/

	#addWebSite ( ) {
		if ( this.#osmElement.tags.website ) {
			theHTMLElementsFactory.create (
				'a',
				{
					href : this.#osmElement.tags.website,
					target : '_blank',
					textContent :
						this.#osmElement.tags.website.length > OsmSearchResultsHTMLBuilder.#LINKS_MAX_LENGTH
							?
							this.#osmElement.tags.website.substring (
								ZERO,
								OsmSearchResultsHTMLBuilder.#LINKS_MAX_LENGTH
							) + '...'
							:
							this.#osmElement.tags.website
				},
				theHTMLElementsFactory.create ( 'div', null, this.#searchResultCellHTMLElement )
			);
		}
	}

	/**
	Add all osm data
	*/

	#addOsmData ( ) {
		this.#searchResultCellHTMLElement = theHTMLElementsFactory.create (
			'div',
			{ className :	'TravelNotes-OsmSearchDialog-SearchResult-Cell'	},
			this.#searchResultsHTMLElement
		);
		this.#addOsmTag ( this.#osmElement.description );
		this.#addOsmTag ( this.#osmElement.tags.name );
		this.#addOsmTag ( this.#osmElement.tags.rcn_ref );
		this.#addAddress ( );
		this.#addPhone ( );
		this.#addMail ( );
		this.#addWebSite ( );
	}

	/**
	Title builder
	*/

	#addTitle ( ) {
		for ( const [ KEY, VALUE ] of Object.entries ( this.#osmElement.tags ) ) {
			this.#searchResultsHTMLElement.title += KEY + '=' + VALUE + '\n';
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Build a search result htmlElement from the data in an osmElement
	@param {OsmElement} osmElement the osmelement with to needed data
	@param {Number} index The position of the osmElement in the array of osmElements
	*/

	buildHTMLElement ( osmElement, index ) {
		this.#osmElement = osmElement;
		this.#searchResultsHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className :	'TravelNotes-OsmSearchDialog-SearchResultHTMLElement',
				dataset : { ObjId : ObjId.nextObjId, ElementIndex : index }
			}
		);
		this.#buildIcon ( );
		this.#addOsmData ( );
		this.#addTitle ( );
		return this.#searchResultsHTMLElement;
	}
}

export default OsmSearchResultsHTMLBuilder;