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
Doc reviewed 20210914
Tests ...
*/

import theGeometry from '../coreLib/Geometry.js';
import theTravelNotesData from '../data/TravelNotesData.js';

import { ZERO, ONE, DIALOG_DRAG_MARGIN } from '../main/Constants.js';

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
leftpan event listener for the background
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BackgroundLeftPanEL {

	/**
	A leaflet LatLng object with the center of the map
	@type {LeafletObject}
	*/

	#mapCenter;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} leftPanEvent The event to handle
	*/

	handleEvent ( leftPanEvent ) {
		if ( 'start' === leftPanEvent.action ) {
			this.#mapCenter = theTravelNotesData.map.getCenter ( );
			return;
		}
		const latLngAtStart = theGeometry.screenCoordToLatLng (
			leftPanEvent.startX,
			leftPanEvent.startY
		);
		const latLngAtEnd = theGeometry.screenCoordToLatLng ( leftPanEvent.endX, leftPanEvent.endY );
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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
rightpan event listener for the background. Zoom on the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BackgroundRightPanEL {

	/**
	The minimal value in pixels for the pan displacement triggering a zoom
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #ZOOM_DISPLACMENT ( ) { return 25; }

	/**
	The map zoom before the event
	@type {Number}
	*/

	#initialZoom;

	/**
	A L.Point object containing the screen coordinates of the start point of the pan
	@type {LeafletObject}
	*/

	#startPoint;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#initialZoom = ZERO;
	}

	/**
	Event listener method
	@param {Event} rightPanEvent The event to handle
	*/

	handleEvent ( rightPanEvent ) {
		if ( 'start' === rightPanEvent.action ) {
			this.#initialZoom = theTravelNotesData.map.getZoom ( );
			this.#startPoint = window.L.point ( rightPanEvent.clientX, rightPanEvent.clientY );
			return;
		}
		let zoom = Math.floor (
			this.#initialZoom + ( ( rightPanEvent.startY - rightPanEvent.endY ) / BackgroundRightPanEL.#ZOOM_DISPLACMENT )
		);
		zoom = Math.min ( theTravelNotesData.map.getMaxZoom ( ), zoom );
		zoom = Math.max ( theTravelNotesData.map.getMinZoom ( ), zoom );
		theTravelNotesData.map.setZoomAround ( this.#startPoint, zoom );
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

export {
	OkButtonClickEL,
	CancelDialogButtonClickEL,
	TopBarDragStartEL,
	TopBarDragEndEL,
	DialogKeyboardKeydownEL,
	BackgroundLeftPanEL,
	BackgroundRightPanEL,
	BackgroundWheelEL,
	BackgroundContextMenuEL,
	BackgroundDragOverEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */