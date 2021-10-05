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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file NoteDialogLinkControl.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module dialogNotes
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTranslator from '../UILib/Translator.js';
import theConfig from '../data/Config.js';

import { ZERO, ONE, LAT_LNG } from '../main/Constants.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class NoteDialogLinkControl
@classdesc This class is the url control of the NoteDialog
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class NoteDialogLinkControl {

	/**
	HTMLElements
	@type {htmlElement}
	@private
	*/

	#linkHeaderDiv = null;
	#linkInputDiv = null;
	#linkInput = null;

	/**
	The 👿 button...
	@param {Array.<!number>} latLng The lat and lng used in the 👿 button
	@private
	*/

	#createTheDevilButton ( latLng ) {
		if ( theConfig.noteDialog.theDevil.addButton ) {
			theHTMLElementsFactory.create (
				'text',
				{
					value : '👿'
				},
				theHTMLElementsFactory.create (
					'a',
					{
						href : 'https://www.google.com/maps/@' +
							latLng [ ZERO ].toFixed ( LAT_LNG.fixed ) + ',' +
							latLng [ ONE ].toFixed ( LAT_LNG.fixed ) + ',' +
							theConfig.noteDialog.theDevil.zoomFactor + 'z',
						target : '_blank',
						title : 'Reminder! The devil will know everything about you'
					},
					theHTMLElementsFactory.create (
						'div',
						{
							className : 'TravelNotes-BaseDialog-Button',
							title : 'Reminder! The devil will know everything about you'
						},
						this.#linkHeaderDiv
					)
				)
			);
		}
	}

	/*
	constructor
	@param {NoteDialog} noteDialog A reference to the dialog in witch the control is integrated
	@param {Array.<number>} latLng The lat and lng to use with the 👿 button
	*/

	constructor ( eventListeners, latLng ) {

		Object.freeze ( this );

		// HTMLElements creation
		this.#linkHeaderDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-NoteDialog-DataDiv'
			}
		);

		this.#createTheDevilButton ( latLng );

		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'NoteDialog - Link' )
			},
			this.#linkHeaderDiv
		);

		this.#linkInputDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-NoteDialog-DataDiv'
			}
		);

		this.#linkInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'text',
				className : 'TravelNotes-NoteDialog-InputText',
				dataset : { Name : 'url' }
			},
			this.#linkInputDiv
		);

		// event listeners
		this.#linkInput.addEventListener ( 'focus', eventListeners.controlFocus );
		this.#linkInput.addEventListener ( 'input', eventListeners.controlInput );
		this.#linkInput.addEventListener ( 'blur', eventListeners.urlInputBlur );
	}

	/**
	Remove event listeners
	*/

	destructor ( eventListeners ) {
		this.#linkInput.removeEventListener ( 'focus', eventListeners.controlFocus );
		this.#linkInput.removeEventListener ( 'input', eventListeners.controlInput );
		this.#linkInput.removeEventListener ( 'blur', eventListeners.urlInputBlur );
	}

	/**
	An array with the HTML elements of the control
	@type {Array.<HTMLElement>}
	@readonly
	*/

	get HTMLElements ( ) { return [ this.#linkHeaderDiv, this.#linkInputDiv ]; }

	/**
	The url value in the control
	@type {string}
	*/

	get url ( ) { return this.#linkInput.value; }

	set url ( Value ) { this.#linkInput.value = Value; }

}

export default NoteDialogLinkControl;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of NoteDialogLinkControl.js file

@------------------------------------------------------------------------------------------------------------------------------
*/