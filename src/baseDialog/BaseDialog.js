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
	- v1.0.0:
		- created
	- v1.3.0:
		- added the possibility to have an event listener on the cancel button and escape key in
		the derived dialog boxes
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
		- Issue ♯66 : Work with promises for dialogs
		- Issue ♯68 : Review all existing promises.
		- Issue ♯63 : Find a better solution for provider keys upload
	- v1.11.0:
		- Issue ♯110 : Add a command to create a SVG icon from osm for each maneuver
		- Issue ♯113 : When more than one dialog is opened, using thr Esc or Return key close all the dialogs
	- v2.0.0:
		- Issue ♯134 : Remove node.setAttribute ( 'style', blablabla) in the code
		- Issue ♯135 : Remove innerHTML from code
		- Issue ♯138 : Protect the app - control html entries done by user.
	- v2.2.0:
		- Issue ♯155 : Enable pan and zoom on the map when a dialog is displayed
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v4.0.0:
		- Issue ♯38 : Review mouse and touch events on the background div of dialogs
		- Issue ♯41 : Not possible to move a dialog on touch devices
		- Issue ♯48 : Review the dialogs
Doc reviewed ...
Tests ...
*/

/*

Box model

+- .TravelNotes-Background -----------------------------------------------------------------------------------------+
|                                                                                                                   |
| +- .TravelNotes-BaseDialog-Container -------------------------------------------------------------+               |
| |                                                                                                 |               |
| | +- .TravelNotes-BaseDialog-TopBar ------------------------------------------------------------+ |               |
| | |                                                                                             | |               |
| | | +- .TravelNotes-BaseDialog-CancelButton ---+                                                | |               |
| | | |  BaseDialog.cancelButton                 |                                                | |               |
| | | +------------------------------------------+                                                | |               |
| | +---------------------------------------------------------------------------------------------+ |               |
| |                                                                                                 |               |
| | +- .TravelNotes-BaseDialog-HeaderDiv ---------------------------------------------------------+ |               |
| | |  BaseDialog.title                                                                           | |               |
| | +---------------------------------------------------------------------------------------------+ |               |
| |                                                                                                 |               |
| | +- .TravelNotes-BaseDialog-ContentDiv --------------------------------------------------------+ |               |
| | |  BaseDialog.content                                                                         | |               |
| | |                                                                                             | |               |
| | |                                                                                             | |               |
| | |                                                                                             | |               |
| | |                                                                                             | |               |
| | +---------------------------------------------------------------------------------------------+ |               |
| |                                                                                                 |               |
| | +- .TravelNotes-BaseDialog-ErrorDiv ----------------------------------------------------------+ |               |
| | |                                                                                             | |               |
| | +---------------------------------------------------------------------------------------------+ |               |
| |                                                                                                 |               |
| | +- .TravelNotes-BaseDialog-FooterDiv ---------------------------------------------------------+ |               |
| | |                                                                                             | |               |
| | | +- .TravelNotes-BaseDialog-SearchWait ----------------------------------------------------+ | |               |
| | | |                                                                                         | | |               |
| | | +-----------------------------------------------------------------------------------------+ | |               |
| | |                                                                                             | |               |
| | | +- .TravelNotes-BaseDialog-Button ---------+                                                | |               |
| | | |  BaseDialog.okButton                     |                                                | |               |
| | | +------------------------------------------+                                                | |               |
| | +---------------------------------------------------------------------------------------------+ |               |
| +-------------------------------------------------------------------------------------------------+               |
|                                                                                                                   |
|                                                                                                                   |
|                                                                                                                   |
+-------------------------------------------------------------------------------------------------------------------+
*/

/* eslint-disable max-lines */

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTranslator from '../UILib/Translator.js';
import BaseDialogOptions from '../baseDialog/baseDialogOptions.js';
import { CancelButtonClickEL } from '../baseDialog/BaseDialogEventListeners.js';
import {
	TopBarDragStartEL,
	TopBarDragEndEL,
	TopBarTouchEL
} from '../baseDialog/BaseDialogTopBarEventListeners.js';
import DragData from '../baseDialog/DragData.js';

