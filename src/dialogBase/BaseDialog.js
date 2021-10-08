/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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

/**
@------------------------------------------------------------------------------------------------------------------------------

@file BaseDialog.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@typedef {Object} dialogOptions
@desc An object to store the options of the select in the SelectDialog
@property {string} text The text to be displayed as option HTMLElement
@property {!number} objId An objId
@public

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@typedef {Object} dialogOptions
@desc An object to gives some options to a dialog, mainly for generic dialogs (SelectDialog, TwoButtonsDialog)
@property {string} firstButtonText The text to be displayed on the first button on the bottom of the dialog. Default to 🆗
@property {string} secondButtonText The text to be displayed on the first button on the bottom of the dialog.
@property {Array.<SelectOptionSData>} selectOptionsData Options for the SelectDialog
@property {string} title The title of the dialog
@property {string} text A text to be displayed in the dialog
@public

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module dialogBase

@------------------------------------------------------------------------------------------------------------------------------
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
	CancelButtonClickEL,
	TopBarDragStartEL,
	TopBarDragEndEL,
	KeyboardKeydownEL,
	BackgroundLeftPanEL,
	BackgroundRightPanEL,
	BackgroundWheelEL,
	BackgroundContextMenuEL,
	BackgroundDragOverEL
} from '../dialogbase/BaseDialogEventListeners.js';
import PanEventDispatcher from '../dialogPanEventDispatcher/PanEventDispatcher.js';

import GarbageCollectorTester from '../UILib/GarbageCollectorTester.js';

import { ZERO, TWO, DIALOG_DRAG_MARGIN } from '../main/Constants.js';

/**
@--------------------------------------------------------------------------------------------------------------------------

@class BaseDialog
@classdesc Base class used for dialogs
@abstract
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class BaseDialog {

	/**
	Garbage collector testing. Only for memory free tests on dev.
	@private
	*/

	#garbageCollectorTester = new GarbageCollectorTester ( );

	/**
	HTMLElements of the dialog
	@private
	*/

	#backgroundDiv = null;
	#containerDiv = null;
	#errorDiv = null;
	#waitDiv = null;
	#okButton = null;
	#cancelButton = null;
	#topBar = null;
	#secondButton = null;
	#leftPanEventDispatcher = null;
	#rightPanEventDispatcher = null;

	/**
	A flag to avoid all dialogs close when using the esc or enter keys
	@private
	*/

	#keyboardELEnabled = true;

	/**
	Data for drag ond drop operations
	@private
	*/

	#dragData = Object.seal (
		{
			dragStartX : ZERO,
			dragStartY : ZERO,
			dialogX : ZERO,
			dialogY : ZERO
		}
	);

	/**
	event listeners
	@private
	*/

	#backgroundLeftPanEL = null;
	#backgroundRightPanEL = null;
	#backgroundDragOverEL = null;
	#backgroundWheelEL = null;
	#backgroundContextMenuEL = null;
	#topBarDragStartEL = null;
	#topBarDragEndEL = null;
	#cancelButtonClickEL = null;
	#okButtonClickEL = null;
	#keyboardKeydownEL = null;

	/**
	options parameter
	@private
	*/

	#options = null;

	/**
	onOk promise function
	@private
	*/

	#onPromiseOkFct = null;

	/**
	onError promise function
	@private
	*/

	#onPromiseErrorFct = null;

	/**
	Create the background
	@private
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
		this.#backgroundDiv.addEventListener ( 'wheel', this.#backgroundWheelEL, false	);

		this.#backgroundContextMenuEL = new BackgroundContextMenuEL ( );
		this.#backgroundDiv.addEventListener ( 'contextmenu', this.#backgroundContextMenuEL, false );
	}

	/**
	Create the dialog container
	@private
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
	@private
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
		this.#cancelButtonClickEL = new CancelButtonClickEL ( this );
		this.#cancelButton.addEventListener ( 'click', this.#cancelButtonClickEL, false );
	}

	/**
	Create the header div
	@private
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
	@private
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
	@private
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
	@private
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
	@private
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
			this.#secondButton.addEventListener ( 'click',	this.#cancelButtonClickEL, false	);
		}

		this.footerHTMLElements.forEach (
			footerHTMLElement => footerDiv.appendChild ( footerHTMLElement )
		);
	}

	/**
	Create the HTML dialog
	@private
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
	@private
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
	@private
	*/

	#show ( onPromiseOkFct, onPromiseErrorFct ) {

		this.#onPromiseOkFct = onPromiseOkFct;
		this.#onPromiseErrorFct = onPromiseErrorFct;

		this.#createHTML ( );
		document.body.appendChild ( this.#backgroundDiv );
		this.#centerDialog ( );
		this.#keyboardKeydownEL = new KeyboardKeydownEL ( this );
		document.addEventListener ( 'keydown', this.#keyboardKeydownEL, { capture : true } );

		this.onShow ( );
	}

	/*
	constructor
	@param {dialogOptions} the options for the dialog
	*/

	constructor ( options = {} ) {
		Object.freeze ( this );
		this.#options = options;
		this.#keyboardELEnabled = true;
	}

	#BaseDialogDestructor ( ) {
		document.removeEventListener ( 'keydown', this.#keyboardKeydownEL, { capture : true } );
		this.#keyboardKeydownEL = null;

		this.#topBar.removeEventListener ( 'dragstart', this.#topBarDragStartEL, false );
		this.#topBarDragStartEL = null;

		this.#topBar.removeEventListener ( 'dragend', this.#topBarDragEndEL, false );
		this.#topBarDragEndEL = null;

		this.#cancelButton.removeEventListener ( 'click', this.#cancelButtonClickEL, false );
		if ( this.#options.secondButtonText ) {
			this.#secondButton.removeEventListener ( 'click', this.#cancelButtonClickEL, false	);
		}
		this.#cancelButtonClickEL = null;

		this.#okButton.removeEventListener ( 'click', this.#okButtonClickEL, false );
		this.#okButtonClickEL = null;

		this.#backgroundDiv.removeEventListener ( 'leftpan', this.#backgroundLeftPanEL, false );
		this.#backgroundLeftPanEL = null;

		this.#backgroundDiv.removeEventListener ( 'rightpan', this.#backgroundRightPanEL, false );
		this.#backgroundRightPanEL = null;

		this.#backgroundDiv.removeEventListener ( 'wheel', this.#backgroundWheelEL, false	);
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
	@return {boolean} true when the dialog can be closed (all data in the dialog are valid), false otherwise.
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
	@type {string}
	@readonly
	*/

	get title ( ) { return ''; }

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	Can be overloaded in the derived classes
	@type {Array.<HTMLElement>}
	@readonly
	*/

	get contentHTMLElements ( ) { return []; }

	/**
	An array with the HTMLElements that have to be added in the footer of the dialog
	Can be overloaded in the derived classes
	@type {Array.<HTMLElement>}
	@readonly
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
	@param {string} errorText The text to display in the error section
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

	get keyboardELEnabled ( ) { return this.#keyboardELEnabled; }
	set keyboardELEnabled ( keyboardELEnabled ) { this.#keyboardELEnabled = keyboardELEnabled; }

}

export default BaseDialog;

/* eslint-enable max-lines */

/*
--- End of BaseDialog.js file -------------------------------------------------------------------------------------------------
*/