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
		- created from v3.6.0
Doc reviewed 202208
 */

import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import theTranslator from '../../core/uiLib/Translator.js';
import BaseDialogOptions from './BaseDialogOptions.js';
import BaseDialogCancelButtonEL from './BaseDialogCancelButtonEL.js';
import BaseDialogTopBarEL from './BaseDialogTopBarEL.js';
import BaseDialogMover from './BaseDialogMover.js';

// import GarbageCollectorTester from '../core/uiLib/GarbageCollectorTester.js';

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
	@type {BaseDialogTopBarEL}
	*/

	#baseDialogTopBarEL;

	/**
	Cancel button click event listener
	@type {BaseDialogCancelButtonEL}
	*/

	#baseDialogCancelButtonEL;

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

		this.#baseDialogTopBarEL = new BaseDialogTopBarEL ( this.mover );
		this.#baseDialogTopBarEL.addEventListeners ( this.#topBarHTMLElement );

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
		this.#baseDialogCancelButtonEL = new BaseDialogCancelButtonEL ( this );
		this.#baseDialogCancelButtonEL.addEventListeners ( this.#cancelButton );
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
		this.#baseDialogTopBarEL.removeEventListeners ( this.#topBarHTMLElement );
		this.#baseDialogTopBarEL = null;
		this.#baseDialogCancelButtonEL.removeEventListeners ( this.#cancelButton );
		this.#baseDialogCancelButtonEL = null;
		if ( this.#baseDialogMover ) {
			this.#baseDialogMover = null;
		}
	}

	/**
	Get the mover object used with this dialog. Create the object if needed.
	Can be overloaded in the derived classes
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
		this.createContentHTML ( );
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