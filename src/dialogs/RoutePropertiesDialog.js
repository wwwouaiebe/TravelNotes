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
	- v1.0.0:
		- created
	- v1.1.0:
		- Issue ♯36: Add a linetype property to route
	- v1.4.0:
		- Replacing DataManager with TravelNotesData, Config, Version and DataSearchEngine
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
		- Issue ♯66 : Work with promises for dialogs
		- Issue ♯63 : Find a better solution for provider keys upload
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v3.2.0:
		- Issue ♯4 : Line type and line width for routes are not adapted on the print views
Doc reviewed 20210914
ests ...
*/

import BaseDialog from '../dialogBase/BaseDialog.js';
import theTranslator from '../UILib/Translator.js';
import ColorControl from '../dialogColorControl/ColorControl.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theConfig from '../data/Config.js';
import { ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the route properties dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RoutePropertiesDialog extends BaseDialog {

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
	The route name input in the dialog
	@type {HTMLElement}
	*/

	#nameInput;

	/**
	The route width input in the dialog
	@type {HTMLElement}
	*/

	#widthInput;

	/**
	The route dash select in the dialog
	@type {HTMLElement}
	*/

	#dashSelect;

	/**
	The route chain check box in the dialog
	@type {HTMLElement}
	*/

	#chainInput;

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
	This method creates the name div
	*/

	#createNameDiv ( ) {
		const nameHeaderDiv = theHTMLElementsFactory.create (
			'div',
			{
				textContent : theTranslator.getText ( 'RoutePropertiesDialog - Name' )
			}
		);
		const nameInputDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-RoutePropertiesDialog-DataDiv',
				id : 'TravelNotes-RoutePropertiesDialog-NameInputDiv'
			}
		);
		this.#nameInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'text',
				id : 'TravelNotes-RoutePropertiesDialog-NameInput',
				value : this.#route.computedName
			},
			nameInputDiv
		);
		return [ nameHeaderDiv, nameInputDiv ];
	}

	/**
	This method creates the route width div
	*/

	#createWidthDiv ( ) {
		const widthDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-RoutePropertiesDialog-DataDiv'
			}
		);
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'RoutePropertiesDialog - Width' )
			},
			theHTMLElementsFactory.create ( 'span', null, widthDiv )
		);

		this.#widthInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'number',
				id : 'TravelNotes-RoutePropertiesDialog-WidthInput',
				value : this.#route.width,
				min : RoutePropertiesDialog.#ROUTE_MIN_WIDTH,
				max : RoutePropertiesDialog.#ROUTE_MAX_WIDTH
			},
			widthDiv
		);

		return widthDiv;
	}

	/**
	This method creates the route dash div
	*/

	#createDashDiv ( ) {
		const dashDiv = theHTMLElementsFactory.create (
			'div',
			{ className : 'TravelNotes-RoutePropertiesDialog-DataDiv' }
		);
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'RoutePropertiesDialog - Linetype' )
			},
			theHTMLElementsFactory.create ( 'span', null, dashDiv )
		);
		this.#dashSelect = theHTMLElementsFactory.create ( 'select', null, dashDiv );
		const dashChoices = theConfig.route.dashChoices;

		dashChoices.forEach (
			dashChoice => {
				this.#dashSelect.add ( theHTMLElementsFactory.create ( 'option', { text : dashChoice.text } ) );
			}
		);
		this.#dashSelect.selectedIndex = this.#route.dashIndex < dashChoices.length ? this.#route.dashIndex : ZERO;
		return dashDiv;
	}

	/**
	This method creates the route chain div
	*/

	#createChainDiv ( ) {
		const chainDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-RoutePropertiesDialog-DataDiv',
				id : 'TravelNotes-RoutePropertiesDialog-ChainDiv'
			}
		);
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'RoutePropertiesDialog - Chained route' )
			},
			theHTMLElementsFactory.create ( 'span', null, chainDiv )
		);

		this.#chainInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'checkbox',
				checked : this.#route.chain
			},
			chainDiv
		);

		return chainDiv;
	}

	/**
	This method creates the color header div
	*/

	#createColorHeaderDiv ( ) {
		return theHTMLElementsFactory.create (
			'div',
			{
				textContent : theTranslator.getText ( 'RoutePropertiesDialog - Color' ),
				id : 'TravelNotes-RoutePropertiesDialog-ColorHeaderDiv'
			}
		);
	}

	/**
	The constructor
	@param {Route} route The route for witch the properties are edited
	*/

	constructor ( route ) {
		super ( );
		this.#route = route;
		this.#colorControl = new ColorControl ( route.color );
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
		if ( this.#route.computedName !== this.#nameInput.value ) {
			this.#route.name = this.#nameInput.value;
		}
		this.#route.width = parseInt ( this.#widthInput.value );
		this.#route.chain = this.#chainInput.checked;
		this.#route.dashIndex = this.#dashSelect.selectedIndex;
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
		return [].concat (
			this.#createNameDiv ( ),
			this.#createWidthDiv ( ),
			this.#createDashDiv ( ),
			this.#createChainDiv ( ),
			this.#createColorHeaderDiv ( ),
			this.#colorControl.HTMLElements
		);
	}
}

export default RoutePropertiesDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */