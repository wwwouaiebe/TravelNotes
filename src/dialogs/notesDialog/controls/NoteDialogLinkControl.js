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

import theHTMLElementsFactory from '../../../core/uiLib/HTMLElementsFactory.js';
import theTranslator from '../../../core/uiLib/Translator.js';
import theConfig from '../../../data/Config.js';
import BaseControl from '../../../controls/baseControl/BaseControl.js';
import TouchInputEL from '../../../mouseAndTouchEL/TouchInputEL.js';
import NoteDialogLinkButtonEL from './NoteDialogLinkButtonEL.js';
import { ZERO, ONE, LAT_LNG } from '../../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the url control of the NoteDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialogLinkControl extends BaseControl {

	/**
	The link input
	@type {HTMLElement}
	*/

	#linkInput;

	/**
	The input touch event listener for the link input
	@type {TouchInputEL}
	*/

	#linkInputEL;

	/**
	The event listener for the devil button
	@type {NoteDialogLinkButtonEL}
	*/

	#theDevilButtonEL;

	/**
	The devil button
	@type {HTMLElement}
	*/

	#theDevilButton;

	/**
	get the url to use with the devil button
	@param {Array.<Number>} latLng the lat and lng to use
	@return {string} the url to use
	*/

	#getDevilUrl ( latLng ) {
		return 'https://www.google.com/maps/@' +
		latLng [ ZERO ].toFixed ( LAT_LNG.fixed ) + ',' +
		latLng [ ONE ].toFixed ( LAT_LNG.fixed ) + ',' +
		theConfig.noteDialog.theDevil.zoomFactor + 'z';
	}

	/**
	The 👿 button...
	@param {Array.<Number>} latLng The lat and lng used in the 👿 button
	@param {HTMLElement} linkHeaderDiv The HTMLElement in witch the button will be created
	*/

	#createTheDevilButton ( latLng, linkHeaderDiv ) {
		if ( theConfig.noteDialog.theDevil.addButton ) {
			this.#theDevilButton = theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseDialog-Button',
					title : 'Reminder! The devil will know everything about you',
					textContent : '👿'
				},
				linkHeaderDiv
			);
			this.#theDevilButtonEL = new NoteDialogLinkButtonEL ( this.#getDevilUrl ( latLng ) );
			this.#theDevilButtonEL.addEventListeners ( this.#theDevilButton );
		}
	}

	/**
	The constructor
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	@param {Array.<Number>} latLng The lat and lng to use with the 👿 button
	*/

	constructor ( eventListeners, latLng ) {
		super ( );

		// HTMLElements creation
		const linkHeaderControlElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FlexRow'
			},
			this.controlHTMLElement
		);
		this.#createTheDevilButton ( latLng, linkHeaderControlElement );
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'NoteDialogLinkControl - Link' )
			},
			linkHeaderControlElement
		);
		this.#linkInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'text',
				className : 'TravelNotes-NoteDialog-InputText',
				dataset : { Name : 'url' }
			},
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseDialog-FlexRow'
				},
				this.controlHTMLElement
			)
		);
		this.#linkInputEL = new TouchInputEL ( );
		this.#linkInputEL.addEventListeners ( this.#linkInput );

		// event listeners
		this.#linkInput.addEventListener ( 'focus', eventListeners.controlFocus );
		this.#linkInput.addEventListener ( 'input', eventListeners.controlInput );
		this.#linkInput.addEventListener ( 'blur', eventListeners.urlInputBlur );
	}

	/**
	Remove event listeners
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	destructor ( eventListeners ) {
		this.#linkInput.removeEventListener ( 'focus', eventListeners.controlFocus );
		this.#linkInput.removeEventListener ( 'input', eventListeners.controlInput );
		this.#linkInput.removeEventListener ( 'blur', eventListeners.urlInputBlur );
		this.#linkInputEL.removeEventListeners ( this.#linkInput );
		this.#linkInputEL = null;
		if ( theConfig.noteDialog.theDevil.addButton ) {
			this.#theDevilButtonEL.removeEventListeners ( this.#theDevilButton );
			this.#theDevilButtonEL = null;
		}
	}

	/**
	The url value in the control
	@type {String}
	*/

	get url ( ) { return this.#linkInput.value; }

	set url ( Value ) { this.#linkInput.value = Value; }

}

export default NoteDialogLinkControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */