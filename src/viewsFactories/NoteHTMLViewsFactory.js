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
	- v3.2.0:
		- Issue ♯9 : String.substr ( ) is deprecated... Replace...
	- v3.4.0:
		- Issue ♯21 : When CSP is enabled, it's needed to set width and height for icons with JS to avoid
		to add an 'unsafe-inline' for style in CSP
	- v3.4.0:
		- Issue ♯22 : Nice to have a table view for notes in the roadbook
Doc reviewed 20210915
Tests ...
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import theTranslator from '../UILib/Translator.js';
import theUtilities from '../UILib/Utilities.js';
import theConfig from '../data/Config.js';
import theTravelNotesData from '../data/TravelNotesData.js';

import { ICON_DIMENSIONS, ZERO, ONE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class creates HTMLElements for notes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteHTMLViewsFactory {

	/**
	The max length for displayed links
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #LINKS_MAX_LENGTH ( ) { return 40; }

	/**
	// The minimal distance between note to display the 'Next note after' value
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MIN_NOTES_DISTANCE ( ) { return 40; }

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Gives an HTMLElement with the note icon and sames values than the this.getNoteTextHTML method
	@param {String} classPrefix A string that will be added to all the className of the created HTMLElement
	@param {NoteAndRoute} noteAndRoute A NoteAndRoute object with the note and the route to witch the note is attached
	@return {HTMLElement} An HTMLElement with the icon and texts for a Note
	*/

	getNoteTextAndIconHTML ( classPrefix, noteAndRoute ) {
		const NoteTextAndIconHTML = theHTMLElementsFactory.create (
			'div',
			{
				dataset : { ObjId : noteAndRoute.note.objId }
			}
		);
		const iconHTML = theHTMLElementsFactory.create (
			'div',
			{
				className : classPrefix + ( noteAndRoute.route ? 'Route-ManeuversAndNotes-IconCell' : 'Travel-Notes-IconCell' )
			},
			NoteTextAndIconHTML
		);
		let dimCoeficient = ONE;
		theHTMLSanitizer.sanitizeToHtmlElement ( noteAndRoute.note.iconContent, iconHTML );
		if ( 'TravelNotes-Roadbook-' === classPrefix && iconHTML.firstChild ) {
			if ( 'svg' === iconHTML.firstChild.tagName ) {
				iconHTML.firstChild.setAttributeNS (
					null,
					'viewBox',
					'0 0 ' + ICON_DIMENSIONS.svgViewboxDim + ' ' + ICON_DIMENSIONS.svgViewboxDim
				);
				dimCoeficient = theConfig.note.svgIcon.roadbookFactor;
			}
			else if ( iconHTML?.firstChild?.classList?.contains ( 'TravelNotes-MapNoteCategory-0073' ) ) {
				dimCoeficient = theConfig.note.svgIcon.roadbookFactor;
			}
		}

		// when CSP is enabled, it's needed to set width and height with JS to avoid to add an 'unsafe-inline' for style in CSP
		// Adding tanWidth and tanHeight for the roadbook
		iconHTML.dataset.tanWidth = String ( noteAndRoute.note.iconWidth * dimCoeficient ) + 'px';
		iconHTML.dataset.tanHeight = String ( noteAndRoute.note.iconHeight * dimCoeficient ) + 'px';

		// and style.width and heigth for the icon preview
		iconHTML.style.width = String ( noteAndRoute.note.iconWidth * dimCoeficient ) + 'px';
		iconHTML.style.height = String ( noteAndRoute.note.iconHeight * dimCoeficient ) + 'px';

		const noteTextHTMLElement = this.getNoteTextHTML ( classPrefix, noteAndRoute );
		noteTextHTMLElement.className =
			classPrefix +
			( noteAndRoute.route ? 'Route-ManeuversAndNotes-Cell' : 'Travel-Notes-Cell' );
		NoteTextAndIconHTML.appendChild ( noteTextHTMLElement );

		return NoteTextAndIconHTML;
	}

	/**
	Gives an HTMLElement with the tooltipContent (if any), popupContent (if any) address (if any), phone (if any),
	url (if any), latitude, longitude, distance since the start of the travel (if the note is attached to a chained node),
	distance since the start of the route (if the note is a route note) and distance till the next note(if the note
	is a route note)
	@param {String} classPrefix A string that will be added to all the className of the created HTMLElements
	@param {NoteAndRoute} noteAndRoute A NoteAndRoute object with the note and the route to witch the note is attached
	@return {HTMLElement} an HTMLElement
	*/

	getNoteTextHTML ( classPrefix, noteAndRoute ) {
		const note = noteAndRoute.note;
		const noteHTMLElement = theHTMLElementsFactory.create ( 'div' );
		if ( ZERO !== note.tooltipContent.length ) {
			theHTMLSanitizer.sanitizeToHtmlElement (
				note.tooltipContent,
				theHTMLElementsFactory.create (
					'div',
					{
						className : classPrefix + 'NoteHtml-TooltipContent'
					},
					noteHTMLElement
				)
			);
		}

		if ( ZERO !== note.popupContent.length ) {
			theHTMLSanitizer.sanitizeToHtmlElement (
				note.popupContent,
				theHTMLElementsFactory.create (
					'div',
					{
						className : classPrefix + 'NoteHtml-PopupContent'
					},
					noteHTMLElement
				)
			);
		}

		if ( ZERO !== note.address.length ) {
			theHTMLSanitizer.sanitizeToHtmlElement (
				'<span>' + theTranslator.getText ( 'NoteHTMLViewsFactory - Address' ) + '</span>' +
				'\u00a0:\u00a0' + note.address,
				theHTMLElementsFactory.create (
					'div',
					{
						className : classPrefix + 'NoteHtml-Address'
					},
					noteHTMLElement
				)
			);
		}

		if ( ZERO !== note.url.length ) {
			theHTMLSanitizer.sanitizeToHtmlElement (
				'<span>' + theTranslator.getText ( 'NoteHTMLViewsFactory - Link' ) +
					'</span><a href=' +
					note.url +
					' target="_blank" >' +
					note.url.substring ( ZERO, NoteHTMLViewsFactory.#LINKS_MAX_LENGTH ) +
					'...</a>',
				theHTMLElementsFactory.create ( 'div', { className : classPrefix + 'NoteHtml-Url' }, noteHTMLElement )
			);
		}

		if ( ZERO !== note.phone.length ) {
			let phoneText = note.phone;
			if ( note.phone.match ( /^\+[0-9, ,*,\u0023]*$/ ) ) {
				const phoneNumber = note.phone.replaceAll ( /\u0020/g, '' );
				const phoneNumberDisplay = note.phone.replaceAll ( /\u0020/g, '\u00a0' );
				phoneText =
					theTranslator.getText ( 'NoteHTMLViewsFactory - Phone' ) + '\u00a0:\u00a0' +
					theTranslator.getText ( 'NoteHTMLViewsFactory - call' ) +
					'<a target="_blank" href="tel:' + phoneNumber + '" >' + phoneNumberDisplay + '</a>' +
					theTranslator.getText ( 'NoteHTMLViewsFactory - Send a sms to' ) +
					'<a target="_blank" href="sms:' + phoneNumber + '" >' + phoneNumberDisplay + '</a>';
			}
			else {
				phoneText = theTranslator.getText ( 'NoteHTMLViewsFactory - Phone' ) + '\u00a0:\u00a0' + note.phone;
			}
			theHTMLSanitizer.sanitizeToHtmlElement (
				phoneText,
				theHTMLElementsFactory.create (
					'div',
					{
						className : classPrefix + 'NoteHtml-Phone'
					},
					noteHTMLElement
				)
			);
		}

		theHTMLSanitizer.sanitizeToHtmlElement (
			theUtilities.formatLatLng ( note.latLng ),
			theHTMLElementsFactory.create (
				'div',
				{
					className : classPrefix + 'NoteHtml-LatLng'
				},
				noteHTMLElement
			)
		);

		if ( noteAndRoute.route ) {
			if ( noteAndRoute.route.chain ) {
				theHTMLSanitizer.sanitizeToHtmlElement (
					'<span>' +
					theTranslator.getText ( 'NoteHTMLViewsFactory - Distance from start of travel' ) +
					'</span>\u00a0:\u00a0' +
					theUtilities.formatDistance ( note.chainedDistance + note.distance ),
					theHTMLElementsFactory.create (
						'div',
						{
							className : classPrefix + 'NoteHtml-TravelDistance'
						},
						noteHTMLElement
					)
				);
			}

			theHTMLSanitizer.sanitizeToHtmlElement (
				'<span>' +
				theTranslator.getText ( 'NoteHTMLViewsFactory - Distance from start of route' ) +
				'</span>\u00a0:\u00a0' +
				theUtilities.formatDistance ( note.distance ),
				theHTMLElementsFactory.create (
					'div',
					{
						className : classPrefix + 'NoteHtml-RouteDistance'
					},
					noteHTMLElement
				)
			);

			const nextNote = noteAndRoute.route.notes.next ( note.objId );
			if ( nextNote ) {
				const nextDistance = nextNote.distance - note.distance;
				if ( NoteHTMLViewsFactory.#MIN_NOTES_DISTANCE < nextDistance ) {
					theHTMLSanitizer.sanitizeToHtmlElement (
						'<span>' +
						theTranslator.getText ( 'NoteHTMLViewsFactory - Next note after' ) +
						'</span>\u00a0:\u00a0' +
						theUtilities.formatDistance ( nextDistance ),
						theHTMLElementsFactory.create (
							'div',
							{
								className : classPrefix + 'NoteHtml-NextDistance'
							},
							noteHTMLElement
						)
					);
				}
			}
		}
		return noteHTMLElement;
	}

	/**
	Gives an HTMLElement with all the travel notes
	@param {String} classPrefix A string that will be added to all the className of the created HTMLElements
	@return {HTMLElement} An HTMLElement with all the travel notes
	*/

	getTravelNotesHTML ( classPrefix ) {
		const travelNotesHTML = theHTMLElementsFactory.create ( 'div', { className : classPrefix + 'Travel-Notes' } );
		const travelNotesIterator = theTravelNotesData.travel.notes.iterator;
		while ( ! travelNotesIterator.done ) {
			const noteTextAndIconHTML = this.getNoteTextAndIconHTML (
				classPrefix,
				{ note : travelNotesIterator.value, route : null }
			);
			noteTextAndIconHTML.className = classPrefix + 'Travel-Notes-Row';
			travelNotesHTML.appendChild ( noteTextAndIconHTML );
		}
		return travelNotesHTML;
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of NoteHTMLViewsFactory  class
@type {NoteHTMLViewsFactory }
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theNoteHTMLViewsFactory = new NoteHTMLViewsFactory ( );

export default theNoteHTMLViewsFactory;

/* --- End of file --------------------------------------------------------------------------------------------------------- */