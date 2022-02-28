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
Doc reviewed 20210914
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
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import {
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
} from '../dialogbase/BaseDialogEventListeners.js';
import PanEventDispatcher from '../dialogPanEventDispatcher/PanEventDispatcher.js';
import DragData from '../dialogs/DragData.js';

// import GarbageCollectorTester from '../UILib/GarbageCollectorTester.js';

import { ZERO, TWO, DIALOG_DRAG_MARGIN } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
An object to gives some options to a dialog, mainly for generic dialogs (SelectDialog, TwoButtonsDialog)
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DialogOptions {

	/**
	The text to be displayed on the first button on the bottom of the dialog. Default to 🆗
	@type {?String}
	*/

	#firstButtonText = null;

	/**
	The text to be displayed on the first button on the bottom of the dialog
	@type {?String}
	*/

	#secondButtonText = null;

	/**
	Options for the SelectDialog
	@type {Array.<SelectOptionData>}
	*/

	#selectOptionsData = null;

	/**
	title of the dialog
	@type {?String}
	*/

	#title = null;

	/**
	A text to be displayed in the dialog
	@type {?String}
	*/

	#text = null;

	/**
	The constructor
	@param {DialogOptions} options An object with the options to change
	*/

	constructor ( options ) {
		for ( const property in options ) {
			switch ( property ) {
			case 'firstButtonText' :
				this.#firstButtonText = options.firstButtonText;
				break;
			case 'secondButtonText' :
				this.#secondButtonText = options.secondButtonText;
				break;
			case 'selectOptionsData' :
				this.#selectOptionsData = options.selectOptionsData;
				break;
			case 'title' :
				this.#title = options.title;
				break;
			case 'text' :
				this.#text = options.text;
				break;
			default :
				break;
			}
		}
	}

	/**
	The text to be displayed on the first button on the bottom of the dialog. Default to 🆗
	@type {?String}
	*/

	get firstButtonText ( ) { return this.#firstButtonText; }

	/**
	The text to be displayed on the first button on the bottom of the dialog
	@type {?String}
	*/

	get secondButtonText ( ) { return this.#secondButtonText; }

	/**
	Options for the SelectDialog
	@type {Array.<SelectOptionData>}
	*/

	get selectOptionsData ( ) { return this.#selectOptionsData; }

	/**
	title of the dialog
	@type {?String}
	*/

	get title ( ) { return this.#title; }

	/**
	A text to be displayed in the dialog
	@type {?String}
	*/

	get text ( ) { return this.#text; }
}

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
	The background div of the dialog
	@type {HTMLElement}
	*/

	#backgroundDiv;

	/**
	The container div of the dialog
	@type {HTMLElement}
	*/

	#containerDiv;

	/**
	The error div of the dialog
	@type {HTMLElement}
	*/

	#errorDiv;

	/**
	The wait div of the dialog
	@type {HTMLElement}
	*/

	#waitDiv;

	/**
	The ok button
	@type {HTMLElement}
	*/

	#okButton;

	/**
	The cancel button
	@type {HTMLElement}
	*/

	#cancelButton;

	/**
	The topbar
	@type {HTMLElement}
	*/

	#topBar;

	/**
	The second button if any
	@type {?HTMLElement}
	*/

	#secondButton;

	/**
	An event dispatcher for pans with the left button
	@type {PanEventDispatcher}
	*/

	#leftPanEventDispatcher;

	/**
	An event dispatcher for pans with the right button
	@type {PanEventDispatcher}
	*/

	#rightPanEventDispatcher;

	/**
	A flag to avoid all dialogs close when using the esc or enter keys
	@type {Boolean}
	*/

	#keyboardELEnabled;

	/**
	Data for drag ond drop operations
	@type {DragData}
	*/

	#dragData;

	/**
	Background left pan event listener
	@type {BackgroundLeftPanEL}
	*/

	#backgroundLeftPanEL;

	/**
	Background right pan event listener
	@type {BackgroundRightPanEL}
	*/

	#backgroundRightPanEL;

	/**
	Drog over the background event listener
	@type {BackgroundDragOverEL}
	*/

	#backgroundDragOverEL;

	/**
	Wheel event listener on the background
	@type {BackgroundWheelEL}
	*/

	#backgroundWheelEL;

	/**
	Context menu event listener on the background
	@type {BackgroundContextMenuEL}
	*/

	#backgroundContextMenuEL;

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
	Cancel button click event listener
	@type {CancelDialogButtonClickEL}
	*/

	#cancelDialogButtonClickEL;

	/**
	Ok button click event listener
	@type {OkButtonClickEL}
	*/

	#okButtonClickEL;

	/**
	Keyboard key down event listener
	@type {DialogKeyboardKeydownEL}
	*/

	#dialogKeyboardKeydownEL;

	/**
	options parameter
	@type {?Object}
	*/

	#options = null;

	/**
	onOk promise function
	@type {function}
	*/

	#onPromiseOkFct;

	/**
	onError promise function
	@type {function}
	*/

	#onPromiseErrorFct;

	/**
	Create the background
	*/

	#createBackgroundDiv ( ) {

		// A new element covering the entire screen is created, with drag and drop event listeners
		this.#backgroundDiv = theHTMLElementsFactory.create ( 'div', { className : 'TravelNotes-Background' } );

		this.#leftPanEventDispatcher = new PanEventDispatcher ( this.#backgroundDiv, PanEventDispatcher.LEFT_BUTTON );
		this.#rightPanEventDispatcher = new PanEventDispatcher ( this.#backgroundDiv, PanEventDispatcher.RIGHT_BUTTON );

		this.#backgroundLeftPanEL = new BackgroundLeftPanEL ( );
		this.#backgroundDiv.addEventListener ( 'leftpan', this.#backgroundLeftPanEL, false );

		this.#backgroundRightPanEL = new BackgroundRightPanEL ( );
		this.#backgroundDiv.addEventListener ( 'rightpan', this.#backgroundRightPanEL, false );

		this.#backgroundDragOverEL = new BackgroundDragOverEL ( );
		this.#backgroundDiv.addEventListener ( 'dragover', this.#backgroundDragOverEL, false );

		this.#backgroundWheelEL = new BackgroundWheelEL ( );
		this.#backgroundDiv.addEventListener ( 'wheel', this.#backgroundWheelEL, { passive : true }	);

		this.#backgroundContextMenuEL = new BackgroundContextMenuEL ( );
		this.#backgroundDiv.addEventListener ( 'contextmenu', this.#backgroundContextMenuEL, false );
	}

	/**
	Create the dialog container
	*/

	#createContainerDiv ( ) {

		// the dialog is created
		this.#containerDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Container'
			},
			this.#backgroundDiv
		);
	}

	/**
	Create the animation top bar
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

		this.#topBarDragStartEL = new TopBarDragStartEL ( this.#dragData );
		this.#topBar.addEventListener ( 'dragstart', this.#topBarDragStartEL, false );
		this.#topBarDragEndEL =
			new TopBarDragEndEL ( this.#dragData, this.#containerDiv, this.#backgroundDiv );
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
		this.#cancelDialogButtonClickEL = new CancelDialogButtonClickEL ( this );
		this.#cancelButton.addEventListener ( 'click', this.#cancelDialogButtonClickEL, false );
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
	Create the content div
	*/

	#createContentDiv ( ) {
		const contentDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-ContentDiv'
			},
			this.#containerDiv
		);

		this.contentHTMLElements.forEach (
			contentHTMLElement => contentDiv.appendChild ( contentHTMLElement )
		);
	}

	/**
	Create the error div
	*/

	#createErrorDiv ( ) {
		this.#errorDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-ErrorDiv TravelNotes-Hidden'
			},
			this.#containerDiv
		);
	}

	/**
	Create the dialog wait animation
	*/

	#createWaitDiv ( ) {
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-WaitAnimationBullet'
			},
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-WaitAnimation'
				},
				this.#waitDiv = theHTMLElementsFactory.create (
					'div',
					{
						className : 'TravelNotes-BaseDialog-WaitDiv  TravelNotes-Hidden'
					},
					this.#containerDiv
				)
			)
		);
	}

	/**
	Create the dialog footer
	*/

	#createFooterDiv ( ) {
		const footerDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FooterDiv'
			},
			this.#containerDiv
		);

		this.#okButton = theHTMLElementsFactory.create (
			'div',
			{
				textContent : this.#options.firstButtonText || '🆗',
				className : 'TravelNotes-BaseDialog-Button'
			},
			footerDiv
		);
		this.#okButtonClickEL = new OkButtonClickEL ( this );
		this.#okButton.addEventListener ( 'click', this.#okButtonClickEL, false );

		if ( this.#options.secondButtonText ) {
			this.#secondButton = theHTMLElementsFactory.create (
				'div',
				{
					textContent : this.#options.secondButtonText,
					className : 'TravelNotes-BaseDialog-Button'
				},
				footerDiv
			);
			this.#secondButton.addEventListener ( 'click',	this.#cancelDialogButtonClickEL, false	);
		}
		else {
			this.#secondButton = null;
		}

		this.footerHTMLElements.forEach (
			footerHTMLElement => footerDiv.appendChild ( footerHTMLElement )
		);
	}

	/**
	Create the HTML dialog
	*/

	#createHTML ( ) {
		this.#createBackgroundDiv ( );
		this.#createContainerDiv ( );
		this.#createTopBar ( );
		this.#createHeaderDiv ( );
		this.#createContentDiv ( );
		this.#createErrorDiv ( );
		this.#createWaitDiv ( );
		this.#createFooterDiv ( );
	}

	/**
	Center the dialog o the screen
	*/

	#centerDialog ( ) {

		this.#dragData.dialogX =
			( this.#backgroundDiv.clientWidth - this.#containerDiv.clientWidth ) / TWO;
		this.#dragData.dialogY =
			( this.#backgroundDiv.clientHeight - this.#containerDiv.clientHeight ) / TWO;

		this.#dragData.dialogX = Math.min (
			Math.max ( this.#dragData.dialogX, DIALOG_DRAG_MARGIN ),
			this.#backgroundDiv.clientWidth -
				this.#containerDiv.clientWidth -
				DIALOG_DRAG_MARGIN
		);
		this.#dragData.dialogY = Math.max (
			this.#dragData.dialogY,
			DIALOG_DRAG_MARGIN
		);

		const dialogMaxHeight =
			this.#backgroundDiv.clientHeight -
			Math.max ( this.#dragData.dialogY, ZERO ) -
			DIALOG_DRAG_MARGIN;
		this.#containerDiv.style.left = String ( this.#dragData.dialogX ) + 'px';
		this.#containerDiv.style.top = String ( this.#dragData.dialogY ) + 'px';
		this.#containerDiv.style [ 'max-height' ] = String ( dialogMaxHeight ) + 'px';
	}

	/**
	Build and show the dialog
	@param {function} onPromiseOkFct The onOk Promise handler
	@param {function} onPromiseErrorFct The onError Promise handler
	*/

	#show ( onPromiseOkFct, onPromiseErrorFct ) {

		this.#onPromiseOkFct = onPromiseOkFct;
		this.#onPromiseErrorFct = onPromiseErrorFct;

		this.#createHTML ( );
		document.body.appendChild ( this.#backgroundDiv );
		this.#centerDialog ( );
		this.#dialogKeyboardKeydownEL = new DialogKeyboardKeydownEL ( this );
		document.addEventListener ( 'keydown', this.#dialogKeyboardKeydownEL, { capture : true } );

		this.onShow ( );
	}

	/**
	The constructor
	@param {dialogOptions} options the options for the dialog
	*/

	constructor ( options ) {
		Object.freeze ( this );
		this.#dragData = new DragData ( );
		this.#options = new DialogOptions ( options );
		this.#keyboardELEnabled = true;
	}

	/**
	Remove all events listeners and events dispatchers so all references to the dialog are released and
	finally remove all the htmlElements from the document
	*/

	#BaseDialogDestructor ( ) {
		document.removeEventListener ( 'keydown', this.#dialogKeyboardKeydownEL, { capture : true } );
		this.#dialogKeyboardKeydownEL = null;

		this.#topBar.removeEventListener ( 'dragstart', this.#topBarDragStartEL, false );
		this.#topBarDragStartEL = null;

		this.#topBar.removeEventListener ( 'dragend', this.#topBarDragEndEL, false );
		this.#topBarDragEndEL = null;

		this.#cancelButton.removeEventListener ( 'click', this.#cancelDialogButtonClickEL, false );
		if ( this.#options.secondButtonText ) {
			this.#secondButton.removeEventListener ( 'click', this.#cancelDialogButtonClickEL, false	);
		}
		this.#cancelDialogButtonClickEL = null;

		this.#okButton.removeEventListener ( 'click', this.#okButtonClickEL, false );
		this.#okButtonClickEL = null;

		this.#backgroundDiv.removeEventListener ( 'leftpan', this.#backgroundLeftPanEL, false );
		this.#backgroundLeftPanEL = null;

		this.#backgroundDiv.removeEventListener ( 'rightpan', this.#backgroundRightPanEL, false );
		this.#backgroundRightPanEL = null;

		this.#backgroundDiv.removeEventListener ( 'wheel', this.#backgroundWheelEL, { passive : true }	);
		this.#backgroundWheelEL = null;

		this.#backgroundDiv.removeEventListener ( 'contextmenu', this.#backgroundContextMenuEL, false );
		this.#backgroundContextMenuEL = null;

		this.#backgroundDiv.removeEventListener ( 'dragover', this.#backgroundDragOverEL, false );
		this.#backgroundDragOverEL = null;

		this.#leftPanEventDispatcher.detach ( );
		this.#rightPanEventDispatcher.detach ( );

		document.body.removeChild ( this.#backgroundDiv );
	}

	/**
	Cancel button handler. Can be overloaded in the derived classes
	*/

	onCancel ( ) {
		this.#BaseDialogDestructor ( );
		this.#onPromiseErrorFct ( 'Canceled by user' );
	}

	/**
	Called after the ok button will be clicked and before the dialog will be closed.
	Can be overloaded in the derived classes.
	@return {Boolean} true when the dialog can be closed (all data in the dialog are valid), false otherwise.
	*/

	canClose ( ) {
		return true;
	}

	/**
	Ok button handler. Can be overloaded in the derived classes, but you have always to call super.onOk ( ).
	@param {} returnValue a value that will be returned to the onOk handler of the Promise
	*/

	onOk ( returnValue ) {
		if ( this.canClose ( ) ) {
			this.#BaseDialogDestructor ( );
			this.#onPromiseOkFct ( returnValue );
			return true;
		}
		return false;
	}

	/**
	Called when the dialog is show. Can be overloaded in the derived classes
	*/

	onShow ( ) {}

	/**
	The title of the dialog. Can be overloaded in the derived classes
	@type {String}
	*/

	get title ( ) { return ''; }

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	Can be overloaded in the derived classes
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) { return []; }

	/**
	An array with the HTMLElements that have to be added in the footer of the dialog
	Can be overloaded in the derived classes
	@type {Array.<HTMLElement>}
	*/

	get footerHTMLElements ( ) { return []; }

	/**
	Show the dialog
	*/

	show ( ) {
		return new Promise ( ( onOk, onError ) => this.#show ( onOk, onError ) );
	}

	/**
	Show the wait section of the dialog and hide the okbutton
	*/

	showWait ( ) {
		this.#waitDiv.classList.remove ( 'TravelNotes-Hidden' );
		this.#okButton.classList.add ( 'TravelNotes-Hidden' );
	}

	/**
	Hide the wait section of the dialog and show the okbutton
	*/

	hideWait ( ) {
		this.#waitDiv.classList.add ( 'TravelNotes-Hidden' );
		this.#okButton.classList.remove ( 'TravelNotes-Hidden' );
	}

	/**
	Show the error section of the dialog
	@param {String} errorText The text to display in the error section
	*/

	showError ( errorText ) {
		this.#errorDiv.textContent = '';
		theHTMLSanitizer.sanitizeToHtmlElement ( errorText, this.#errorDiv );
		this.#errorDiv.classList.remove ( 'TravelNotes-Hidden' );
	}

	/**
	Hide the error section of the dialog
	*/

	hideError ( ) {
		this.#errorDiv.textContent = '';
		this.#errorDiv.classList.add ( 'TravelNotes-Hidden' );
	}

	/**
	A flag to avoid all dialogs close when using the esc or enter keys
	@type {Boolean}
	*/

	get keyboardELEnabled ( ) { return this.#keyboardELEnabled; }

	set keyboardELEnabled ( keyboardELEnabled ) { this.#keyboardELEnabled = keyboardELEnabled; }

	/**
	The options of the dialog box
	@type {DialogOptions}
	*/

	get options ( ) { return this.#options; }

}

export default BaseDialog;

/* eslint-enable max-lines */

/* --- End of file --------------------------------------------------------------------------------------------------------- */