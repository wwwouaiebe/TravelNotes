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
	- v4.0.0:
		- created
Doc reviewed ...
Tests ...
*/

import { ZERO, ONE, TWO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touchstart, touchmove, touchend and touchcancel on an list item event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TouchItemEL {

	/**
	The function to call when an item is droped
	@type {function}
	*/

	#dropFunction;

	/**
	A boolean to store if the event was generated with a double click or not
	@type {boolean}
	*/

	#isDoubleClick;

	/**
	The timestamp of the last touchstart event
	@type {Number}
	*/

	#lastTouchStartTimeStamp;

	/**
	The timestamp of the last scroll action
	@type {Number}
	*/

	#lastScrollTimeStamp;

	/**
	A clone of the html element selected for dragging
	@type {HTMLElement}
	*/

	#clonedNode;

	/**
	The container of the displayed list
	@type {HTMLElement}
	*/

	#sortableListContainer;

	/**
	The container with the scroll bars
	@type {HTMLElement}
	*/

	#scrolledContainer;

	/**
	The Y position in pixels where the top scroll will start
	@type {Number}
	*/

	#topScrollPosition;

	/**
	The Y position in pixels where the bottom scroll will start
	@type {Number}
	*/

	#bottomScrollPosition;

	/**
	The Y position in pixels of the current touch event
	@type {Number}
	*/

	#touchY;

	/**
	The drop target
	@type {HTMLElement}
	*/

	#dropTarget;

	/**
	A boolean - true when the drop point is on top of the target and false when at bottom
	@type {boolean}
	*/

	#dropOnTop;

	/**
	A constant giving the max delay in ms between 2 clicks to consider it's a double click
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #DBL_CLICK_MAX_DELAY ( ) { return 1000; }

	/**
	A constant giving the delay in ms betwwen two scroll actions for the requestAnimationFrame ( ) method
	See also https://developer.mozilla.org/fr/docs/Web/API/Document/scroll_event
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #SCROLL_DELAY ( ) { return 40; }

	/**
	A constant giving the number of pixels to scroll
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #SCROLL_VALUE ( ) { return 5; }

	/**
	A constant giving the distance in pixel betwwen the top of the container and the place where
	the scroll will start
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #TOP_SCROLL_DISTANCE ( ) { return 200; }

	/**
	A constant giving the distance in pixel betwwen the bottom of the container and the place where
	the scroll will start
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #BOTTOM_SCROLL_DISTANCE ( ) { return 100; }

	/**
	Scroll the list to the top
	@param {Number} scrollTimeStamp The time stamp of the call to the method. See window.requestAnimationFrame ( )
	*/

	#scrollTop ( scrollTimeStamp ) {
		if (
			scrollTimeStamp !== this.#lastScrollTimeStamp
			&&
			TouchItemEL.#SCROLL_DELAY < scrollTimeStamp - this.#lastScrollTimeStamp
		) {
			this.#scrolledContainer.scrollTop -= TouchItemEL.#SCROLL_VALUE;
			this.#lastScrollTimeStamp = scrollTimeStamp;
		}
		if (
			this.#topScrollPosition > this.#touchY
			&&
			ZERO < this.#scrolledContainer.scrollTop
		) {
			window.requestAnimationFrame (
				scrollTime => { this.#scrollTop ( scrollTime ); }
			);
		}
	}

	/**
	Scroll the list to the bottom
	@param {Number} scrollTimeStamp The time stamp of the call to the method. See window.requestAnimationFrame ( )
	*/

	#scrollBottom ( scrollTimeStamp ) {
		if (
			scrollTimeStamp !== this.#lastScrollTimeStamp
			&&
			TouchItemEL.#SCROLL_DELAY < scrollTimeStamp - this.#lastScrollTimeStamp
		) {
			this.#scrolledContainer.scrollTop += TouchItemEL.#SCROLL_VALUE;
			this.#lastScrollTimeStamp = scrollTimeStamp;
		}
		let isFullyScrolledDown =
		ONE > Math.abs (
			this.#scrolledContainer.scrollHeight -
			this.#scrolledContainer.clientHeight -
			this.#scrolledContainer.scrollTop
		);
		if (
			this.#bottomScrollPosition < this.#touchY
			&&
			! isFullyScrolledDown
		) {
			window.requestAnimationFrame (
				scrollTime => { this.#scrollBottom ( scrollTime ); }
			);
		}
	}

	/**
	Handle the touchstart event
	@param {Event} touchEvent The event to handle
	*/

	#handleStartEvent ( touchEvent ) {
		const touch = touchEvent.changedTouches.item ( ZERO );
		if ( ONE === touchEvent.touches.length ) {
			if (
				TouchItemEL.#DBL_CLICK_MAX_DELAY < touchEvent.timeStamp - this.#lastTouchStartTimeStamp
				||
				ZERO === this.#lastTouchStartTimeStamp
			) {

				// it's a simple click => we return, waiting a second click
				this.#lastTouchStartTimeStamp = touchEvent.timeStamp;
				return;
			}

			// It's a double click. Stopping the scroll in the data div
			touchEvent.preventDefault ( );
			this.#isDoubleClick = true;

			// Saving the position of the list container
			this.#sortableListContainer = touchEvent.currentTarget.parentNode;
			this.#scrolledContainer = touchEvent.currentTarget.parentNode.parentNode.parentNode;
			this.#touchY = touch.screenY;

			// cloning the node and append it to the document
			this.#clonedNode = touchEvent.currentTarget.cloneNode ( true );
			this.#clonedNode.classList.add ( 'TravelNotes-SortableList-Dragged-Item' );
			document.body.appendChild ( this.#clonedNode );
			this.#clonedNode.style.left = touch.screenX + 'px';
			this.#clonedNode.style.top = touch.screenY + 'px';
			this.#topScrollPosition =
				this.#sortableListContainer.getBoundingClientRect ( ).y -
				this.#scrolledContainer.getBoundingClientRect ( ).y +
				this.#scrolledContainer.scrollTop +
				TouchItemEL.#TOP_SCROLL_DISTANCE;
			this.#bottomScrollPosition =
			this.#scrolledContainer.getBoundingClientRect ( ).bottom -
				TouchItemEL.#BOTTOM_SCROLL_DISTANCE;
		}
	}

	/**
	Handle the touchmove event
	@param {Event} touchEvent The event to handle
	*/

	#handleMoveEvent ( touchEvent ) {
		if ( ! this.#isDoubleClick ) {
			return;
		}
		const touch = touchEvent.changedTouches.item ( ZERO );
		if ( ONE === touchEvent.touches.length ) {
			if ( this.#clonedNode ) {

				// moving the cloned node to the touch position
				this.#clonedNode.style.left = touch.screenX + 'px';
				this.#clonedNode.style.top = touch.screenY + 'px';
				this.#touchY = touch.screenY;
				if (
					this.#topScrollPosition > this.#touchY
					&&
					ZERO < this.#scrolledContainer.scrollTop
				) {
					window.requestAnimationFrame (
						scrollTime => { this.#scrollTop ( scrollTime ); }
					);
				}
				let isFullyScrolledDown =
					ONE > Math.abs (
						this.#scrolledContainer.scrollHeight -
						this.#scrolledContainer.clientHeight -
						this.#scrolledContainer.scrollTop
					);
				if (
					this.#bottomScrollPosition < this.#touchY
					&&
					! isFullyScrolledDown
				) {
					window.requestAnimationFrame (
						scrollTime => { this.#scrollBottom ( scrollTime ); }
					);
				}
			}
		}
	}

	/**
	Set the drop target and the drop position from the touch of the dragend event
	@param {Touch} touch The dragend event touch
	*/

	#setDropTargetAndPosition ( touch ) {

		// iterating on the listItems
		this.#sortableListContainer.childNodes.forEach (
			listItem => {
				let clientRect = listItem.getBoundingClientRect ( );

				// Searching if the touch is in the bounding client rectangle
				if (
					clientRect.left < touch.clientX
					&&
					clientRect.right > touch.clientX
					&&
					clientRect.top < touch.clientY
					&&
					clientRect.bottom > touch.clientY
				) {

					// setting the drop target
					this.#dropTarget = listItem;

					// setting the dropOnTop flag depending of the y position of the touch in the bounding client rectangle
					this.#dropOnTop = touch.clientY - clientRect.top < clientRect.height / TWO;
				}
			}
		);
	}

	/**
	Handle the touchend event
	@param {Event} touchEvent The event to handle
	*/

	#handleEndEvent ( touchEvent ) {
		if ( this.#isDoubleClick ) {
			let touch = touchEvent.changedTouches.item ( ZERO );
			this.#setDropTargetAndPosition ( touch );
			if ( this.#dropTarget ) {
				this.#dropFunction (
					Number.parseInt ( touchEvent.currentTarget.dataset.tanObjId ),
					Number.parseInt ( this.#dropTarget.dataset.tanObjId ),
					this.#dropOnTop
				);
			}
		}
		this.#reset ( );
	}

	/**
	reset some variables after a touchend or touchcancel event
	*/

	#reset ( ) {
		this.#scrolledContainer = null;
		this.#isDoubleClick = false;
		this.#lastTouchStartTimeStamp = ZERO;
		this.#lastScrollTimeStamp = ZERO;
		if ( this.#clonedNode ) {
			document.body.removeChild ( this.#clonedNode );
		}
		this.#clonedNode = null;
		this.#sortableListContainer = null;
		this.#scrolledContainer = null;
		this.#topScrollPosition = ZERO;
		this.#bottomScrollPosition = ZERO;
		this.#touchY = ZERO;
		this.#dropTarget = null;
		this.#dropOnTop = true;
	}

	/**
	The constructor
	@param {function} dropFunction The function to call when an item is droped
	*/

	constructor ( dropFunction ) {
		Object.freeze ( this );
		this.#dropFunction = dropFunction;
		this.#isDoubleClick = false;
		this.#lastTouchStartTimeStamp = ZERO;
		this.#lastScrollTimeStamp = ZERO;
		this.#clonedNode = null;
		this.#sortableListContainer = null;
		this.#scrolledContainer = null;
		this.#topScrollPosition = ZERO;
		this.#bottomScrollPosition = ZERO;
		this.#touchY = ZERO;
		this.#dropTarget = null;
		this.#dropOnTop = true;
	}

	/**
	Event listener method
	@param {Event} touchEvent The event to handle
	*/

	handleEvent ( touchEvent ) {
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
		case 'touchcancel' :
			this.#reset ( );
			break;
		default :
			break;
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Drag start on an list item event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DragStartItemEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} dragStartEvent The event to handle
	*/

	handleEvent ( dragStartEvent ) {
		dragStartEvent.stopPropagation ( );
		try {
			dragStartEvent.dataTransfer.setData ( 'ObjId', dragStartEvent.target.dataset.tanObjId );
			dragStartEvent.dataTransfer.dropEffect = 'move';
		}
		catch ( err ) {
			if ( err instanceof Error ) {
				console.error ( err );
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Drop list item event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DropItemEL {

	/**
	The function to call when an item is droped
	@type {function}
	*/

	#dropFunction;

	/**
	The constructor
	@param {function} dropFunction The function to call when an item is droped
	*/

	constructor ( dropFunction ) {
		Object.freeze ( this );
		this.#dropFunction = dropFunction;
	}

	/**
	Event listener method
	@param {Event} dropEvent The event to handle
	*/

	handleEvent ( dropEvent ) {
		dropEvent.preventDefault ( );
		const clientRect = dropEvent.target.getBoundingClientRect ( );
		this.#dropFunction (
			Number.parseInt ( dropEvent.dataTransfer.getData ( 'ObjId' ) ),
			Number.parseInt ( dropEvent.target.dataset.tanObjId ),
			( dropEvent.clientY - clientRect.top < clientRect.bottom - dropEvent.clientY )
		);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
context menu on a list item event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ContextMenuItemEL {

	/**
	The context menu class to use
	@type {class}
	*/

	#contextMenuClass;

	/**
	The constructor
	@param {class} contextMenuClass The context menu class to use
	*/

	constructor ( contextMenuClass ) {
		Object.freeze ( this );
		this.#contextMenuClass = contextMenuClass;
	}

	/**
	Event listener method
	@param {Event} contextMenuEvent The event to handle
	*/

	handleEvent ( contextMenuEvent ) {
		contextMenuEvent.stopPropagation ( );
		contextMenuEvent.preventDefault ( );
		new ( this.#contextMenuClass ) ( contextMenuEvent, contextMenuEvent.target.parentNode ).show ( );
	}
}

export {
	TouchItemEL,
	DragStartItemEL,
	DropItemEL,
	ContextMenuItemEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */