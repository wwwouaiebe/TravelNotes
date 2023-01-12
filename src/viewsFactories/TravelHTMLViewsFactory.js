/*
Copyright - 2017 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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
		- created from v3.6.0
Doc reviewed 202208
 */

import theHTMLElementsFactory from '../core/uiLib/HTMLElementsFactory.js';
import theHTMLSanitizer from '../core/htmlSanitizer/HTMLSanitizer.js';
import theUtilities from '../core/uiLib/Utilities.js';
import theConfig from '../data/Config.js';
import theTranslator from '../core/uiLib/Translator.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theNoteHTMLViewsFactory from '../viewsFactories/NoteHTMLViewsFactory.js';
import theRouteHTMLViewsFactory from '../viewsFactories/RouteHTMLViewsFactory.js';
import { DISTANCE, ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class creates HTMLElements for travels
See theTravelHTMLViewsFactory for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelHTMLViewsFactory {

	/**
	Gives an HTMLElement with the travel name, distance, ascent (if any), descent (if any) and a list with all the routes
	of the travel
	@param {String} classPrefix A string that will be added to all the className of the created HTMLElements
	@return {HTMLElement} An HTMLElement with the travel header
	*/

	#getTravelHeaderHTML ( classPrefix ) {
		const travelHeaderHTML = theHTMLElementsFactory.create ( 'div', { className : classPrefix + 'Travel-Header' } );

		theHTMLSanitizer.sanitizeToHtmlElement (
			theTravelNotesData.travel.name,
			theHTMLElementsFactory.create (
				'div',
				{
					className : classPrefix + 'Travel-Header-Name'
				},
				travelHeaderHTML
			)
		);

		let travelDistance = DISTANCE.defaultValue;
		let travelAscent = ZERO;
		let travelDescent = ZERO;
		const routesIterator = theTravelNotesData.travel.routes.iterator;
		while ( ! routesIterator.done ) {
			const route =
				( routesIterator.value.objId === theTravelNotesData.editedRouteObjId
					&&
					theConfig.routeEditor.showEditedRouteInRoadbook
				)
					?
					theTravelNotesData.travel.editedRoute
					:
					routesIterator.value;

			theHTMLSanitizer.sanitizeToHtmlElement (
				'<a href="\u0023route' + route.objId + '" >' + route.computedName +
				'</a>\u00a0:\u00a0' + theUtilities.formatDistance ( route.distance ) + '.',
				theHTMLElementsFactory.create (
					'div',
					{
						className : classPrefix + 'Travel-Header-RouteName'
					},
					travelHeaderHTML
				)
			);

			if ( route.chain ) {
				travelDistance += route.distance;
				travelAscent += route.itinerary.ascent;
				travelDescent += route.itinerary.descent;
			}
		}

		theHTMLSanitizer.sanitizeToHtmlElement (
			'<span>' +
				theTranslator.getText ( 'TravelHTMLViewsFactory - Travel distance' ) +
				'</span>\u00A0:\u00A0' +
				theUtilities.formatDistance ( travelDistance ),
			theHTMLElementsFactory.create (
				'div',
				{
					className : classPrefix + 'Travel-Header-TravelDistance'
				},
				travelHeaderHTML
			)
		);

		if ( ZERO !== travelAscent ) {
			theHTMLSanitizer.sanitizeToHtmlElement (
				'<span>' +
					theTranslator.getText ( 'travelHTMLViewsFactory - Travel ascent' ) +
					'</span>\u00A0:\u00A0' +
					String ( travelAscent.toFixed ( ZERO ) ) +
					' m.',
				theHTMLElementsFactory.create (
					'div',
					{
						className : classPrefix + 'Travel-Header-TravelAscent'
					},
					travelHeaderHTML
				)
			);
		}

		if ( ZERO !== travelDescent ) {
			theHTMLSanitizer.sanitizeToHtmlElement (
				'<span>' +
					theTranslator.getText ( 'TravelHTMLViewsFactory - Travel descent' ) +
					'</span>\u00A0:\u00A0' +
					String ( travelDescent.toFixed ( ZERO ) ) +
					' m.',
				theHTMLElementsFactory.create (
					'div',
					{
						className : classPrefix + 'Travel-Header-TravelDescent'
					},
					travelHeaderHTML
				)
			);
		}
		return travelHeaderHTML;
	}

	/**
	Gives an HTMLElement with the Copyright notice and OSM attributions
	@param {String} classPrefix A string that will be added to all the className of the created HTMLElements
	@return {HTMLElement} An HTMLElement with the travel footer
	*/

	#getTravelFooterHTML ( classPrefix ) {
		const footerText =
			theTranslator.getText ( 'TravelHTMLViewsFactory - Travel footer' ) +
			'<a href="https://github.com/wwwouaiebe/TravelNotes"' +
			' target="_blank" title="https://github.com/wwwouaiebe/TravelNotes" >Travel & Notes</a>, © ' +
			'<a href="https://www.ouaie.be/"' +
			' target="_blank" title="https://www.ouaie.be/" >wwwouaiebe 2017 ' +
			new Date ( Date.now () ).getFullYear () +
			'</a> © ' +
			'<a href="https://www.openstreetmap.org/copyright"' +
			' target="_blank" title="https://www.openstreetmap.org/copyright">' +
			theTranslator.getText ( 'TravelHTMLViewsFactory - OpenStreetMap contributors' ) + '</a>';
		const footerHTML = theHTMLElementsFactory.create ( 'div', { className : classPrefix + 'TravelFooter' } );

		theHTMLSanitizer.sanitizeToHtmlElement ( footerText, footerHTML );

		return footerHTML;
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Gives an HTMLElement with the travel header, the travel notes, all the routes of the travel
	with route header, route notes, route maneuvers, route footer and travel footer
	@param {String} classPrefix A string that will be added to all the className of the created HTMLElements
	@return {HTMLElement} An HTMLElement with the complete travel
	*/

	getTravelHTML ( classPrefix ) {
		const travelHTML = theHTMLElementsFactory.create ( 'div', { className : classPrefix + 'Travel' } );

		travelHTML.appendChild ( this.#getTravelHeaderHTML ( classPrefix ) );
		travelHTML.appendChild ( theNoteHTMLViewsFactory.getTravelNotesHTML ( classPrefix ) );

		const travelRoutesIterator = theTravelNotesData.travel.routes.iterator;
		while ( ! travelRoutesIterator.done ) {
			const useEditedRoute =
				theConfig.routeEditor.showEditedRouteInRoadbook
				&&
				travelRoutesIterator.value.objId === theTravelNotesData.editedRouteObjId;
			const route = useEditedRoute ? theTravelNotesData.travel.editedRoute : travelRoutesIterator.value;
			travelHTML.appendChild ( theRouteHTMLViewsFactory.getRouteHeaderHTML ( classPrefix, route ) );
			if ( route.itinerary.hasProfile ) {
				travelHTML.appendChild ( theRouteHTMLViewsFactory.getRouteProfileHTML ( classPrefix, route ) );
			}
			travelHTML.appendChild ( theRouteHTMLViewsFactory.getRouteManeuversAndNotesHTML ( classPrefix, route, false ) );
			travelHTML.appendChild ( theRouteHTMLViewsFactory.getRouteFooterHTML ( classPrefix, route ) );
		}

		travelHTML.appendChild ( this.#getTravelFooterHTML ( classPrefix ) );

		return travelHTML;
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of TravelHTMLViewsFactory  class
@type {TravelHTMLViewsFactory }
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theTravelHTMLViewsFactory = new TravelHTMLViewsFactory ( );

export default theTravelHTMLViewsFactory;

/* --- End of file --------------------------------------------------------------------------------------------------------- */