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

import BaseDialog from '../dialogBase/BaseDialog.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTranslator from '../UILib/Translator.js';
import GeoCoder from '../coreLib/GeoCoder.js';
import theConfig from '../data/Config.js';

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
	The address input HTMLElement
	@type {HTMLElement}
	*/

	#addressInput;

	/**
	The reser address button
	@type {HTMLElement}
	*/

	#resetAddressButton;

	/**
	The name input HTMLElement
	@type {HTMLElement}
	*/

	#nameInput;

	/**
	Click on the reset address button event listener
	@param {Event} clickEvent The event to handle
	*/

	async handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		if ( ! theConfig.wayPoint.reverseGeocoding ) {
			return;
		}
		this.showWait ( );
		const address = await new GeoCoder ( ).getAddressAsync ( this.#wayPoint.latLng );
		this.hideWait ( );
		if ( theConfig.wayPoint.geocodingIncludeName ) {
			this.#nameInput.value = address.name;
		}
		let addressString = address.street;
		if ( '' !== address.city ) {
			addressString += ' ' + address.city;
		}
		this.#addressInput.value = addressString;
	}

	/**
	Create the address control HTMLElements
	*/

	#createAddressControl ( ) {
		const addressHeaderDiv = theHTMLElementsFactory.create ( 'div' );
		this.#resetAddressButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'WayPointPropertiesDialog - Reset address' ),
				textContent : '🔄'
			},
			addressHeaderDiv
		);
		this.#resetAddressButton.addEventListener ( 'click', this, false ); // You understand?
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'WayPointPropertiesDialog - Address' )
			},
			addressHeaderDiv
		);

		const addressInputDiv = theHTMLElementsFactory.create ( 'div' );
		this.#addressInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'text',
				value : this.#wayPoint.address,
				className : 'TravelNotes-WayPointPropertiesDialog-Input'
			},
			addressInputDiv
		);

		return [ addressHeaderDiv, addressInputDiv ];
	}

	/**
	Create the name control HTMLElements
	*/

	#createNameControl ( ) {
		const nameHeaderDiv = theHTMLElementsFactory.create (
			'div',
			{
				textContent : theTranslator.getText ( 'WayPointPropertiesDialog - Name' )
			}
		);
		const nameInputDiv = theHTMLElementsFactory.create ( 'div' );
		this.#nameInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'text',
				value : this.#wayPoint.name,
				className : 'TravelNotes-WayPointPropertiesDialog-Input'
			},
			nameInputDiv
		);

		return [ nameHeaderDiv, nameInputDiv ];
	}

	/**
	The constructor
	@param {WayPoint} wayPoint The wayPoint to modify
	*/

	constructor ( wayPoint ) {
		super ( );
		this.#wayPoint = wayPoint;

	}

	/**
	Overload of the BaseDialog.onCancel ( ) method.
	*/

	onCancel ( ) {
		this.#resetAddressButton.removeEventListener ( 'click', this, false	);
		super.onCancel ( );
	}

	/**
	Overload of the BaseDialog.onOk ( ) method. Called when the Ok button is clicked
	*/

	onOk ( ) {
		this.#wayPoint.address = this.#addressInput.value;
		this.#wayPoint.name = this.#nameInput.value;
		this.#resetAddressButton.removeEventListener ( 'click', this, false	);
		super.onOk ( );
	}

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	Overload of the BaseDialog contentHTMLElements property.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [ ].concat (
			this.#createNameControl ( ),
			this.#createAddressControl ( )
		);
	}

	/**
	The title of the dialog. Overload of the BaseDialog title property.
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'WayPointPropertiesDialog - Waypoint properties' ); }
}

export default WayPointPropertiesDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */