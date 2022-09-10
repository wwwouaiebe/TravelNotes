import BaseEL from '../../eventListeners/BaseEL.js';
import { ZERO, ONE } from '../../main/Constants.js';

class BaseDialogTopBarEL extends BaseEL {

	/**
	A reference to the mover object of the dialog
	@type {BaseDialogMover|DockableBaseDialogMover}
	*/

	#mover;

	/**
	The constructor
	@param {BaseDialogMover|DockableBaseDialogMover} mover A reference to the mover object of the dialog
	*/

	constructor ( mover ) {
		super ( );
		Object.freeze ( this );
		this.#mover = mover;
		this.eventTypes = [ 'dragstart', 'dragend' ];
	}

	handleTouchStartEvent ( touchStartEvent ) {
		if ( ONE === touchStartEvent.changedTouches.length ) {
			const touch = touchStartEvent.changedTouches.item ( ZERO );
			this.#mover.setDragStartPoint ( touch );
		}
	}

	handleTouchMoveEvent ( touchMoveEvent ) {
		if ( ONE === touchMoveEvent.changedTouches.length ) {
			const touch = touchMoveEvent.changedTouches.item ( ZERO );
			this.#mover.moveDialog ( touch, touchMoveEvent.type );
		}
	}

	handleTouchEndEvent ( touchEndEvent ) {
		if ( ONE === touchEndEvent.changedTouches.length ) {
			const touch = touchEndEvent.changedTouches.item ( ZERO );
			this.#mover.moveDialog ( touch, touchEndEvent.type );
		}
	}

	handleTouchCancel ( ) {
	}

	/**
	drag start event listener method
	@param {Event} dragStartEvent The event to handle
	*/

	handleDragStartEvent ( dragStartEvent ) {
		console.log ( 'handleDragStartEvent' );
		this.#mover.setDragStartPoint ( dragStartEvent );
		dragStartEvent.dataTransfer.setData ( 'ObjId', this.#mover.objId );
	}

	/**
	drag end event listener method
	@param {Event} dragEndEvent The event to handle
	*/

	handleDragEndEvent ( dragEndEvent ) {
		console.log ( 'handleDragEndEvent' );
		this.#mover.moveDialog ( dragEndEvent );
	}
}

export default BaseDialogTopBarEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */