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
	Execute the pan when a touchmove or toucheend event occurs after a touchestart event
	*/

	#processPan ( touche ) {
		const latLngAtStart = theGeometry.screenCoordToLatLng ( this.#startPanX, this.#startPanY );
		const latLngAtEnd = theGeometry.screenCoordToLatLng ( touche.screenX, touche.screenY );
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
	@param {HTMLElement} target The target for the event listener
	@param {Number} button The button used. must be PanEventDispatcher.LEFT_BUTTON or PanEventDispatcher.MIDDLE_BUTTON
	or PanEventDispatcher.RIGHT_BUTTON. Default value: PanEventDispatcher.LEFT_BUTTON
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} mouseEvent The event to handle
	*/

	handleEvent ( mouseEvent ) {
		const touches = mouseEvent.changedTouches;
		switch ( mouseEvent.type ) {
		case 'touchstart' :

			// mouseEvent.preventDefault ( );
			if ( touches && touches.length === ONE ) {
				this.#startPanX = touches.item ( ZERO ).screenX;
				this.#startPanY = touches.item ( ZERO ).screenY;
				this.#mapCenter = theTravelNotesData.map.getCenter ( );
				this.#panOngoing = true;
			}
			break;
		case 'touchmove' :

			// mouseEvent.preventDefault ( );
			if ( touches && touches.length === ONE ) {
				this.#processPan ( touches.item ( ZERO ) );
			}
			break;
		case 'touchend' :

			// mouseEvent.preventDefault ( );
			if (
				( touches && touches.length === ONE )
				&&
				this.#panOngoing
				&&
				( this.#startPanX !== touches.item ( ZERO ).screenX || this.#startPanY !== touches.item ( ZERO ).screenY )
			) {
				this.#processPan ( touches.item ( ZERO ) );
			}
			this.#panOngoing = false;
			break;
		case 'touchcancel' :
			this.#panOngoing = false;
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
	@param {HTMLElement} target The target for the event listener
	@param {Number} button The button used. must be PanEventDispatcher.LEFT_BUTTON or PanEventDispatcher.MIDDLE_BUTTON
	or PanEventDispatcher.RIGHT_BUTTON. Default value: PanEventDispatcher.LEFT_BUTTON
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