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
		- changed message
	- v1.4.0:
		- Replacing DataManager with TravelNotesData, Config, Version and DataSearchEngine
		- added reset button for address
		- added svg icons
		- reviewed code
		- added language for TravelNotesDialogXX.json file
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
		- Issue ♯66 : Work with promises for dialogs
		- Issue ♯68 : Review all existing promises.
		- Issue ♯76 : Add a devil button in the noteDialog.
	- v1.11.0:
		- Issue ♯110 : Add a command to create a SVG icon from osm for each maneuver
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v2.0.0:
		- Issue ♯135 : Remove innerHTML from code
		- Issue ♯138 : Protect the app - control html entries done by user.
		- Issue ♯144 : Add an error message when a bad json file is loaded from the noteDialog
	- v2.2.0:
		- Issue ♯64 : Improve geocoding
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v 4.0.0:
		- Issue ♯48 : Review the dialogs
Doc reviewed 20210913
Tests ...
*/

import ModalBaseDialog from '../baseDialog/ModalBaseDialog.js';
import NoteDialogToolbar from '../notesDialog/NoteDialogToolbar.js';
import NoteDialogIconDimsControl from '../notesDialog/NoteDialogIconDimsControl.js';
import NoteDialogIconControl from '../notesDialog/NoteDialogIconControl.js';
import NoteDialogTooltipControl from '../notesDialog/NoteDialogTooltipControl.js';
import NoteDialogPopupControl from '../notesDialog/NoteDialogPopupControl.js';
import NoteDialogAddressControl from '../notesDialog/NoteDialogAddressControl.js';
import NoteDialogLinkControl from '../notesDialog/NoteDialogLinkControl.js';
import NoteDialogPhoneControl from '../notesDialog/NoteDialogPhoneControl.js';
import NoteDialogPreviewControl from '../notesDialog/NoteDialogPreviewControl.js';
import NoteDialogEventListeners from '../notesDialog/NoteDialogEventListeners.js';
import NoteDialogGeoCoderHelper from '../notesDialog/NoteDialogGeoCoderHelper.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import theTranslator from '../UILib/Translator.js';
import Note from '../data/Note.js';
import MapIconData from '../notesDialog/MapIconData.js';

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
	A boolean indicating to start the geocoder when opening the dialog box.
	@type {Boolean}
	*/

	#startGeoCoder;

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
	@type {NoteDialogIconControl}
	*/

	#iconControl;

	/**
	The tooltip control
	@type {NoteDialogTooltipControl}
	*/

	#tooltipControl;

	/**
	The popup control
	@type {NoteDialogPopupControl}
	*/

	#popupControl;

	/**
	The address control
	@type {NoteDialogAddressControl}
	*/

	#addressControl;

	/**
	The link control
	@type {NoteDialogLinkControl}
	*/

	#linkControl;

	/**
	The phone control
	@type {NoteDialogPhoneControl}
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

		this.#startGeoCoder = '' === this.#note.address;
		this.#eventListeners = new NoteDialogEventListeners ( this, note.latLng );

		// Cloning the note
		this.#previewNote = new Note ( );
		this.#previewNote.jsonObject = note.jsonObject;

		// creting toolbar and controls
		this.#toolbar = new NoteDialogToolbar ( this.#eventListeners );
		this.#iconDimsControl = new NoteDialogIconDimsControl ( this.#eventListeners );
		this.#iconControl = new NoteDialogIconControl ( this.#eventListeners );
		this.#tooltipControl = new NoteDialogTooltipControl ( this.#eventListeners );
		this.#popupControl = new NoteDialogPopupControl ( this.#eventListeners );
		this.#addressControl = new NoteDialogAddressControl ( this.#eventListeners, this.#startGeoCoder );
		this.#linkControl = new NoteDialogLinkControl ( this.#eventListeners, note.latLng );
		this.#phoneControl = new NoteDialogPhoneControl ( this.#eventListeners );
		this.#previewControl = new NoteDialogPreviewControl ( this.#previewNote );

		// copy the notes values into the controls
		this.setControlsValues ( note );
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
		const dialogPromise = super.show ( );
		if ( this.#startGeoCoder ) {
			new NoteDialogGeoCoderHelper ( this ).setAddressWithGeoCoder ( this.#previewNote.latLng );
		}
		return dialogPromise;
	}

	/**
	Overload of the BaseDialog.canClose ( ) method. Verify that the url is valid and the iconContent completed
	@return {Boolean} true when the url is valid and the iconContent completed
	*/

	canClose ( ) {
		if ( '' === this.#iconControl.iconContent ) {
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
			this.#note.iconContent = this.#iconControl.iconContent;
			this.#note.tooltipContent = this.#tooltipControl.tooltipContent;
			this.#note.popupContent = this.#popupControl.popupContent;
			this.#note.address = this.#addressControl.address;
			this.#note.url = this.#linkControl.url;
			this.#note.phone = this.#phoneControl.phone;

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
		return [].concat (
			this.#iconDimsControl.controlHTMLElement,
			this.#iconControl.controlHTMLElement,
			this.#tooltipControl.controlHTMLElement,
			this.#popupControl.controlHTMLElement,
			this.#addressControl.controlHTMLElement,
			this.#linkControl.controlHTMLElement,
			this.#phoneControl.controlHTMLElement
		);
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
		this.#iconControl.iconContent = source.iconContent || this.#iconControl.iconContent;
		this.#tooltipControl.tooltipContent = source.tooltipContent || this.#tooltipControl.tooltipContent;
		this.#popupControl.popupContent = source.popupContent || this.#popupControl.popupContent;
		this.#addressControl.address = source.address || this.#addressControl.address;
		this.#linkControl.url = source.url || this.#linkControl.url;
		this.#phoneControl.phone = source.phone || this.#phoneControl.phone;
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