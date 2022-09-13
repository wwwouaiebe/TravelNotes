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

import ModalBaseDialog from '../baseDialog/ModalBaseDialog.js';
import theTranslator from '../../core/uiLib/Translator.js';
import AddressControl from '../../controls/addressControl/AddressControl.js';
import TextInputControl from '../../controls/textInputControl/TextInputControl.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This is the WayPointProerties dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class WayPointPropertiesDialog extends ModalBaseDialog {

	/**
	A reference to the edited wayPoint
	@type {WayPoint}
	*/

	#wayPoint;

	/**
	The waypoint name control
	@type {TextInputControl}
	*/

	#wayPointNameControl;

	/**
	The waypoint address control
	@type {AddressControl}
	*/

	#addressControl;

	/**
	The constructor
	@param {WayPoint} wayPoint The wayPoint to modify
	*/

	constructor ( wayPoint ) {
		super ( );
		this.#wayPoint = wayPoint;
	}

	/**
	Create all the controls needed for the dialog.
	Overload of the base class createContentHTML
	*/

	createContentHTML ( ) {
		this.#wayPointNameControl = new TextInputControl (
			{
				headerText : theTranslator.getText ( 'WayPointPropertiesDialog - Name' )
			}
		);
		this.#addressControl = new AddressControl ( this );
	}

	/**
	Overload of the BaseDialog.onOk ( ) method. Called when the Ok button is clicked
	*/

	onOk ( ) {
		this.#wayPoint.address = this.#addressControl.address;
		this.#wayPoint.name = this.#wayPointNameControl.value;
		super.onOk ( );
	}

	/**
	Overload of the ModalBaseDialog.show ( ) method.
	*/

	show ( ) {
		const showPromise = super.show ( );
		this.#wayPointNameControl.value = this.#wayPoint.name;
		this.#addressControl.address = this.#wayPoint.address;
		return showPromise;
	}

	/**
	The lat and lng of the waypoint. Used by the GeoCoderHelper object of the address control
	@type {Array.<Number>}
	*/

	get latLng ( ) { return this.#wayPoint.latLng; }

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	Overload of the BaseDialog contentHTMLElements property.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [
			this.#wayPointNameControl.controlHTMLElement,
			this.#addressControl.controlHTMLElement
		];
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
		this.#addressControl.address = address;
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

	/**
	Set the control values after an update by the geoCoder
	@param {Object} values The values to push in the controls
	*/

	setControlsValues ( values ) {
		this.#addressControl.address = values.address;
		this.#wayPointNameControl.value = values.name;
	}
}

export default WayPointPropertiesDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */