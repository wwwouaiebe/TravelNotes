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

@file NoteDialogTooltipControl.js
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

/**
@------------------------------------------------------------------------------------------------------------------------------

@class NoteDialogTooltipControl
@classdesc This class is the tooltipContent control of the NoteDialog
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class NoteDialogTooltipControl {

	/**
	HTMLElements
	@type {htmlElement}
	@private
	*/

	#tooltipDiv = null;
	#tooltipInput = null

	/**
	Event listeners
	@type {object}
	@private
	*/

	#allControlsFocusEL = null;
	#allControlsInputEL = null;

	/*
	constructor
	@param {NoteDialog} noteDialog A reference to the dialog in witch the control is integrated
	*/

	constructor ( eventListeners ) {

		Object.freeze ( this );

		// HTMLElements creation
		this.#tooltipDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-NoteDialog-DataDiv',
				textContent : theTranslator.getText ( 'NoteDialog - Tooltip content' )
			}
		);
		this.#tooltipInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'text',
				className : 'TravelNotes-NoteDialog-InputText',
				dataset : { Name : 'tooltipContent' }
			},
			this.#tooltipDiv
		);

		// event listeners
		this.#tooltipInput.addEventListener ( 'focus', eventListeners.controlFocus );
		this.#tooltipInput.addEventListener ( 'input', eventListeners.controlInput );
	}

	/**
	Remove event listeners
	*/

	destructor ( eventListeners ) {
		this.#tooltipInput.removeEventListener ( 'focus', eventListeners.controlFocus );
		this.#tooltipInput.removeEventListener ( 'input', eventListeners.controlInput );
	}

	/**
	An array with the HTML elements of the control
	@type {Array.<HTMLElement>}
	@readonly
	*/

	get HTMLElements ( ) { return [ this.#tooltipDiv ]; }

	/**
	the tooltip value in the control
	@type {string}
	*/

	get tooltipContent ( ) { return this.#tooltipInput.value; }

	set tooltipContent ( Value ) { this.#tooltipInput.value = Value; }

}

export default NoteDialogTooltipControl;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of NoteDialogTooltipControl.js file

@------------------------------------------------------------------------------------------------------------------------------
*/