// import GarbageCollectorTester from '../UILib/GarbageCollectorTester.js';

import { DIALOG_DRAG_MARGIN, TWO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class used for dialogs
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseDialog {

	/*
	Garbage collector testing. Only for memory free tests on dev.
	*/

	// #garbageCollectorTester = new GarbageCollectorTester ( );

	/**
	The container div of the dialog
	@type {HTMLElement}
	*/

	#containerDiv;

	/**
	The topbar
	@type {HTMLElement}
	*/

	#topBar;

	/**
	The cancel button on the top bar
	@type {HTMLElement}
	*/

	#cancelButton;

	/**
	The content div of the dialog
	@type {HTMLElement}
	*/

	#contentDiv;

	/**
	Data for drag ond drop and touch operations
	@type {DragData}
	*/

	dragData;

	/**
	Top bar drag start event listener
	@type {TopBarDragStartEL}
	*/

	#topBarDragStartEL;

	/**
	Top bar drag end event listener
	@type {TopBarDragEndEL}
	*/

	#topBarDragEndEL;

	/**
	Top bar touch event listener
	@type {TopBarTouchEL}
	*/

	#topBarTouchEL;

	/**
	Cancel button click event listener
	@type {CancelButtonClickEL}
	*/

	#cancelButtonClickEL;

	/**
	options parameter
	@type {?Object}
	*/

	#options = null;

	/**
	Create the dialog container
	*/

	#createContainerDiv ( ) {

		// the dialog is created
		this.#containerDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Container'
			}
		);
		this.dragData.container = this.#containerDiv;
	}

	/**
	Create the top bar
	*/

	#createTopBar ( ) {

		this.#topBar = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-TopBar',
				draggable : true
			},
			this.#containerDiv
		);

		this.#topBarTouchEL = new TopBarTouchEL ( this.dragData );
		this.#topBar.addEventListener ( 'touchstart', this.#topBarTouchEL, false );
		this.#topBar.addEventListener ( 'touchmove', this.#topBarTouchEL, false );
		this.#topBar.addEventListener ( 'touchend', this.#topBarTouchEL, false );
		this.#topBar.addEventListener ( 'touchcancel', this.#topBarTouchEL, false );

		this.#topBarDragStartEL = new TopBarDragStartEL ( this.dragData );
		this.#topBar.addEventListener ( 'dragstart', this.#topBarDragStartEL, false );
		this.#topBarDragEndEL = new TopBarDragEndEL ( this.dragData );
		this.#topBar.addEventListener ( 'dragend', this.#topBarDragEndEL, false );

		this.#cancelButton = theHTMLElementsFactory.create (
			'div',
			{
				textContent : '❌',
				className : 'TravelNotes-BaseDialog-CancelButton',
				title : theTranslator.getText ( 'BaseDialog - Cancel' )
			},
			this.#topBar
		);
		this.#cancelButtonClickEL = new CancelButtonClickEL ( this );
		this.#cancelButton.addEventListener ( 'click', this.#cancelButtonClickEL, false );
	}

	/**
	Create the header div
	*/

	#createHeaderDiv ( ) {

		theHTMLElementsFactory.create (
			'text',
			{
				value : this.title
			}
			,
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseDialog-HeaderDiv'
				},
				this.#containerDiv
			)
		);
	}

	/**
	Create the toolbar div
	*/

	#createToolbarDiv ( ) {
		if ( this.toolbarHTMLElement ) {
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseDialog-ToolbarDiv'
				},
				this.#containerDiv
			).appendChild ( this.toolbarHTMLElement );
		}
	}

	/**
	Create the content div
	*/

	#createContentDiv ( ) {
		this.#contentDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-ContentDiv'
			},
			this.#containerDiv
		);

		this.contentHTMLElements.forEach (
			contentHTMLElement => this.#contentDiv.appendChild ( contentHTMLElement )
		);
	}

	/**
	Create the HTML dialog
	*/

	#createHTML ( ) {
		this.#createContainerDiv ( );
		this.#createTopBar ( );
		this.#createHeaderDiv ( );
		this.#createToolbarDiv ( );
		this.#createContentDiv ( );
	}

	/**
	The constructor
	@param {dialogOptions} options the options for the dialog
	*/

	constructor ( options ) {
		this.dragData = new DragData ( );
		Object.freeze ( this );
		this.#options = new BaseDialogOptions ( options );
	}

	/**
	Remove all events listeners and events dispatchers so all references to the dialog are released and
	finally remove all the htmlElements from the document
	*/

	#destructor ( ) {
		this.#topBar.removeEventListener ( 'dragstart', this.#topBarDragStartEL, false );
		this.#topBarDragStartEL = null;
		this.#topBar.removeEventListener ( 'dragend', this.#topBarDragEndEL, false );
		this.#topBarDragEndEL = null;

		this.#topBar.removeEventListener ( 'touchstart', this.#topBarTouchEL, false );
		this.#topBar.removeEventListener ( 'touchmove', this.#topBarTouchEL, false );
		this.#topBar.removeEventListener ( 'touchend', this.#topBarTouchEL, false );
		this.#topBar.removeEventListener ( 'touchcancel', this.#topBarTouchEL, false );
		this.#topBarTouchEL = null;

		this.#cancelButton.removeEventListener ( 'click', this.#cancelButtonClickEL, false );
		this.#cancelButtonClickEL = null;
	}

	/**
	Center the dialog o the screen
	*/

	centerDialog ( ) {

		this.dragData.dialogX =
			( this.dragData.background.clientWidth - this.#containerDiv.clientWidth ) / TWO;
		this.dragData.dialogY =
			( this.dragData.background.clientHeight - this.#containerDiv.clientHeight ) / TWO;

		this.#containerDiv.style.left = String ( this.dragData.dialogX ) + 'px';
		this.#containerDiv.style.top = String ( this.dragData.dialogY ) + 'px';
	}

	moveTo ( moveX, moveY ) {
		let dialogX = Math.max (
			Math.min (
				moveX,
				this.dragData.background.offsetWidth - this.#containerDiv.offsetWidth
			),
			DIALOG_DRAG_MARGIN
		);
		let dialogY = Math.max (
			Math.min (
				moveY,
				this.dragData.background.offsetHeight - this.#containerDiv.offsetHeight
			),
			DIALOG_DRAG_MARGIN
		);
		this.dragData.dialogX = dialogX;
		this.dragData.dialogY = dialogY;
		this.#containerDiv.style.left = String ( dialogX ) + 'px';
		this.#containerDiv.style.top = String ( dialogY ) + 'px';
	}

	/**
	Cancel button handler. Can be overloaded in the derived classes
	*/

	onCancel ( ) {
		this.#destructor ( );
	}

	onOk ( ) {
		this.#destructor ( );
	}

	/**
	The title of the dialog. Can be overloaded in the derived classes
	@type {String}
	*/

	get title ( ) { return ''; }

	/**
	An HTMLElement that have to be added as toolbar for the dialog.
	Can be overloaded in the derived classes
	@type {?HTMLElement}
	*/

	get toolbarHTMLElement ( ) { return null; }

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	Can be overloaded in the derived classes
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) { return []; }

	/**
	Show the dialog
	*/

	show ( ) {
		this.#createHTML ( );
	}

	removeFromBackground ( backgroundElement ) {
		backgroundElement.removeChild ( this.#containerDiv );
	}

	addToBackground ( backgroundElement ) {
		backgroundElement.appendChild ( this.#containerDiv );
	}

	addToContainer ( htmlElement ) {
		this.#containerDiv.appendChild ( htmlElement );
	}

	/**
	The options of the dialog box
	@type {DialogOptions}
	*/

	get options ( ) { return this.#options; }

}

export default BaseDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */