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
import SelectOptionData from './SelectOptionData.js';
import SelectControl from '../../controls/selectControl/SelectControl.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Simple dialog with a select element
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SelectDialog extends ModalBaseDialog {

	/**
	The select control
	@type {SelectControl}
	*/

	#selectControl;

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
		this.#selectControl = new SelectControl (
			{
				elements : Array.from ( this.options.selectOptionsData, optionData => optionData.text )
			}
		);
	}

	/**
	Get the title of the dialog. Can be overloaded in the derived classes
	@type {String}
	*/

	get title ( ) { return this.options.title || ''; }

	/**
	Get an array with the HTMLElements that have to be added in the content of the dialog.
	Can be overloaded in the derived classes
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [ this.#selectControl.controlHTMLElement	];
	}

	/**
	Overload of the BaseDialog.onOk ( ) method.
	*/

	onOk ( ) {
		super.onOk ( this.options.selectOptionsData [ this.#selectControl.selectedIndex ].objId );
	}

}

export { SelectOptionData, SelectDialog };

/* --- End of file --------------------------------------------------------------------------------------------------------- */