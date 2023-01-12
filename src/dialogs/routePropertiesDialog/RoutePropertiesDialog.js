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
import theTranslator from '../../core/uiLib/Translator.js';
import CheckboxInputControl from '../../controls/checkboxInputControl/CheckboxInputControl.js';
import ColorControl from '../../controls/colorControl/ColorControl.js';
import NumberInputControl from '../../controls/numberInputControl/NumberInputControl.js';
import TextInputControl from '../../controls/textInputControl/TextInputControl.js';
import SelectControl from '../../controls/selectControl/SelectControl.js';
import theConfig from '../../data/Config.js';
import { ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the route properties dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RoutePropertiesDialog extends ModalBaseDialog {

	/**
	A reference to the route
	@type {Route}
	*/

	#route;

	/**
	The colorControl object used in the dialog
	@type {ColorControl}
	*/

	#colorControl;

	/**
	The route name control
	@type {TextInputControl}
	*/

	#routeNameControl;

	/**
	The route width control in the dialog
	@type {NumberInputControl}
	*/

	#routeWidthControl;

	/**
	The route dash control in the dialog
	@type {SelectControl}
	*/

	#dashSelectControl;

	/**
	The chained route check box control in the dialog
	@type {CheckboxInputControl}
	*/

	#chainedRouteControl;

	/**
	The minimal width for a Route polyline
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #ROUTE_MIN_WIDTH ( ) { return 1; }

	/**
	The maximal width for a Route polyline
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #ROUTE_MAX_WIDTH ( ) { return 40; }

	/**
	This method creates the color header div
	*/

	/**
	The constructor
	@param {Route} route The route for witch the properties are edited
	*/

	constructor ( route ) {
		super ( );
		this.#route = route;
	}

	/**
	Create all the controls needed for the dialog.
	Overload of the base class createContentHTML
	*/

	createContentHTML ( ) {
		this.#routeNameControl = new TextInputControl (
			{
				headerText : theTranslator.getText ( 'RoutePropertiesDialog - Name' ),
				value : this.#route.computedName
			}
		);
		this.#routeWidthControl = new NumberInputControl (
			{
				beforeText : theTranslator.getText ( 'RoutePropertiesDialog - Width' ),
				value : this.#route.width,
				min : RoutePropertiesDialog.#ROUTE_MIN_WIDTH,
				max : RoutePropertiesDialog.#ROUTE_MAX_WIDTH
			}
		);
		this.#dashSelectControl = new SelectControl (
			{
				beforeText : theTranslator.getText ( 'RoutePropertiesDialog - Linetype' ),
				elements : Array.from ( theConfig.route.dashChoices, dashChoice => dashChoice.text )
			}
		);
		this.#dashSelectControl.selectedIndex =
			this.#route.dashIndex < theConfig.route.dashChoices.length
				?
				this.#route.dashIndex
				:
				ZERO;
		this.#chainedRouteControl = new CheckboxInputControl (
			{
				beforeText : theTranslator.getText ( 'RoutePropertiesDialog - Chained route' ),
				checked : this.#route.chain
			}
		);
		this.#colorControl = new ColorControl (
			{
				cssColor : this.#route.color,
				headerText : theTranslator.getText ( 'RoutePropertiesDialog - Color' )
			}
		);
	}

	/**
	Overload of the ModalBaseDialog.show ( ) method.
	*/

	show ( ) {
		let showPromise = super.show ( );
		this.addCssClass ( 'TravelNotes-RoutePropertiesDialog' );
		return showPromise;
	}

	/**
	Overload of the BaseDialog.onCancel ( ) method.
	*/

	onCancel ( ) {
		this.#colorControl.destructor ( );
		super.onCancel ( );
	}

	/**
	Overload of the BaseDialog.onOk ( ) method. Called when the Ok button is clicked.
	Push the new route properties in the route and validate the route
	*/

	onOk ( ) {

		this.#route.color = this.#colorControl.cssColor;
		if ( this.#route.computedName !== this.#routeNameControl.value ) {
			this.#route.name = this.#routeNameControl.value;
		}
		this.#route.width = this.#routeWidthControl.value;
		this.#route.chain = this.#chainedRouteControl.checked;
		this.#route.dashIndex = this.#dashSelectControl.selectedIndex;
		this.#colorControl.destructor ( );

		super.onOk ( );
	}

	/**
	Get the title of the dialog
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'RoutePropertiesDialog - Route properties' ); }

	/**
	Overload of the BaseDialog.contentHTMLElements property.
	Get an array with the HTMLElements that have to be added in the content of the dialog.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [
			this.#routeNameControl.controlHTMLElement,
			this.#routeWidthControl.controlHTMLElement,
			this.#dashSelectControl.controlHTMLElement,
			this.#chainedRouteControl.controlHTMLElement,
			this.#colorControl.controlHTMLElement
		];
	}
}

export default RoutePropertiesDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */