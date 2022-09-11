import BaseEL from '../../eventListeners/BaseEL.js';
import theTravelNotesData from '../../data/TravelNotesData.js';
import theGeometry from '../../core/lib/Geometry.js';
import { ZERO, ONE, TWO, LAT, LNG } from '../../main/Constants.js';
import theConfig from '../../data/Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mousedown, mousemove, mouseup, dragover, contextmenu and wheel event listeners on the background of modal dialogs
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ModalBaseDialogBackgroundEL extends BaseEL {

	/**
	A reference to the dialog
	@type {ModalBaseDialog}
	*/

	#modalBaseDialog;

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
	constant for the left button
	@type {Number}
	*/

	static get #LEFT_BUTTON ( ) { return ZERO; }

	/**
	Execute the pan when a touchmove or toucheend event occurs after a touchestart event
	@param {Touch} touch The touch object to process
	*/

	#processPanForTouch ( touch ) {
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
				this.#modalBaseDialog.onCancel ( );
			}
			this.#processPan ( touch );
		}
	}

	/**
	Execute the pan when a touchmove or toucheend mousemove or mousemove event
	@param {Event|Touch} mouseEventOrTouch The touch or event to process
	*/

	#processPan ( mouseEventOrTouch ) {
		const latLngAtStart = theGeometry.screenCoordToLatLng ( this.#startPanX, this.#startPanY );
		const latLngAtEnd = theGeometry.screenCoordToLatLng ( mouseEventOrTouch.screenX, mouseEventOrTouch.screenY );
		theTravelNotesData.map.panTo (
			[
				this.#mapCenter.lat +
					latLngAtStart [ LAT ] -
					latLngAtEnd [ LAT ],
				this.#mapCenter.lng +
					latLngAtStart [ LNG ] -
					latLngAtEnd [ LNG ]
			]
		);
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
	Initialize the variables when a pan is starting
	@param {Event|Touch} mouseEventOrTouch The touch or event to process
	*/

	#startPan ( mouseEventOrTouch ) {
		this.#startPanX = mouseEventOrTouch.screenX;
		this.#startPanY = mouseEventOrTouch.screenY;
		this.#mapCenter = theTravelNotesData.map.getCenter ( );
		this.#panOngoing = true;
	}

	/**
	The constructor
	@param {ModalBaseDialog} modalBaseDialog A reference to the dialog
	*/

	constructor ( modalBaseDialog ) {
		super ( );
		this.#modalBaseDialog = modalBaseDialog;
		this.eventTypes = [ 'mousedown', 'mousemove', 'mouseup', 'dragover', 'contextmenu', 'wheel' ];
	}

	/**
	Handle the touchstart event
	@param {Event} touchStartEvent The event to handle
	*/

	handleTouchStartEvent ( touchStartEvent ) {
		if ( ONE === touchStartEvent.targetTouches.length ) {
			const touch = touchStartEvent.changedTouches.item ( ZERO );
			this.#startPan ( touch );
			this.#zoomOngoing = false;
		}
		if ( TWO === touchStartEvent.targetTouches.length ) {
			this.#initialZoom = theTravelNotesData.map.getZoom ( );
			this.#aroundPoint = window.L.point (
				(
					touchStartEvent.targetTouches.item ( ZERO ).clientX +
					touchStartEvent.targetTouches.item ( ONE ).clientX
				) / TWO,
				(
					touchStartEvent.targetTouches.item ( ZERO ).clientY +
					touchStartEvent.targetTouches.item ( ONE ).clientY
				) / TWO
			);
			this.#initialZoomDistance = Math.sqrt (
				(
					(
						touchStartEvent.targetTouches.item ( ZERO ).clientX -
						touchStartEvent.targetTouches.item ( ONE ).clientX
					) ** TWO
				)
				+
				(
					(
						touchStartEvent.targetTouches.item ( ZERO ).clientY -
						touchStartEvent.targetTouches.item ( ONE ).clientY
					) ** TWO
				)
			);
			this.#panOngoing = false;
			this.#zoomOngoing = true;
		}
	}

	/**
	Handle the touchmove event
	@param {Event} touchEvent The event to handle
	*/

	handleTouchMoveEvent ( touchEvent ) {
		if ( this.#panOngoing && ONE === touchEvent.changedTouches.length ) {
			this.#processPanForTouch ( touchEvent.changedTouches.item ( ZERO ) );
		}
		else if ( this.#zoomOngoing && TWO === touchEvent.targetTouches.length ) {
			this.#processZoom ( touchEvent.targetTouches );
		}
	}

	/**
	Handle the touchend event
	@param {Event} touchEvent The event to handle
	*/

	handleTouchEndEvent ( touchEvent ) {
		if ( this.#panOngoing && ONE === touchEvent.changedTouches.length ) {
			this.#processPanForTouch ( touchEvent.changedTouches.item ( ZERO ) );
			this.#panOngoing = false;
		}
	}

	/**
	mousedown event listener
	@param {Event} mouseDownEvent The event to handle
	*/

	handleMouseDownEvent ( mouseDownEvent ) {
		if (
			mouseDownEvent.button === ModalBaseDialogBackgroundEL.#LEFT_BUTTON
			&&
			mouseDownEvent.target === mouseDownEvent.currentTarget
		) {
			this.#startPan ( mouseDownEvent );
		}
	}

	/**
	mousemove event listener
	@param {Event} mouseMoveEvent The event to handle
	*/

	handleMouseMoveEvent ( mouseMoveEvent ) {
		if (
			mouseMoveEvent.button === ModalBaseDialogBackgroundEL.#LEFT_BUTTON
			&&
			this.#panOngoing
		) {
			if ( document.selection ) {
				document.selection.empty ();
			}
			else {
				window.getSelection ().removeAllRanges ();
			}
			this.#processPan ( mouseMoveEvent );
		}
	}

	/**
	mousedown event listener
	@param {Event} mouseUpEvent The event to handle
	*/

	handleMouseUpEvent ( mouseUpEvent ) {
		if (
			mouseUpEvent.button === ModalBaseDialogBackgroundEL.#LEFT_BUTTON
			&&
			this.#panOngoing
			&&
			( this.#startPanX !== mouseUpEvent.screenX || this.#startPanY !== mouseUpEvent.screenY )
		) {
			this.#processPan ( mouseUpEvent );
		}
		this.#panOngoing = false;
	}

	/**
	dragover event listener
	@param {Event} dragEvent The event to handle
	*/

	handleDragOverEvent ( dragEvent ) {
		if ( Number.parseInt ( dragEvent.dataTransfer.getData ( 'ObjId' ) ) !== this.#modalBaseDialog.mover.objId ) {

			// A lot of things can be dragged on the background and then receive the dragover event. Before moving the dialog,
			// we have to verify that it's the correct dialog and not something else like notes, routes or others dialog...
			return;
		}
		this.#modalBaseDialog.mover.moveDialog ( dragEvent );
	}

	/**
	context menu event listener
	*/

	handleContextMenuEvent ( ) {

		// do nothing. Usefull for preventDefault
	}

	/**
	Wheel event listener
	@param {Event} wheelEvent The event to handle
	*/

	handleWheelEvent ( wheelEvent ) {
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

export default ModalBaseDialogBackgroundEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */