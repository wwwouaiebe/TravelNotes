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
	- v3.7.0:
		- Issue ♯38 : Review mouse and touch events on the background div of dialogs
Doc reviewed 20210914
Tests ...
*/

import theGeometry from '../coreLib/Geometry.js';
import theConfig from '../data/Config.js';
import theTravelNotesData from '../data/TravelNotesData.js';

import { ZERO, ONE, TWO, DIALOG_DRAG_MARGIN } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the ok button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OkButtonClickEL {

	/**
	A reference to the dialog
	@type {BaseDialog}
	*/

	#baseDialog;

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
	*/

	handleEvent ( ) {
		this.#baseDialog.onOk ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the cancel button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class CancelDialogButtonClickEL {

	/**
	A reference to the dialog
	@type {BaseDialog}
	*/

	#baseDialog;

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
	*/

	handleEvent ( ) {
		this.#baseDialog.onCancel ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragstart event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarDragStartEL {

	/**
	A reference to the dragData object of the dialog
	@type {DragData}
	*/

	#dragData;

	/**
	The constructor
	@param {DragData} dragData A reference to the dragData object of the dialog
	*/

	constructor ( dragData ) {
		Object.freeze ( this );
		this.#dragData = dragData;
	}

	/**
	Event listener method
	@param {Event} dragStartEvent The event to handle
	*/

	handleEvent ( dragStartEvent ) {
		this.#dragData.dragStartX = dragStartEvent.screenX;
		this.#dragData.dragStartY = dragStartEvent.screenY;
		dragStartEvent.dataTransfer.dropEffect = 'move';
		dragStartEvent.dataTransfer.effectAllowed = 'move';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragend event event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarDragEndEL {

	/**
	A reference to the dragData object of the dialog
	@type {DragData}
	*/

	#dragData;

	/**
	A reference to the dialog container
	@type {HTMLElement}
	*/

	#container;

	/**
	A reference to the background of the dialog
	@type {HTMLElement}
	*/

	#background;

	/**
	The constructor
	@param {DragData} dragData A reference to the dragData object of the dialog
	@param {HTMLElement} container A reference to the dialog container
	@param {HTMLElement} background A reference to the background of the dialog
	*/

	constructor ( dragData, container, background ) {
		Object.freeze ( this );
		this.#dragData = dragData;
		this.#container = container;
		this.#background = background;
	}

	/**
	Event listener method
	@param {Event} dragEndEvent The event to handle
	*/

	handleEvent ( dragEndEvent ) {
		this.#dragData.dialogX += dragEndEvent.screenX - this.#dragData.dragStartX;
		this.#dragData.dialogX =
			Math.min (
				Math.max ( this.#dragData.dialogX, DIALOG_DRAG_MARGIN ),
				this.#background.clientWidth -
					this.#container.clientWidth -
					DIALOG_DRAG_MARGIN
			);

		this.#dragData.dialogY += dragEndEvent.screenY - this.#dragData.dragStartY;
		this.#dragData.dialogY =
			Math.max ( this.#dragData.dialogY, DIALOG_DRAG_MARGIN );

		const dialogMaxHeight =
			this.#background.clientHeight -
			Math.max ( this.#dragData.dialogY, ZERO ) -
			DIALOG_DRAG_MARGIN;

		this.#container.style.left = String ( this.#dragData.dialogX ) + 'px';
		this.#container.style.top = String ( this.#dragData.dialogY ) + 'px';
		this.#container.style [ 'max-height' ] = String ( dialogMaxHeight ) + 'px';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
BaseDialog drag over event listener based on the EventListener API.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BackgroundDragOverEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} dragEvent The event to handle
	*/

	handleEvent ( dragEvent ) {
		dragEvent.preventDefault ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
keydown event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DialogKeyboardKeydownEL {

	/**
	A reference to the dialog
	@type {BaseDialog}
	*/

	#baseDialog;

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
	@param {Event} keyDownEvent The event to handle
	*/

	handleEvent ( keyDownEvent ) {

		if ( ! this.#baseDialog.keyboardELEnabled ) {
			return;
		}

		if ( 'Escape' === keyDownEvent.key || 'Esc' === keyDownEvent.key ) {
			this.#baseDialog.onCancel ( );
		}
		else if ( 'Enter' === keyDownEvent.key ) {
			this.#baseDialog.onOk ( );
		}

	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
wheel event listener for the background. Zoom on the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BackgroundWheelEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} wheelEvent The event to handle
	*/

	handleEvent ( wheelEvent ) {
		if ( ! wheelEvent.target.classList.contains ( 'TravelNotes-Background' ) ) {
			return;
		}

		let zoom = theTravelNotesData.map.getZoom ( ) + ( ZERO > wheelEvent.deltaY ? ONE : -ONE );
		zoom = Math.min ( theTravelNotesData.map.getMaxZoom ( ), zoom );
		zoom = Math.max ( theTravelNotesData.map.getMinZoom ( ), zoom );
		theTravelNotesData.map.setZoomAround (
			window.L.point ( wheelEvent.clientX, wheelEvent.clientY ),
			zoom
		);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
contextmenu event listener for the background
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BackgroundContextMenuEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} contextmenuEvent The event to handle
	*/

	handleEvent ( contextmenuEvent ) {
		contextmenuEvent.preventDefault ( );
	}
}

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

	#initialZoom;

	#initialZoomDistance;

	#startPoint;

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
			theTravelNotesData.map.setZoomAround ( this.#startPoint, zoom );
			this.#initialZoom = zoom;
			this.#initialZoomDistance = zoomDistance;
		}
	}

	#handleEndEvent ( touchEvent ) {
		if ( this.#panOngoing && ONE === touchEvent.changedTouches.length ) {
			this.#processPan ( touchEvent.changedTouches.item ( ZERO ) );
			this.#panOngoing = false;
		}
	}

	#handleMoveEvent ( touchEvent ) {
		if ( this.#panOngoing && ONE === touchEvent.changedTouches.length ) {
			this.#processPan ( touchEvent.changedTouches.item ( ZERO ) );
		}
		else if ( this.#zoomOngoing && TWO === touchEvent.targetTouches.length ) {
			this.#processZoom ( touchEvent.targetTouches );
		}
	}

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
			this.#startPoint = window.L.point (
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
			this.#handleStartEvent ( touchEvent );
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
			if ( mouseEvent.button === BackgroundMouseEL.LEFT_BUTTON ) {
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

export {
	OkButtonClickEL,
	CancelDialogButtonClickEL,
	TopBarDragStartEL,
	TopBarDragEndEL,
	BackgroundDragOverEL,
	DialogKeyboardKeydownEL,
	BackgroundWheelEL,
	BackgroundContextMenuEL,
	BackgroundTouchEL,
	BackgroundMouseEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */