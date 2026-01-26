/*
Copyright - 2017 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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
import CancelButtonClickEL from './CancelButtonClickEL.js';
import DialogPointerEL from './DialogPointerEL.js';
import BaseDialogMover from './BaseDialogMover.js';
import DialogDragStartEL from './DialogDragStartEL.js';
import DialogDragEndEL from './DialogDragEndEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class used for dialogs
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseDialog {

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
	Dialog dragstart event listener
	@type {DialogDragStartEL}
	*/

	#dialogDragStartEL;

	/**
	Dialog dragend event listener
	@type {DialogDragEndEL}
	*/

	#dialogDragEndEL;

	/**
	Top bar pointer event listener
	@type {DialogPointerEL}
	*/

	#dialogPointerEL;

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
	The mover object used with this dialog.
	@type {BaseDialogMover}
	*/

	#mover = null;

	/**
	The mover object used with this dialog.
	@type {BaseDialogMover}
	*/

	get mover ( ) {	return this.#mover; }

	/**
	A flag indication if the dialog is dockable
	@type {Boolean}
	*/

	get isDockable ( ) { return false; }

	/**
	 * the The bounding client rectangle of the dialog container
	 * @type {Object}
	 */

	get boundingClientRect ( ) {
		return this.#contentHTMLElement.getBoundingClientRect ( );
	}

	/**
	Create the dialog container
	*/

	#createDialogHTMLElement ( ) {

		// the dialog is created
		this.#dialogHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'travelnotes-base-dialog-dialog-container',
				draggable : true
			}
		);
		this.#dialogDragStartEL = new DialogDragStartEL ( this.mover );
		this.#dialogHTMLElement.addEventListener ( 'dragstart', this.#dialogDragStartEL, false );
		this.#dialogDragEndEL = new DialogDragEndEL ( this.mover );
		this.#dialogHTMLElement.addEventListener ( 'dragend', this.#dialogDragEndEL, false );

		this.#dialogPointerEL = new DialogPointerEL ( this.mover );
		this.#dialogHTMLElement.addEventListener ( 'pointerdown', this.#dialogPointerEL, false );
		this.#dialogHTMLElement.addEventListener ( 'pointerup', this.#dialogPointerEL, false );
		this.#dialogHTMLElement.addEventListener ( 'pointermove', this.#dialogPointerEL, false );
	}

	/**
	Create the top bar
	*/

	#createTopBarHTMLElement ( ) {

		this.#topBarHTMLElement = theHTMLElementsFactory.create (
			'div',
			{ className : 'travelnotes-base-dialog-top-bar' },
			this.#dialogHTMLElement
		);

		this.#cancelButton = theHTMLElementsFactory.create (
			'div',
			{
				textContent : '❌',
				className : 'travelnotes-base-dialog-cancel-button',
				title : theTranslator.getText ( 'BaseDialog - Cancel' )
			},
			this.#topBarHTMLElement
		);
		theHTMLElementsFactory.create (
			'div',
			{
				textContent : this.title,
				className : 'travelnotes-base-dialog-title'
			},
			this.#topBarHTMLElement
		);
		this.#cancelButtonClickEL = new CancelButtonClickEL ( this );
		this.#cancelButton.addEventListener ( 'click', this.#cancelButtonClickEL, false );
	}

	/**
	Create the toolbar HTMLElement
	*/

	#createToolbarHTMLElement ( ) {
		if ( this.toolbarHTMLElement ) {
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'travelnotes-base-dialog-toolbar-container'
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
				className : 'travelnotes-base-dialog-content-container'
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
		this.#mover = new BaseDialogMover ( this );
	}

	/**
	Remove all events listeners and events dispatchers so all references to the dialog are released and
	finally remove all the htmlElements from the document
	*/

	#destructor ( ) {
		this.#dialogHTMLElement.removeEventListener ( 'dragstart', this.#dialogDragStartEL, false );
		this.#dialogDragStartEL = null;
		this.#dialogHTMLElement.removeEventListener ( 'dragend', this.#dialogDragEndEL, false );
		this.#dialogDragEndEL = null;

		this.#dialogHTMLElement.removeEventListener ( 'pointerdown', this.#dialogPointerEL, false );
		this.#dialogHTMLElement.removeEventListener ( 'pointerup', this.#dialogPointerEL, false );
		this.#dialogHTMLElement.removeEventListener ( 'pointermove', this.#dialogPointerEL, false );
		this.#dialogPointerEL = null;

		this.#cancelButton.removeEventListener ( 'click', this.#cancelButtonClickEL, false );
		this.#cancelButtonClickEL = null;

		// this.#mover = null;
	}

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
	The topbar HTMLElement
	@type {HTMLElement}
	*/

	get topBarHTMLElement ( ) { return this.#topBarHTMLElement; }

	/**
	The container HTMLElement of the dialog
	@type {HTMLElement}
	*/

	get dialogContainer ( ) { return this.#dialogHTMLElement; }

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
	 * Set the max-width and max-height css values of the dialog
	 * @param {Number} maxWidth The new max-width value
	 * @param {Number} maxHeight The new max-height value
	 */

	setMaxDim ( maxWidth, maxHeight ) {
		this.#dialogHTMLElement.style [ 'max-width' ] = String ( maxWidth ) + 'px';
		this.#dialogHTMLElement.style [ 'max-height' ] = String ( maxHeight ) + 'px';
	}

	/**
	 * Move the dialog on the screen
	 * @param {Number} dialogLeft The new left position of the dialog
	 * @param {Number} dialogTop The new top position of the dialog
	 */

	moveDialog ( dialogLeft, dialogTop ) {
		this.#dialogHTMLElement.style.left = String ( dialogLeft ) + 'px';
		this.#dialogHTMLElement.style.top = String ( dialogTop ) + 'px';
	}

	/**
	Add a css class to the #dialogHTMLElement, so some css settings can be overloaded for a specific dialog
	@param {String} cssClass The css class to add
	*/

	addCssClass ( cssClass ) {
		this.#dialogHTMLElement.classList.add ( cssClass );
	}

	/**
	Remove a css class to the #dialogHTMLElement, so some css settings can be overloaded for a specific dialog
	@param {String} cssClass The css class to add
	*/

	removeCssClass ( cssClass ) {
		this.#dialogHTMLElement.classList.remove ( cssClass );
	}

	/**
	Toggle a css class to the #dialogHTMLElement, so some css settings can be overloaded for a specific dialog
	@param {String} cssClass The css class to add
	*/

	toggleCssClass ( cssClass ) {
		this.#dialogHTMLElement.classList.toggle ( cssClass );
	}

}

export default BaseDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */