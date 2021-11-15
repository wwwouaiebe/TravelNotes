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
	- v2.0.0:
		- Issue ♯134 : Remove node.setAttribute ( 'style', blablabla) in the code
		- Issue ♯135 : Remove innerHTML from code
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import theTranslator from '../UILib/Translator.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import DragData from '../dialogs/DragData.js';
import { ZERO, DIALOG_DRAG_MARGIN } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragstart event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class FloatWindowTopBarDragStartEL {

	/**
	A reference to the dragData object of the FloatWindow
	@type {DragData}
	*/

	#dragData;

	/**
	The constructor
	@param {DragData} dragData A reference to the dragData object of the FloatWindow
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
dragend event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class FloatWindowTopBarDragEndEL {

	/**
	A reference to the dragData object of the FloatWindow
	@type {DragData}
	*/

	#dragData;

	/**
	The constructor
	@param {DragData} dragData A reference to the dragData object of the FloatWindow
	*/

	constructor ( dragData ) {
		Object.freeze ( this );
		this.#dragData = dragData;
	}

	/**
	Event listener method
	@param {Event} dragEndEvent The event to handle
	*/

	handleEvent ( dragEndEvent ) {
		const containerDiv = dragEndEvent.target.parentNode;
		this.#dragData.dialogX += dragEndEvent.screenX - this.#dragData.dragStartX;
		this.#dragData.dialogY += dragEndEvent.screenY - this.#dragData.dragStartY;
		this.#dragData.dialogX = Math.min (
			Math.max ( this.#dragData.dialogX, DIALOG_DRAG_MARGIN ),
			theTravelNotesData.map.getContainer ( ).clientWidth - containerDiv.clientWidth - DIALOG_DRAG_MARGIN
		);
		this.#dragData.dialogY = Math.max ( this.#dragData.dialogY, DIALOG_DRAG_MARGIN );
		const windowMaxHeight =
			theTravelNotesData.map.getContainer ( ).clientHeight -
			Math.max ( this.#dragData.dialogY, ZERO ) - DIALOG_DRAG_MARGIN;
		containerDiv.style.top = String ( this.#dragData.dialogY ) + 'px';
		containerDiv.style.left = String ( this.#dragData.dialogX ) + 'px';
		containerDiv.style [ 'max-height' ] = String ( windowMaxHeight ) + 'px';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the base for all the floating windows
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class FloatWindow {

	/**
	Shared data for drag and drop operations
	@type {DragData}
	*/

	#dragData;

	/**
	The window's container
	@type {HTMLElement}
	*/

	#containerDiv;

	/**
	The window top bar
	@type {HTMLElement}
	*/

	#topBar;

	/**
	The window header
	@type {HTMLElement}
	*/

	#headerDiv;

	/**
	The window content
	@type {HTMLElement}
	*/

	#contentDiv;

	/**
	Top bar drag start event listener
	@type {FloatWindowTopBarDragStartEL}
	*/

	#topBarDragStartEL;

	/**
	Top bar drag end event listener
	@type {FloatWindowTopBarDragEndEL}
	*/

	#topBarDragEndEL;

	/**
	This method creates the window
	*/

	#createContainerDiv ( ) {

		this.#containerDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-FloatWindow-Container'
			},
			document.body
		);
	}

	/**
	This method creates the topbar
	*/

	#createTopBar ( ) {
		this.#topBar = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-FloatWindow-TopBar',
				draggable : true
			},
			this.#containerDiv
		);
		this.#topBar.addEventListener ( 'dragstart', this.#topBarDragStartEL, false );
		this.#topBar.addEventListener ( 'dragend', this.#topBarDragEndEL, false );

		theHTMLElementsFactory.create (
			'div',
			{
				textContent : '❌',
				className : 'TravelNotes-FloatWindow-CancelButton',
				title : theTranslator.getText ( 'FloatWindow - Close' )
			},
			this.#topBar
		).addEventListener ( 'click', ( ) => this.close ( ), false );
	}

	/**
	This method creates the header div
	*/

	#createHeaderDiv ( ) {
		this.#headerDiv = theHTMLElementsFactory.create ( 'div', null, this.#containerDiv );
	}

	/**
	This method creates the content div
	*/

	#createContentDiv ( ) {
		this.#contentDiv = theHTMLElementsFactory.create ( 'div', null, this.#containerDiv );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#dragData = new DragData ( );
		this.#topBarDragStartEL = new FloatWindowTopBarDragStartEL ( this.#dragData );
		this.#topBarDragEndEL = new FloatWindowTopBarDragEndEL ( this.#dragData );
		this.#createContainerDiv ( );
		this.#createTopBar ( );
		this.#createHeaderDiv ( );
		this.#createContentDiv ( );
	}

	/**
	Close the window
	*/

	close ( ) {
		this.#topBar.removeEventListener ( 'dragstart', this.#topBarDragStartEL, false );
		this.#topBar.removeEventListener ( 'dragend', this.#topBarDragEndEL, false );
		this.#topBarDragStartEL = null;
		this.#topBarDragEndEL = null;
		document.body.removeChild ( this.#containerDiv );
	}

	/**
	Update the window. To be implemented in the derived classes
	*/

	update ( ) { }

	/**
	The header of the window. Read only but remember it's an HTMLElement...
	@type {HTMLElement}
	*/

	get header ( ) { return this.#headerDiv; }

	/**
	The content of the window. Read only but remember it's an HTMLElement...
	@type {HTMLElement}
	*/

	get content ( ) { return this.#contentDiv; }
}

export default FloatWindow;

/* --- End of file --------------------------------------------------------------------------------------------------------- */