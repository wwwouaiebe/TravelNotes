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

import BaseDialog from '../baseDialog/BaseDialog.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTranslator from '../UILib/Translator.js';
import GeoCoder from '../coreLib/GeoCoder.js';
import theConfig from '../data/Config.js';
import DialogControl from '../baseDialog/DialogControl.js';

/**
Click event listener for the reset address button
*/

class ResetAdressButtonClickEL {

	/**
	A reference to the dialog
	@type {WayPointPropertiesDialog}
	*/

	#wayPointPropertiesDialog;

	/**
	 the constructor
	 @param {WayPointPropertiesDialog} wayPointPropertiesDialog A reference to the dialog
	 */

	constructor ( wayPointPropertiesDialog ) {
		Object.freeze ( this );
		this.#wayPointPropertiesDialog = wayPointPropertiesDialog;
	}

	/**
	Destructor
	*/

	destructor ( ) {
		this.#wayPointPropertiesDialog = null;
	}

	/**
	Event listener method
	@param {Event} clickEvent the event to handle
	*/

	async handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		if ( ! theConfig.wayPoint.reverseGeocoding ) {
			return;
		}
		this.#wayPointPropertiesDialog.showWait ( );
		const address = await new GeoCoder ( )
			.getAddressAsync ( this.#wayPointPropertiesDialog.wayPoint.latLng );
		this.#wayPointPropertiesDialog.hideWait ( );

		if ( theConfig.wayPoint.geocodingIncludeName ) {
			this.#wayPointPropertiesDialog.name = address.name;
		}

		let addressString = address.street;
		if ( '' !== address.city ) {
			addressString += ' ' + address.city;
		}
		this.#wayPointPropertiesDialog.address = addressString;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the address control of the waypoint properties dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class WayPointAddressControl extends DialogControl {

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
			this.HTMLElement
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
				this.HTMLElement
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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the name control of the waypoint properties dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class WayPointNameControl extends DialogControl {

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
			this.HTMLElement
		);
		const nameInputDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FlexRow'
			},
			this.HTMLElement
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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This is the WayPointProerties dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class WayPointPropertiesDialog extends BaseDialog {

	/**
	A reference to the edited wayPoint
	@type {WayPoint}
	*/

	#wayPoint;

	/**
	The waypoint name control
	@type {WayPointNameControl}
	*/

	#wayPointNameControl;

	/**
	The waypoint address control
	@type {WayPointAddressControl}
	*/

	#wayPointAddressControl;

	/**
	The constructor
	@param {WayPoint} wayPoint The wayPoint to modify
	*/

	constructor ( wayPoint ) {
		super ( );
		this.#wayPoint = wayPoint;
		this.#wayPointNameControl = new WayPointNameControl ( );
		this.#wayPointNameControl.name = this.#wayPoint.name;
		this.#wayPointAddressControl = new WayPointAddressControl ( this );
		this.#wayPointAddressControl.address = this.#wayPoint.address;
	}

	/**
	Overload of the BaseDialog.onCancel ( ) method.
	*/

	onCancel ( ) {

		this.#wayPointAddressControl.destructor ( );
		super.onCancel ( );
	}

	/**
	Overload of the BaseDialog.onOk ( ) method. Called when the Ok button is clicked
	*/

	onOk ( ) {
		this.#wayPoint.address = this.#wayPointAddressControl.address;
		this.#wayPoint.name = this.#wayPointNameControl.name;
		this.#wayPointAddressControl.destructor ( );
		super.onOk ( );
	}

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	Overload of the BaseDialog contentHTMLElements property.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [ ].concat (
			this.#wayPointNameControl.HTMLElement,
			this.#wayPointAddressControl.HTMLElement
		);
	}

	/**
	The name in the control
	*/

	set name ( wayPointName ) {
		this.#wayPointNameControl.name = wayPointName;
	}

	/**
	The address in the control
	*/

	set address ( address ) {
		this.#wayPointAddressControl.address = address;
	}

	/**
	The title of the dialog. Overload of the BaseDialog title property.
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'WayPointPropertiesDialog - Waypoint properties' ); }

	/**
	The waypoint used by the dialog
	@type {WayPoint}
	*/

	get wayPoint ( ) { return this.#wayPoint; }
}

export default WayPointPropertiesDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */