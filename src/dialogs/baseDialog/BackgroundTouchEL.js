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
	- v4.0.0:
       - created from BaseDialogEventListeners.js
		- Issue ♯38 : Review mouse and touch events on the background div of dialogs
		- Issue #41 : Not possible to move a dialog on touch devices
Doc reviewed 20220828
Tests ...
*/

import theGeometry from '../../core/lib/Geometry.js';
import theConfig from '../../data/Config.js';
import theTravelNotesData from '../../data/TravelNotesData.js';
import { ZERO, ONE, TWO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touch event listener on the background
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BackgroundTouchEL {

	/**
	A reference to the dialog
	@type {BaseDialog}
	*/

	#baseDialog;

	/**
	A flag set to true when a pan is ongoing
	@type {Boolean}
	*/

	#panOngoing = false;

	/**
	A flag set to true when a zoom is ongoing
	@type {Boolean}
	*/

	#zoomOngoing = false;

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
	The zoom when the touchstart event is trigered
	@type {Number}
	*/

	#initialZoom;

	/**
	The distance in pixel betwwen the touches when the touchstart event is trigered
	@type {Number}
	*/

	#initialZoomDistance;

	/**
	the point on the screen around witch thz zoom is performed
	@type {LeafletObject}
	*/

	#aroundPoint;

	/**
	Execute the pan when a touchmove or toucheend event occurs after a touchestart event
	@param {Touch} touch The touch object to process
	*/

	#processPan ( touch ) {
		if (
			this.#panOngoing
			&&
			( this.#startPanX !== touch.screenX || this.#startPanY !== touch.screenY )
		) {
			if (
				theConfig.baseDialog.cancelTouchY > this.#startPanY
				&&
				touch.screenY < this.#startPanY
				&&
				theConfig.baseDialog.cancelTouchX > this.#startPanX ) {
				this.#baseDialog.onCancel ( );
			}
			const latLngAtStart = theGeometry.screenCoordToLatLng ( this.#startPanX, this.#startPanY );
			const latLngAtEnd = theGeometry.screenCoordToLatLng ( touch.screenX, touch.screenY );
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
	}

	/**
	Execute the zoom when a touchmove or toucheend event occurs after a touchestart event
	@param {TouchList} targetTouches The touch objects to process
	*/

	#processZoom ( targetTouches ) {
		let zoomDistance = Math.sqrt (
			( ( targetTouches.item ( ZERO ).clientX - targetTouches.item ( ONE ).clientX ) ** TWO )
			+
			( ( targetTouches.item ( ZERO ).clientY - targetTouches.item ( ONE ).clientY ) ** TWO )
		);
		let zoom = this.#initialZoom;
		let deltaZoom = zoomDistance - this.#initialZoomDistance;
		if ( theConfig.baseDialog.deltaZoomDistance < deltaZoom ) {
			zoom ++;
		}
		else if ( -theConfig.baseDialog.deltaZoomDistance > deltaZoom ) {
			zoom --;
		}

		zoom = Math.min ( theTravelNotesData.map.getMaxZoom ( ), zoom );
		zoom = Math.max ( theTravelNotesData.map.getMinZoom ( ), zoom );
		if ( zoom !== this.#initialZoom ) {
			theTravelNotesData.map.setZoomAround ( this.#aroundPoint, zoom );
			this.#initialZoom = zoom;
			this.#initialZoomDistance = zoomDistance;
		}
	}

	/**
	Handle the touchend event
	@param {Event} touchEvent The event to handle
	*/

	#handleEndEvent ( touchEvent ) {
		if ( this.#panOngoing && ONE === touchEvent.changedTouches.length ) {
			this.#processPan ( touchEvent.changedTouches.item ( ZERO ) );
			this.#panOngoing = false;
		}
	}

	/**
	Handle the touchmove event
	@param {Event} touchEvent The event to handle
	*/

	#handleMoveEvent ( touchEvent ) {
		if ( this.#panOngoing && ONE === touchEvent.changedTouches.length ) {
			this.#processPan ( touchEvent.changedTouches.item ( ZERO ) );
		}
		else if ( this.#zoomOngoing && TWO === touchEvent.targetTouches.length ) {
			this.#processZoom ( touchEvent.targetTouches );
		}
	}

	/**
	Handle the touchstart event
	@param {Event} touchEvent The event to handle
	*/

	#handleStartEvent ( touchEvent ) {
		if ( ONE === touchEvent.targetTouches.length ) {
			const touch = touchEvent.changedTouches.item ( ZERO );
			this.#startPanX = touch.screenX;
			this.#startPanY = touch.screenY;
			this.#mapCenter = theTravelNotesData.map.getCenter ( );
			this.#panOngoing = true;
			this.#zoomOngoing = false;
		}
		if ( TWO === touchEvent.targetTouches.length ) {
			this.#initialZoom = theTravelNotesData.map.getZoom ( );
			this.#aroundPoint = window.L.point (
				( touchEvent.targetTouches.item ( ZERO ).clientX + touchEvent.targetTouches.item ( ONE ).clientX ) / TWO,
				( touchEvent.targetTouches.item ( ZERO ).clientY + touchEvent.targetTouches.item ( ONE ).clientY ) / TWO
			);
			this.#initialZoomDistance = Math.sqrt (
				( ( touchEvent.targetTouches.item ( ZERO ).clientX - touchEvent.targetTouches.item ( ONE ).clientX ) ** TWO )
				+
				( ( touchEvent.targetTouches.item ( ZERO ).clientY - touchEvent.targetTouches.item ( ONE ).clientY ) ** TWO )
			);
			this.#panOngoing = false;
			this.#zoomOngoing = true;
		}
	}

	/**
	The constructor
	@param {BaseDialog} baseDialog A reference to the dialog
	*/

	constructor ( baseDialog ) {
		Object.freeze ( this );
		this.#baseDialog = baseDialog;
	}

	/**
	Event listener method
	@param {Event} touchEvent The event to handle
	*/

	handleEvent ( touchEvent ) {

		if ( touchEvent.currentTarget === touchEvent.target ) {
			touchEvent.preventDefault ( );
		}
		switch ( touchEvent.type ) {
		case 'touchstart' :
			if ( touchEvent.currentTarget === touchEvent.target ) {
				this.#handleStartEvent ( touchEvent );
			}
			break;
		case 'touchmove' :
			this.#handleMoveEvent ( touchEvent );
			break;
		case 'touchend' :
			this.#handleEndEvent ( touchEvent );
			break;
		default :
			break;
		}

	}
}

export default BackgroundTouchEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */