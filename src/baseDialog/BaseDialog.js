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
Doc reviewed 20220822
Tests ...
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTranslator from '../UILib/Translator.js';
import BaseDialogOptions from '../baseDialog/BaseDialogOptions.js';
import CancelButtonClickEL from '../baseDialog/CancelButtonClickEL.js';
import TopBarDragStartEL from '../baseDialog/TopBarDragStartEL.js';
import TopBarDragEndEL from '../baseDialog/TopBarDragEndEL.js';
import TopBarTouchEL from '../baseDialog/TopBarTouchEL.js';
import BaseDialogMover from '../baseDialog/BaseDialogMover.js';

// import GarbageCollectorTester from '../UILib/GarbageCollectorTester.js';

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
	The container HTMLElement of the dialog
	@type {HTMLElement}
	*/

	#dialogHTMLElement;

	/**
	The topbar HTMLElement
	@type {HTMLElement}
	*/

	#topBarHTMLElement;

	/**
	The cancel button on the top bar
	@type {HTMLElement}
	*/

	#cancelButton;

	/**
	The content HTMLElement
	@type {HTMLElement}
	*/

	#contentHTMLElement;

	/**
	BaseDialogMover for drag ond drop and touch operations
	@type {BaseDialogMover}
	*/

	#baseDialogMover;

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

	#createDialogHTMLElement ( ) {

		// the dialog is created
		this.#dialogHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-DialogHTMLElement'
			}
		);
		this.mover.dialogHTMLElement = this.#dialogHTMLElement;
	}

	/**
	Create the top bar
	*/

	#createTopBarHTMLElement ( ) {

		this.#topBarHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-TopBarHTMLElement',
				draggable : true
			},
			this.#dialogHTMLElement
		);

		this.#topBarTouchEL = new TopBarTouchEL ( this.mover );
		this.#topBarHTMLElement.addEventListener ( 'touchstart', this.#topBarTouchEL, false );
		this.#topBarHTMLElement.addEventListener ( 'touchmove', this.#topBarTouchEL, false );
		this.#topBarHTMLElement.addEventListener ( 'touchend', this.#topBarTouchEL, false );
		this.#topBarHTMLElement.addEventListener ( 'touchcancel', this.#topBarTouchEL, false );
		this.#topBarDragStartEL = new TopBarDragStartEL ( this.mover );
		this.#topBarHTMLElement.addEventListener ( 'dragstart', this.#topBarDragStartEL, false );
		this.#topBarDragEndEL = new TopBarDragEndEL ( this.mover );
		this.#topBarHTMLElement.addEventListener ( 'dragend', this.#topBarDragEndEL, false );

		this.#cancelButton = theHTMLElementsFactory.create (
			'div',
			{
				textContent : '❌',
				className : 'TravelNotes-BaseDialog-CancelButton',
				title : theTranslator.getText ( 'BaseDialog - Cancel' )
			},
			this.#topBarHTMLElement
		);
		theHTMLElementsFactory.create (
			'div',
			{
				textContent : this.title,
				className : 'TravelNotes-BaseDialog-Title'
			},
			this.#topBarHTMLElement
		);
		this.#cancelButtonClickEL = new CancelButtonClickEL ( this );
		this.#cancelButton.addEventListener ( 'click', this.#cancelButtonClickEL, false );
		this.mover.topBarHTMLElement = this.#topBarHTMLElement;
	}

	/**
	Create the toolbar HTMLElement
	*/

	#createToolbarHTMLElement ( ) {
		if ( this.toolbarHTMLElement ) {
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseDialog-ToolbarHTMLElement'
				},
				this.#dialogHTMLElement
			).appendChild ( this.toolbarHTMLElement );
		}
	}

	/**
	Create the content HTMLElement
	*/

	#createContentHTMLElement ( ) {
		this.#contentHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-ContentHTMLElement'
			},
			this.#dialogHTMLElement
		);

		this.contentHTMLElements.forEach (
			contentHTMLElement => this.#contentHTMLElement.appendChild ( contentHTMLElement )
		);
	}

	/**
	Create the HTML dialog
	*/

	#createHTML ( ) {
		this.#createDialogHTMLElement ( );
		this.#createTopBarHTMLElement ( );
		this.#createToolbarHTMLElement ( );
		this.#createContentHTMLElement ( );
	}

	/**
	The constructor
	@param {BaseDialogOptions} options the options for the dialog
	*/

	constructor ( options ) {
		Object.freeze ( this );
		this.#options = new BaseDialogOptions ( options );
	}

	/**
	Remove all events listeners and events dispatchers so all references to the dialog are released and
	finally remove all the htmlElements from the document
	*/

	#destructor ( ) {
		this.#topBarHTMLElement.removeEventListener ( 'dragstart', this.#topBarDragStartEL, false );
		this.#topBarDragStartEL = null;
		this.#topBarHTMLElement.removeEventListener ( 'dragend', this.#topBarDragEndEL, false );
		this.#topBarDragEndEL = null;

		this.#topBarHTMLElement.removeEventListener ( 'touchstart', this.#topBarTouchEL, false );
		this.#topBarHTMLElement.removeEventListener ( 'touchmove', this.#topBarTouchEL, false );
		this.#topBarHTMLElement.removeEventListener ( 'touchend', this.#topBarTouchEL, false );
		this.#topBarHTMLElement.removeEventListener ( 'touchcancel', this.#topBarTouchEL, false );
		this.#topBarTouchEL = null;

		this.#cancelButton.removeEventListener ( 'click', this.#cancelButtonClickEL, false );
		this.#cancelButtonClickEL = null;
	}

	/**
	Get the mover object used with this dialog. Create the object if needed.
	Overload of the base class get mover ( )
	@type {BaseDialogMover}
	*/

	get mover ( ) { return this.#baseDialogMover ? this.#baseDialogMover : this.#baseDialogMover = new BaseDialogMover ( ); }

	/**
	Cancel button handler. Can be overloaded in the derived classes
	*/

	onCancel ( ) {
		this.#destructor ( );
	}

	/**
	Ok button handler. Can be overloaded in the derived classes
	*/

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

	/**
	Remove the container from the background
	@param {HTMLElement} backgroundElement the used background. The background can be the background created
	by the modal dialogs or the document.body for non modal dialogs
	*/

	removeFromBackground ( backgroundElement ) {
		backgroundElement.removeChild ( this.#dialogHTMLElement );
	}

	/**
	Add the container to the background.
	@param {HTMLElement} backgroundElement the used background. The background can be the background created
	by the modal dialogs or the document.body for non modal dialogs
	*/

	addToBackground ( backgroundElement ) {
		backgroundElement.appendChild ( this.#dialogHTMLElement );
	}

	/**
	Add an element to the container
	@param {HTMLElement} htmlElement The element to add
	*/

	addToDialog ( htmlElement ) {
		this.#dialogHTMLElement.appendChild ( htmlElement );
	}

	/**
	The options of the dialog box
	@type {BaseDialogOptions}
	*/

	get options ( ) { return this.#options; }

	/**
	Add a css class to the #dialogHTMLElement, so some css settings can be overloaded for a specific dialog
	@param {String} cssClass The css class to add
	*/

	addCssClass ( cssClass ) {
		this.#dialogHTMLElement.classList.add ( cssClass );
	}

}

export default BaseDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */