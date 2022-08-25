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

class TouchListItemEL {

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

	#clonedListItemHTMLElement;

	/**
	The container of the displayed list
	@type {HTMLElement}
	*/

	#sortableListHTMLElement;

	/**
	The container with the scroll bars
	@type {HTMLElement}
	*/

	#scrolledContainerHTMLElement;

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

	#dropTargetHTMLElement;

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
	Scroll the list container to the top
	@param {Number} scrollTimeStamp The time stamp of the call to the method. See window.requestAnimationFrame ( )
	*/

	#scrollContainerToTop ( scrollTimeStamp ) {
		if (
			scrollTimeStamp !== this.#lastScrollTimeStamp
			&&
			TouchListItemEL.#SCROLL_DELAY < scrollTimeStamp - this.#lastScrollTimeStamp
		) {
			this.#scrolledContainerHTMLElement.scrollTop -= TouchListItemEL.#SCROLL_VALUE;
			this.#lastScrollTimeStamp = scrollTimeStamp;
		}
		if (
			this.#topScrollPosition > this.#touchY
			&&
			ZERO < this.#scrolledContainerHTMLElement.scrollTop
		) {
			window.requestAnimationFrame (
				scrollTime => { this.#scrollContainerToTop ( scrollTime ); }
			);
		}
	}

	/**
	Scroll the list container to the bottom
	@param {Number} scrollTimeStamp The time stamp of the call to the method. See window.requestAnimationFrame ( )
	*/

	#scrollContainerToBottom ( scrollTimeStamp ) {
		if (
			scrollTimeStamp !== this.#lastScrollTimeStamp
			&&
			TouchListItemEL.#SCROLL_DELAY < scrollTimeStamp - this.#lastScrollTimeStamp
		) {
			this.#scrolledContainerHTMLElement.scrollTop += TouchListItemEL.#SCROLL_VALUE;
			this.#lastScrollTimeStamp = scrollTimeStamp;
		}
		let isFullyScrolledDown =
		ONE > Math.abs (
			this.#scrolledContainerHTMLElement.scrollHeight -
			this.#scrolledContainerHTMLElement.clientHeight -
			this.#scrolledContainerHTMLElement.scrollTop
		);
		if (
			this.#bottomScrollPosition < this.#touchY
			&&
			! isFullyScrolledDown
		) {
			window.requestAnimationFrame (
				scrollTime => { this.#scrollContainerToBottom ( scrollTime ); }
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
				TouchListItemEL.#DBL_CLICK_MAX_DELAY < touchEvent.timeStamp - this.#lastTouchStartTimeStamp
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
			this.#sortableListHTMLElement = touchEvent.currentTarget.parentNode;
			this.#scrolledContainerHTMLElement = touchEvent.currentTarget.parentNode.parentNode.parentNode;
			this.#touchY = touch.screenY;

			// cloning the node and append it to the document
			this.#clonedListItemHTMLElement = touchEvent.currentTarget.cloneNode ( true );
			this.#clonedListItemHTMLElement.classList.add ( 'TravelNotes-SortableList-DraggedListItemHTMLElement' );
			document.body.appendChild ( this.#clonedListItemHTMLElement );
			this.#clonedListItemHTMLElement.style.left = touch.screenX + 'px';
			this.#clonedListItemHTMLElement.style.top = touch.screenY + 'px';
			this.#topScrollPosition =
				this.#sortableListHTMLElement.getBoundingClientRect ( ).y -
				this.#scrolledContainerHTMLElement.getBoundingClientRect ( ).y +
				this.#scrolledContainerHTMLElement.scrollTop +
				TouchListItemEL.#TOP_SCROLL_DISTANCE;
			this.#bottomScrollPosition =
			this.#scrolledContainerHTMLElement.getBoundingClientRect ( ).bottom -
				TouchListItemEL.#BOTTOM_SCROLL_DISTANCE;
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
			if ( this.#clonedListItemHTMLElement ) {

				// moving the cloned node to the touch position
				this.#clonedListItemHTMLElement.style.left = touch.screenX + 'px';
				this.#clonedListItemHTMLElement.style.top = touch.screenY + 'px';

				// scrolling the container to the top if needed
				this.#touchY = touch.screenY;
				if (
					this.#topScrollPosition > this.#touchY
					&&
					ZERO < this.#scrolledContainerHTMLElement.scrollTop
				) {
					window.requestAnimationFrame (
						scrollTime => { this.#scrollContainerToTop ( scrollTime ); }
					);
				}

				// scrolling the container to the bottom if needed
				let isFullyScrolledDown =
					ONE > Math.abs (
						this.#scrolledContainerHTMLElement.scrollHeight -
						this.#scrolledContainerHTMLElement.clientHeight -
						this.#scrolledContainerHTMLElement.scrollTop
					);
				if (
					this.#bottomScrollPosition < this.#touchY
					&&
					! isFullyScrolledDown
				) {
					window.requestAnimationFrame (
						scrollTime => { this.#scrollContainerToBottom ( scrollTime ); }
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
		this.#sortableListHTMLElement.childNodes.forEach (
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
					this.#dropTargetHTMLElement = listItem;

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
			if ( this.#dropTargetHTMLElement ) {
				this.#dropFunction (
					Number.parseInt ( touchEvent.currentTarget.dataset.tanObjId ),
					Number.parseInt ( this.#dropTargetHTMLElement.dataset.tanObjId ),
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
		if ( this.#clonedListItemHTMLElement ) {
			document.body.removeChild ( this.#clonedListItemHTMLElement );
		}
		this.#clonedListItemHTMLElement = null;
		this.#scrolledContainerHTMLElement = null;
		this.#isDoubleClick = false;
		this.#lastTouchStartTimeStamp = ZERO;
		this.#lastScrollTimeStamp = ZERO;
		this.#sortableListHTMLElement = null;
		this.#topScrollPosition = ZERO;
		this.#bottomScrollPosition = ZERO;
		this.#touchY = ZERO;
		this.#dropTargetHTMLElement = null;
		this.#dropOnTop = true;
	}

	/**
	The constructor
	@param {function} dropFunction The function to call when an item is droped
	*/

	constructor ( dropFunction ) {
		Object.freeze ( this );
		this.#dropFunction = dropFunction;
		this.#clonedListItemHTMLElement = null;
		this.#reset ( );
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

export default TouchListItemEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */