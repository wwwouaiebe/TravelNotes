/*
Copyright - 2020 - wwwouaiebe - Contact: http//www.ouaie.be/

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
	- v1.7.0:
		- created
	- v1.8.0:
		- Issue ♯99 : Add distance in the elevation window
	- v2.0.0:
		- Issue ♯135 : Remove innerHTML from code
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import theGeometry from '../coreLib/Geometry.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import theUtilities from '../UILib/Utilities.js';
import ProfileContextMenu from '../contextMenus/ProfileContextMenu.js';
import theDataSearchEngine from '../data/DataSearchEngine.js';
import SvgProfileBuilder from '../coreLib/SvgProfileBuilder.js';
import { SVG_NS, ZERO, ONE, TWO, THREE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class for Svg event listeners
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseSvgEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Get the lat, lng, elevation, ascent and distance from the route origin at the mouse position on the svg
	@param {Event} mouseEvent The triggered event
	@return {LatLngElevOnRoute} An object with the lat, lng, elevation, ascent and distance from the route origin
	at the mouse position on the svg
	*/

	getlatLngElevOnRouteAtMousePosition ( mouseEvent ) {
		const route = theDataSearchEngine.getRoute ( Number.parseInt ( mouseEvent.currentTarget.dataset.tanObjId ) );
		const clientRect = mouseEvent.currentTarget.getBoundingClientRect ( );
		const routeDist =
			(
				( mouseEvent.clientX - clientRect.x -
					(
						( SvgProfileBuilder.PROFILE_MARGIN /
							( ( TWO * SvgProfileBuilder.PROFILE_MARGIN ) + SvgProfileBuilder.PROFILE_WIDTH )
						) * clientRect.width )
				) /
				(
					( SvgProfileBuilder.PROFILE_WIDTH /
						( ( TWO * SvgProfileBuilder.PROFILE_MARGIN ) + SvgProfileBuilder.PROFILE_WIDTH )
					) * clientRect.width )
			) * route.distance;
		if ( ZERO < routeDist && routeDist < route.distance ) {
			return theGeometry.getLatLngElevAtDist ( route, routeDist );
		}

		return null;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
contextmenu event listener for svg profile
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SvgContextMenuEL extends BaseSvgEL {

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
	}

	/**
	Event listener method
	@param {Event} mouseEvent The event to handle
	*/

	handleEvent ( mouseEvent ) {
		mouseEvent.preventDefault ( );
		mouseEvent.stopPropagation ( );

		const latLngElevOnRoute = this.getlatLngElevOnRouteAtMousePosition ( mouseEvent );
		if ( latLngElevOnRoute ) {
			mouseEvent.latlng = {
				lat : latLngElevOnRoute.latLng [ ZERO ],
				lng : latLngElevOnRoute.latLng [ ONE ]
			};
			new ProfileContextMenu ( mouseEvent ).show ( );
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouseleave event listener for svg profile
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SvgMouseLeaveEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} mouseLeaveEvent The event to handle
	*/

	handleEvent ( mouseLeaveEvent ) {
		mouseLeaveEvent.preventDefault ( );
		mouseLeaveEvent.stopPropagation ( );
		theEventDispatcher.dispatch (
			'removeobject',
			{ objId : Number.parseInt ( mouseLeaveEvent.currentTarget.dataset.tanMarkerObjId ) }
		);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mousemove event listener for svg profile
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SvgMouseMoveEL extends BaseSvgEL {

	/**
	The vertical svg polyline at the mouse position
	@type {SVGElement}
	*/

	#marker;

	/**
	The svg text with the distance since the beginning of the route at the mouse position
	@type {SVGElement}
	*/

	#distanceText;

	/**
	The svg text with the elevation at the mouse position
	@type {SVGElement}
	*/

	#elevText;

	/**
	The svg text with the ascent of the route at the mouse position
	@type {SVGElement}
	*/

	#ascentText;

	/**
	A string indicating where is the text anchor. Must be 'end' or 'start'
	@type {String}
	*/

	#textAnchor;

	/**
	The horizontal position of the marker on the svg
	@type {Number}
	*/

	#markerX;

	/**
	The svgElement with the profile
	@type {SVGElement}
	*/

	#profileSvg;

	/**
	A method to create a svg:text.
	@param {String} text The text to add in the svg:text
	@param {Number} markerY The vertical position of the text on the svg
	@return {SVGElement} The svg:text element
	*/

	#createSvgText ( text, markerY ) {
		const svgText = document.createElementNS ( SVG_NS, 'text' );
		svgText.appendChild ( document.createTextNode ( text ) );
		svgText.setAttributeNS ( null, 'class', 'TravelNotes-Route-SvgProfile-elevText' );
		svgText.setAttributeNS ( null, 'x', this.#markerX );
		svgText.setAttributeNS ( null, 'y', markerY );
		svgText.setAttributeNS ( null, 'text-anchor', this.#textAnchor );
		this.#profileSvg.appendChild ( svgText );

		return svgText;
	}

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
	}

	/**
	Event listener method
	@param {Event} mouseEvent The event to handle
	*/

	handleEvent ( mouseEvent ) {

		mouseEvent.preventDefault ( );
		mouseEvent.stopPropagation ( );

		this.#profileSvg = mouseEvent.currentTarget;
		const latLngElevOnRoute = this.getlatLngElevOnRouteAtMousePosition ( mouseEvent );
		if ( latLngElevOnRoute ) {

			// itinerary point marker on the map
			const markerObjId = Number.parseInt ( this.#profileSvg.dataset.tanMarkerObjId );
			theEventDispatcher.dispatch ( 'removeobject', { objId : markerObjId } );
			theEventDispatcher.dispatch (
				'additinerarypointmarker',
				{
					objId : markerObjId,
					latLng : latLngElevOnRoute.latLng
				}
			);

			// Line and text on svg
			if ( this.#marker && this.#profileSvg.contains ( this.#marker ) ) {
				this.#profileSvg.removeChild ( this.#marker );
				this.#profileSvg.removeChild ( this.#distanceText );
				this.#profileSvg.removeChild ( this.#elevText );
				this.#profileSvg.removeChild ( this.#ascentText );
			}
			else {
				this.#marker = null;
				this.#distanceText = null;
				this.#elevText = null;
				this.#ascentText = null;
			}
			const clientRect = this.#profileSvg.getBoundingClientRect ( );
			this.#markerX =
				( ( TWO * SvgProfileBuilder.PROFILE_MARGIN ) + SvgProfileBuilder.PROFILE_WIDTH ) *
				( mouseEvent.clientX - clientRect.x ) / clientRect.width;
			const markerY = SvgProfileBuilder.PROFILE_MARGIN + SvgProfileBuilder.PROFILE_HEIGHT;

			// line
			this.#marker = document.createElementNS ( SVG_NS, 'polyline' );
			this.#marker.setAttributeNS (
				null,
				'points',
				String ( this.#markerX ) + ',' + SvgProfileBuilder.PROFILE_MARGIN + ' ' + this.#markerX + ',' + markerY
			);
			this.#marker.setAttributeNS ( null, 'class', 'TravelNotes-Route-SvgProfile-markerPolyline' );
			this.#profileSvg.appendChild ( this.#marker );

			// texts
			const route = theDataSearchEngine.getRoute ( Number.parseInt ( this.#profileSvg.dataset.tanObjId ) );
			this.#textAnchor = latLngElevOnRoute.distance > route.distance / TWO ? 'end' : 'start';
			this.#markerX +=
				latLngElevOnRoute.distance > route.distance / TWO
					?
					-SvgProfileBuilder.X_DELTA_TEXT
					:
					SvgProfileBuilder.X_DELTA_TEXT;

			// distance
			this.#distanceText = this.#createSvgText (
				theUtilities.formatDistance ( latLngElevOnRoute.distance ),
				SvgProfileBuilder.PROFILE_MARGIN + SvgProfileBuilder.Y_DELTA_TEXT
			);

			this.#elevText = this.#createSvgText (
				'Alt. ' + latLngElevOnRoute.elev.toFixed ( ZERO ) + ' m.',
				SvgProfileBuilder.PROFILE_MARGIN + ( SvgProfileBuilder.Y_DELTA_TEXT * TWO )
			);

			this.#ascentText = this.#createSvgText (
				'Pente ' + latLngElevOnRoute.ascent.toFixed ( ZERO ) + ' % ',
				SvgProfileBuilder.PROFILE_MARGIN + ( SvgProfileBuilder.Y_DELTA_TEXT * THREE )
			);
		}
	}
}

export {
	SvgContextMenuEL,
	SvgMouseLeaveEL,
	SvgMouseMoveEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */