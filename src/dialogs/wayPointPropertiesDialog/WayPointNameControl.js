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
	- v1.12.0:
		- created
	- v2.0.0:
		- Issue ♯135 : Remove innerHTML from code
		- Issue ♯138 : Protect the app - control html entries done by user.
	- v2.2.0:
		- Issue ♯64 : Improve geocoding
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import theHTMLElementsFactory from '../../UILib/HTMLElementsFactory.js';
import theTranslator from '../../UILib/Translator.js';
import BaseControl from '../../baseControl/BaseControl.js';

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