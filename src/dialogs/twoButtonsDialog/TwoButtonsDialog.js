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

import ModalBaseDialog from '../baseDialog/ModalBaseDialog.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A customizable text dialog with two buttons.
Create an instance of the dialog, then execute the show ( ) method. The Promise returned by the show ( ) method fullfil
when the first button is used and reject when the second button or the cancel button on the topbar is used
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TwoButtonsDialog extends ModalBaseDialog {

	/**
	A html element with the text
	@type {HTMLElement}
	*/

	#textControl;

	/**
	The constructor
	@param {BaseDialogOptions|Object} options An Object with the needed options. See DialogOptions class.
	*/

	constructor ( options ) {
		super ( options );
	}

	/**
	Create all the controls needed for the dialog.
	Overload of the base class createContentHTML
	*/

	createContentHTML ( ) {
		this.#textControl = theHTMLElementsFactory.create (
			'div',
			{
				textContent : this.options.text || ''
			}
		);
	}

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	Overload of the BaseDialog contentHTMLElements property.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [ this.#textControl ];
	}

	/**
	The title of the dialog. Overload of the BaseDialog title property.
	@type {String}
	*/

	get title ( ) { return this.options.title || ''; }
}

export default TwoButtonsDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */