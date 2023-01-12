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

import theGeometry from '../../core/lib/Geometry.js';
import theTravelNotesData from '../../data/TravelNotesData.js';
import { ZERO, ONE } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouse event listener for the background
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BackgroundMouseEL {

	/**
	constant for the left button
	@type {Number}
	*/

	static get LEFT_BUTTON ( ) { return ZERO; }

	/**
	A flag set to true when a pan is ongoing
	@type {Boolean}
	*/

	#panOngoing = false;

	/**
	The X screen coordinate of the beginning of the pan
	@type {Number}
	*/

	#startPanX = ZERO;

	/**
	The Y screen coordinate of the beginning of the pan
	@type {Number}
	*/

	#startPanY = ZERO;

	/**
	A leaflet LatLng object with the center of the map
	@type {LeafletObject}
	*/

	#mapCenter;

	/**
	Execute the pan when a mousemove or mouseup event occurs after a mousedown event
	@param { Event } mouseEvent The mouse event to process
	*/

	#processPan ( mouseEvent ) {
		const latLngAtStart = theGeometry.screenCoordToLatLng ( this.#startPanX, this.#startPanY );
		const latLngAtEnd = theGeometry.screenCoordToLatLng ( mouseEvent.screenX, mouseEvent.screenY );
		theTravelNotesData.map.panTo (
			[
				this.#mapCenter.lat +
					latLngAtStart [ ZERO ] -
					latLngAtEnd [ ZERO ],
				this.#mapCenter.lng +
					latLngAtStart [ ONE ] -
					latLngAtEnd [ ONE ]
			]
		);
	}

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
		switch ( mouseEvent.type ) {
		case 'mousedown' :
			if (
				mouseEvent.button === BackgroundMouseEL.LEFT_BUTTON
				&&
				mouseEvent.target === mouseEvent.currentTarget
			) {
				this.#startPanX = mouseEvent.screenX;
				this.#startPanY = mouseEvent.screenY;
				this.#mapCenter = theTravelNotesData.map.getCenter ( );
				this.#panOngoing = true;
			}
			break;
		case 'mousemove' :
			if ( mouseEvent.button === BackgroundMouseEL.LEFT_BUTTON && this.#panOngoing ) {
				if ( document.selection ) {
					document.selection.empty ();
				}
				else {
					window.getSelection ().removeAllRanges ();
				}
				this.#processPan ( mouseEvent );
			}
			break;
		case 'mouseup' :
			if (
				mouseEvent.button === BackgroundMouseEL.LEFT_BUTTON
				&&
				this.#panOngoing
				&&
				( this.#startPanX !== mouseEvent.screenX || this.#startPanY !== mouseEvent.screenY )
			) {
				this.#processPan ( mouseEvent );
			}
			this.#panOngoing = false;
			break;
		default :
			break;
		}
	}
}

export default BackgroundMouseEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */