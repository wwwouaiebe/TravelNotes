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

import ModalBaseDialog from '../baseDialog/ModalBaseDialog.js';
import NoteDialogToolbar from './toolbar/NoteDialogToolbar.js';

import MapIconData from './toolbar/MapIconData.js';

import TextAreaControl from '../../controls/textAreaControl/TextAreaControl.js';
import TextInputControl from '../../controls/textInputControl/TextInputControl.js';
import AddressControl from '../../controls/addressControl/AddressControl.js';

import NoteDialogIconDimsControl from './controls/NoteDialogIconDimsControl.js';
import NoteDialogLinkControl from './controls/NoteDialogLinkControl.js';
import NoteDialogPreviewControl from './controls/NoteDialogPreviewControl.js';

import NoteDialogEventListeners from './eventListeners/NoteDialogEventListeners.js';

import theHTMLSanitizer from '../../core/htmlSanitizer/HTMLSanitizer.js';
import theTranslator from '../../core/uiLib/Translator.js';
import theConfig from '../../data/Config.js';
import Note from '../../data/Note.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class create and manage the NoteDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialog extends ModalBaseDialog {

	/**
	A reference to the currently edited note
	@type {Note}
	*/

	#note;

	/**
	A reference to the route on witch the note is attached
	@type {Route}
	*/

	#route;

	/**
	A clone of the #note used to store the modifications and display the preview
	@type {Note}
	*/

	#previewNote;

	/**
	The icon dims control
	@type {NoteDialogIconDimsControl}
	*/

	#iconDimsControl;

	/**
	The icon control
	@type {TextAreaControl}
	*/

	#iconControl;

	/**
	The tooltip control
	@type {TextInputControl}
	*/

	#tooltipControl;

	/**
	The popup control
	@type {TextAreaControl}
	*/

	#popupControl;

	/**
	The address control
	@type {AddressControl}
	*/

	#addressControl;

	/**
	The link control
	@type {NoteDialogLinkControl}
	*/

	#linkControl;

	/**
	The phone control
	@type {TextInputControl}
	*/

	#phoneControl;

	/**
	The preview control
	@type {NoteDialogPreviewControl}
	*/

	#previewControl;

	/**
	the toolbar
	@type {NoteDialogToolbar}
	*/

	#toolbar;

	/**
	The control that have currently the focusControl
	@type {HTMLElement}
	*/

	#focusControl;

	/**
	Event listeners
	@type {NoteDialogEventListeners}
	*/

	#eventListeners;

	/**
	Destructor. Remove event listeners before closing the dialog and set event listeners objects
	to null, so all references to the dialog are released
	*/

	#destructor ( ) {
		this.#toolbar.destructor ( this.#eventListeners );
		this.#iconDimsControl.destructor ( this.#eventListeners );
		this.#iconControl.destructor ( this.#eventListeners );
		this.#tooltipControl.destructor ( this.#eventListeners );
		this.#popupControl.destructor ( this.#eventListeners );
		this.#addressControl.destructor ( this.#eventListeners );
		this.#linkControl.destructor ( this.#eventListeners );
		this.#phoneControl.destructor ( this.#eventListeners );
		this.#eventListeners.destructor ( );
	}

	/**
	The constructor
	@param {Note} note The edited note
	@param {Route} route The route to witch the note is linked
	*/

	constructor ( note, route ) {
		super ( );

		this.#focusControl = null;

		// Saving parameters
		this.#note = note;
		this.#route = route;

		// Cloning the note
		this.#previewNote = new Note ( );
		this.#previewNote.jsonObject = note.jsonObject;

	}

	/**
	Create all the controls needed for the dialog.
	Overload of the base class createContentHTML
	*/

	createContentHTML ( ) {
		this.#eventListeners = new NoteDialogEventListeners ( this, this.#previewNote.latLng );

		// creting toolbar and controls
		this.#toolbar = new NoteDialogToolbar ( this.#eventListeners );
		this.#iconDimsControl = new NoteDialogIconDimsControl ( this.#eventListeners );
		this.#iconControl = new TextAreaControl (
			{
				placeholder : '?????',
				datasetName : 'iconContent',
				headerText : theTranslator.getText ( 'NoteDialogIconControl - Icon content' )
			},
			this.#eventListeners
		);
		this.#tooltipControl = new TextInputControl (
			{
				headerText : theTranslator.getText ( 'NoteDialogTooltipControl - Tooltip content' ),
				datasetName : 'tooltipContent'
			},
			this.#eventListeners
		);
		this.#popupControl = new TextAreaControl (
			{
				rows : theConfig.noteDialog.areaHeight.popupContent,
				datasetName : 'popupContent',
				headerText : theTranslator.getText ( 'NoteDialogPopupControl - Text' )
			},
			this.#eventListeners
		);
		this.#addressControl = new AddressControl (	this, this.#eventListeners );
		this.#linkControl = new NoteDialogLinkControl ( this.#eventListeners, this.#previewNote.latLng );
		this.#phoneControl = new TextInputControl (
			{
				headerText : theTranslator.getText ( 'NoteDialogPhoneControl - Phone' ),
				datasetName : 'phone'
			},
			this.#eventListeners
		);
		this.#previewControl = new NoteDialogPreviewControl ( this.#previewNote );

	}

	/**
	The control that have currently the focus. Used for toolbar buttons
	@type {HTMLElement}
	*/

	get focusControl ( ) { return this.#focusControl; }

	set focusControl ( focusControl ) { this.#focusControl = focusControl; }

	/**
	Data needed for the MapIconFromOsmFactory
	@type {MapIconData}
	*/

	get mapIconData ( ) { return new MapIconData ( this.#previewNote.latLng, this.#route ); }

	/**
	The lat and lng of the note. Used by the GeoCoderHelper object of the address control
	@type {Array.<Number>}
	*/

	get latLng ( ) { return this.#previewNote.latLng; }

	/**
	Update the preview of the note. Used by event listeners
	@param {Object} noteData An object with properties to copy in the preview note
	*/

	updatePreview ( noteData ) {
		for ( const property in noteData ) {
			this.#previewNote [ property ] = noteData [ property ];
		}
		this.#previewControl.update ( );
	}

	/**
	Overload of the ModalBaseDialog.show ( ) method.
	*/

	show ( ) {
		const showPromise = super.show ( );

		// copy the notes values into the controls
		this.setControlsValues ( this.#previewNote );
		return showPromise;
	}

	/**
	Overload of the BaseDialog.canClose ( ) method. Verify that the url is valid and the iconContent completed
	@return {Boolean} true when the url is valid and the iconContent completed
	*/

	canClose ( ) {
		if ( '' === this.#iconControl.value ) {
			this.showError ( theTranslator.getText ( 'Notedialog - The icon content cannot be empty' ) );
			return false;
		}
		if ( '' !== this.#linkControl.url ) {
			if ( '' === theHTMLSanitizer.sanitizeToUrl ( this.#linkControl.url ).url ) {
				this.showError ( theTranslator.getText ( 'NoteDialog - invalidUrl' ) );
				return false;
			}
		}

		return true;
	}

	/**
	Overload of the BaseDialog.onCancel ( ) method.
	*/

	onCancel ( ) {
		this.#destructor ( );
		super.onCancel ( );
	}

	/**
	Overload of the BaseDialog.onOk ( ) method.
	*/

	onOk ( ) {
		if ( super.onOk ( ) ) {

			// saving values in the note.
			this.#note.iconWidth = this.#iconDimsControl.iconWidth;
			this.#note.iconHeight = this.#iconDimsControl.iconHeight;
			this.#note.iconContent = this.#iconControl.value;
			this.#note.tooltipContent = this.#tooltipControl.value;
			this.#note.popupContent = this.#popupControl.value;
			this.#note.address = this.#addressControl.address;
			this.#note.url = this.#linkControl.url;
			this.#note.phone = this.#phoneControl.value;

			// latLng can change for map icons, so we save the value from the preview note
			this.#note.latLng = this.#previewNote.latLng;

			this.#destructor ( );
		}
	}

	/**
	The dialog title. Overload of the BaseDialog.title property
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'NoteDialog - Note' ); }

	/**
	An HTMLElement that have to be added as toolbar for the dialog.
	Overload of the BaseDialog.toolbarHTMLElement property
	@type {HTMLElement}
	*/

	get toolbarHTMLElement ( ) {
		return this.#toolbar.rootHTMLElement;
	}

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	Overload of the BaseDialog.contentHTMLElements property
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [
			this.#iconDimsControl.controlHTMLElement,
			this.#iconControl.controlHTMLElement,
			this.#tooltipControl.controlHTMLElement,
			this.#popupControl.controlHTMLElement,
			this.#addressControl.controlHTMLElement,
			this.#linkControl.controlHTMLElement,
			this.#phoneControl.controlHTMLElement
		];
	}

	/**
	An array with the HTMLElements that have to be added in the footer of the dialog
	Overload of the BaseDialog.footerHTMLElements property
	@type {Array.<HTMLElement>}
	*/

	get footerHTMLElements ( ) {
		return this.#previewControl.HTMLElements;
	}

	/**
	set the control's values
	@param {Object} source An object with all the properties to update
	*/

	setControlsValues ( source ) {
		this.#iconDimsControl.iconHeight = source.iconHeight || this.#iconDimsControl.iconHeight;
		this.#iconDimsControl.iconWidth = source.iconWidth || this.#iconDimsControl.iconWidth;
		this.#iconControl.value = source.iconContent || this.#iconControl.value;
		this.#tooltipControl.value = source.tooltipContent || this.#tooltipControl.value;
		this.#popupControl.value = source.popupContent || this.#popupControl.value;
		this.#addressControl.address = source.address || this.#addressControl.address;
		this.#linkControl.url = source.url || this.#linkControl.url;
		this.#phoneControl.value = source.phone || this.#phoneControl.value;
	}

	/**
	Update the toolbar after an upload of a config file
	*/

	updateToolbar ( ) {
		this.#toolbar.update ( this.#eventListeners );
	}

}

export default NoteDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */