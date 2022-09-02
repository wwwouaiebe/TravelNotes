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
import ResetAdressButtonClickEL from './ResetAdressButtonClickEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the address control of the waypoint properties dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class WayPointAddressControl extends BaseControl {

	/**
	The reset address button
	@type {HTMLElement}
	*/

	#resetAddressButton;

	/**
	The click event listener for the reset address button
	@type {ResetAdressButtonClickEL}
	*/

	#resetAdressButtonClickEL;

	/**
	The reset address button
	@type {HTMLElement}
	*/

	#addressInput;

	/**
	The constructor
	@param {wayPointPropertiesDialog} wayPointPropertiesDialog A reference to the dialog
	 */

	constructor ( wayPointPropertiesDialog ) {
		super ( );
		const addressHeaderDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FlexRow'
			},
			this.controlHTMLElement
		);
		this.#resetAddressButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'WayPointPropertiesDialog - Reset address' ),
				textContent : '🔄'
			},
			addressHeaderDiv
		);
		this.#resetAdressButtonClickEL = new ResetAdressButtonClickEL ( wayPointPropertiesDialog );
		this.#resetAddressButton.addEventListener ( 'click', this.#resetAdressButtonClickEL, false );
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'WayPointPropertiesDialog - Address' )
			},
			addressHeaderDiv
		);

		this.#addressInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'text',
				className : 'TravelNotes-WayPointPropertiesDialog-InputText'
			},
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseDialog-FlexRow'
				},
				this.controlHTMLElement
			)
		);
	}

	/**
	destructor
	*/

	destructor ( ) {
		this.#resetAdressButtonClickEL.destructor ( );
		this.#resetAddressButton.removeEventListener ( 'click', this.#resetAdressButtonClickEL, false );
	}

	/**
	The address in the control
	@type {String}
	*/

	get address ( ) { return this.#addressInput.value; }

	set address ( Value ) { this.#addressInput.value = Value; }

}

export default WayPointAddressControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */