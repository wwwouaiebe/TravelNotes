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

import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import theTranslator from '../../core/uiLib/Translator.js';
import BaseControl from '../../controls/baseControl/BaseControl.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the name control of the waypoint properties dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class WayPointNameControl extends BaseControl {

	/**
	The name input HTMLElement
	@type {HTMLElement}
	*/

	#nameInput;

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FlexRow',
				textContent : theTranslator.getText ( 'WayPointPropertiesDialog - Name' )
			},
			this.controlHTMLElement
		);
		const nameInputDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FlexRow'
			},
			this.controlHTMLElement
		);
		this.#nameInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'text',
				className : 'TravelNotes-WayPointPropertiesDialog-InputText'
			},
			nameInputDiv
		);
	}

	/**
	The name in the control
	@type {String}
	*/

	get name ( ) { return this.#nameInput.value; }

	set name ( value ) { this.#nameInput.value = value; }

}

export default WayPointNameControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */