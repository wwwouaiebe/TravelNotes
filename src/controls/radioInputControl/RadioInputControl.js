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

import BaseControl from '../baseControl/BaseControl.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import TouchInputEL from '../../mouseAndTouchEL/TouchInputEL.js';
import { NOT_FOUND, ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is a generic control with radio input elements
/* ------------------------------------------------------------------------------------------------------------------------- */

class RadioInputControl extends BaseControl {

	/**
	A static field used to give a unique id for each button and for each radio group
	@type {Number}
	*/

	static #objId = ZERO;

	/**
	An array with the radio buttons
	@type {Array.<HTMLElement>}
	*/

	#buttons;

	/**
	The buttons event listeners
	@type {MouseAndTouchBaseEL}
	*/

	#buttonsEL;

	/**
	The constructor
	@param {Object} options An object with the  options ( placeholder, rows, datasetName, headerText )
	*/

	constructor ( options ) {
		super ( );
		this.#buttons = [];
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FlexRow',
				textContent : options?.headerText || ''
			},
			this.controlHTMLElement
		);
		this.#buttonsEL = new TouchInputEL ( );
		let controlName = 'controlName' + ( ++ RadioInputControl.#objId );
		let value = ZERO;
		options.buttons.forEach (
			button => {
				let buttonId = 'buttonId' + ( ++ RadioInputControl.#objId );
				let buttonDiv = theHTMLElementsFactory.create (
					'div',
					{
						className : 'TravelNotes-BaseDialog-FlexRow'
					},
					this.controlHTMLElement
				);
				const buttonHTMLElement = theHTMLElementsFactory.create (
					'input',
					{
						type : 'radio',
						className : 'TravelNotes-RadioInputControl-Radio',
						checked : button.checked,
						id : buttonId,
						name : controlName,
						value : String ( value ++ ),
						dataset : { Name : options?.datasetName || 'RadioInputControl' }
					},
					buttonDiv
				);
				this.#buttonsEL.addEventListeners ( buttonHTMLElement );
				this.#buttons.push ( buttonHTMLElement );
				theHTMLElementsFactory.create (
					'label',
					{
						htmlFor : buttonId,
						innerText : button.label
					},
					buttonDiv
				);
			}
		);
	}

	/**
	The destructor
	*/

	destructor ( ) {
		this.#buttons.forEach (
			button => this.#buttonsEL.removeEventListeners ( button )
		);
	}

	/**
	The value in the control
	@type {String}
	*/

	get value ( ) {
		let value = NOT_FOUND;
		this.#buttons.forEach (
			button => { value = button.checked ? Number.parseInt ( button.value ) : value; }
		);
		return value;
	}
}

export default RadioInputControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */