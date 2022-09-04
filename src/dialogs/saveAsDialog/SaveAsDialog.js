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
import CheckboxInputControl from '../../controls/checkboxInputControl/CheckboxInputControl.js';
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
	The remove travel notes control
	@type {CheckboxInputControl}
	*/

	#removeTravelNotesControl;

	/**
	The remove route notes control
	@type {CheckboxInputControl}
	*/

	#removeRouteNotesControl;

	/**
	The remove maneuvers control
	@type {CheckboxInputControl}
	*/

	#removeManeuversControl;

	/**
	The constructor
	@param {BaseDialogOptions|Object} options An Object with the needed options. See DialogOptions class.
	*/

	constructor ( options ) {
		super ( options );
	}

	/**
	Create all the controls needed for the dialog.
	Overload of the vase class createContentHTML
	*/

	createContentHTML ( ) {
		this.#removeTravelNotesControl = new CheckboxInputControl (
			{
				afterText : theTranslator.getText ( 'SaveAsDialog - Remove Travel Notes' ),
				checked : false
			}
		);
		this.#removeRouteNotesControl = new CheckboxInputControl (
			{
				afterText : theTranslator.getText ( 'SaveAsDialog - Remove Routes Notes' ),
				checked : false
			}
		);
		this.#removeManeuversControl = new CheckboxInputControl (
			{
				afterText : theTranslator.getText ( 'SaveAsDialog - Remove Maneuvers' ),
				checked : false
			}
		);

	}

	/**
	Ok button handler.
	*/

	onOk ( ) {
		super.onOk (
			new SaveAsDialogData (
				this.#removeTravelNotesControl.checked,
				this.#removeRouteNotesControl.checked,
				this.#removeManeuversControl.checked
			)
		);
	}

	/**
	Get an array with the HTMLElements that have to be added in the content of the dialog.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [
			this.#removeTravelNotesControl.controlHTMLElement,
			this.#removeRouteNotesControl.controlHTMLElement,
			this.#removeManeuversControl.controlHTMLElement
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