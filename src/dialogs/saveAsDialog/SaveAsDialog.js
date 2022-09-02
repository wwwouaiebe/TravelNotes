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

import theTranslator from '../../core/uiLib/Translator.js';
import ModalBaseDialog from '../baseDialog/ModalBaseDialog.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import SaveAsDialogData from './SaveAsDialogData.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A saveAsDialog object completed for making a partial save of the edited travel
Create an instance of the dialog, then execute the show ( ) method. The selected values are returned as parameter of the
succes handler of the Promise returned by the show ( ) method.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SaveAsDialog extends ModalBaseDialog {

	/**
	The remove travel notes input
	@type {HTMLElement}
	*/

	#removeTravelNotesInput;

	/**
	The remove route notes input
	@type {HTMLElement}
	*/

	#removeRoutesNotesInput;

	/**
	The remove maneuvers input
	@type {HTMLElement}
	*/

	#removeManeuversInput;

	/**
	The remove travel notes div
	@type {HTMLElement}
	*/

	#removeTravelNotesDiv;

	/**
	The remove route notes div
	@type {HTMLElement}
	*/

	#removeRoutesNotesDiv;

	/**
	The remove maneuvers div
	@type {HTMLElement}
	*/

	#removeManeuversDiv;

	/**
	Create an input div and an input HTMLelements
	@param {String} inputText The text to display near the input
	@return {Array.<HTMLElement>} An array with the div and the input HTMLelement
	*/

	#createInputDiv ( inputText ) {
		const inputDiv = theHTMLElementsFactory.create ( 'div', null );
		const input = theHTMLElementsFactory.create (
			'input',
			{
				type : 'checkbox',
				checked : false
			},
			inputDiv
		);
		theHTMLElementsFactory.create ( 'text', { value : inputText }, inputDiv );
		return [ inputDiv, input ];
	}

	/**
	The constructor
	@param {BaseDialogOptions|Object} options An Object with the needed options. See DialogOptions class.
	*/

	constructor ( options ) {
		super ( options );
		[ this.#removeTravelNotesDiv, this.#removeTravelNotesInput ] =
			this.#createInputDiv ( theTranslator.getText ( 'SaveAsDialog - Remove Travel Notes' ) );
		[ this.#removeRoutesNotesDiv, this.#removeRoutesNotesInput ] =
			this.#createInputDiv ( theTranslator.getText ( 'SaveAsDialog - Remove Routes Notes' ) );
		[ this.#removeManeuversDiv, this.#removeManeuversInput ] =
			this.#createInputDiv ( theTranslator.getText ( 'SaveAsDialog - Remove Maneuvers' ) );
	}

	/**
	Ok button handler.
	*/

	onOk ( ) {
		super.onOk (
			new SaveAsDialogData (
				this.#removeTravelNotesInput.checked,
				this.#removeRoutesNotesInput.checked,
				this.#removeManeuversInput.checked
			)
		);
	}

	/**
	Get an array with the HTMLElements that have to be added in the content of the dialog.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [
			this.#removeTravelNotesDiv,
			this.#removeRoutesNotesDiv,
			this.#removeManeuversDiv
		];
	}

	/**
	Get the title of the dialog
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'SaveAsDialog - SaveAs' ); }

}

export default SaveAsDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */