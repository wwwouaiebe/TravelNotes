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
	- v1.9.0:
		- created
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v3.4.0:
		- Issue ♯24 : Review the print process
Doc reviewed 20210914
Tests ...
*/

import theTranslator from '../UILib/Translator.js';
import theConfig from '../data/Config.js';
import BaseDialog from '../dialogBase/BaseDialog.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import { ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
An object to store the PrintRouteMapDialog options
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PrintRouteMapOptions {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}

	/**
	The paper width option
	@type {Number}
	*/

	paperWidth = ZERO;

	/**
	The paper height option
	@type {Number}
	*/

	paperHeight = ZERO;

	/**
	The border width option
	@type {Number}
	*/

	borderWidth = ZERO;

	/**
	The zoom factor option
	@type {Number}
	*/

	zoomFactor = ZERO;

	/**
	The print notes option
	@type {Boolean}
	*/

	printNotes = false;

	/**
	The used browser ( true = firefox; false = others browsers )
	@type {Boolean}
	 */

	firefoxBrowser = true;
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class create and manage the print route map dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PrintRouteMapDialog extends BaseDialog {

	/**
	The paper width input
	@type {HTMLElement}
	*/

	#paperWidthInput;

	/**
	The paper height input
	@type {HTMLElement}
	*/

	#paperHeightInput;

	/**
	The border width input
	@type {HTMLElement}
	*/

	#borderWidthInput;

	/**
	The print notes input
	@type {HTMLElement}
	*/

	#printNotesInput;

	/**
	The zoom factor input
	@type {HTMLElement}
	*/

	#zoomFactorInput;

	/**
	The Firefox browser input
	@type {HTMLElement}
	*/

	#firefoxBrowserInput;

	/**
	The greatest acceptable zoom to avoid to mutch tiles asked to OSM
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MAX_ZOOM ( ) { return 15; }

	/**
	Create the paper width div
	@return {HTMLElement} the paper width div
	*/

	#createPaperWidthDiv ( ) {
		const paperWidthDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-PrintRouteMapDialog-DataDiv'
			}
		);
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'PrintRouteMapDialog - Paper width' )
			},
			paperWidthDiv
		);
		this.#paperWidthInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'number',
				className : 'TravelNotes-PrintRouteMapDialog-NumberInput'
			},
			paperWidthDiv
		);
		this.#paperWidthInput.value = theConfig.printRouteMap.paperWidth;
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'PrintRouteMapDialog - Paper width units' )
			},
			paperWidthDiv
		);

		return paperWidthDiv;
	}

	/**
	Create the paper height div
	@return {HTMLElement} the paper height div
	*/

	#createPaperHeightDiv ( ) {
		const paperHeightDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-PrintRouteMapDialog-DataDiv'
			}
		);
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'PrintRouteMapDialog - Paper height' )
			},
			paperHeightDiv
		);
		this.#paperHeightInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'number',
				className : 'TravelNotes-PrintRouteMapDialog-NumberInput',
				value : theConfig.printRouteMap.paperHeight
			},
			paperHeightDiv
		);
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'PrintRouteMapDialog - Paper height units' )
			},
			paperHeightDiv
		);

		return paperHeightDiv;
	}

	/**
	Create the border width div
	@return {HTMLElement} the border width div
	*/

	#createBorderWidthDiv ( ) {
		const borderWidthDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-PrintRouteMapDialog-DataDiv'
			}
		);
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'PrintRouteMapDialog - Border width' )
			},
			borderWidthDiv
		);
		this.#borderWidthInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'number',
				className : 'TravelNotes-PrintRouteMapDialog-NumberInput',
				value : theConfig.printRouteMap.borderWidth
			},
			borderWidthDiv
		);
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'PrintRouteMapDialog - Border width units' )
			},
			borderWidthDiv
		);

		return borderWidthDiv;
	}

	/**
	Create the zoom factor div
	@return {HTMLElement} the zoom factor div
	*/

	#createZoomFactorDiv ( ) {
		const zoomFactorDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-PrintRouteMapDialog-DataDiv'
			}
		);
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'PrintRouteMapDialog - Zoom factor' )
			},
			zoomFactorDiv
		);
		this.#zoomFactorInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'number',
				className : 'TravelNotes-PrintRouteMapDialog-NumberInput',
				value : Math.min ( theConfig.printRouteMap.zoomFactor, PrintRouteMapDialog.#MAX_ZOOM ),
				min : theTravelNotesData.map.getMinZoom ( ),
				max : Math.min ( theTravelNotesData.map.getMaxZoom ( ), PrintRouteMapDialog.#MAX_ZOOM )
			},
			zoomFactorDiv
		);

		return zoomFactorDiv;
	}

	/**
	Create the print notes div
	@return {HTMLElement} the print notes div
	*/

	#createPrintNotesDiv ( ) {
		const printNotesDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-PrintRouteMapDialog-DataDiv'
			}
		);
		this.#printNotesInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'checkbox',
				checked : theConfig.printRouteMap.printNotes
			},
			printNotesDiv
		);
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'PrintRouteMapDialog - Print notes' )
			},
			printNotesDiv
		);

		return printNotesDiv;
	}

	/**
	Create the browser div
	@return {HTMLElement} the browser div
	*/

	#createBrowserDiv ( ) {

		const browserDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-PrintRouteMapDialog-DataDiv'
			}
		);

		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'PrintRouteMapDialog - Print with' )
			},
			browserDiv
		);
		this.#firefoxBrowserInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'radio',
				checked : theConfig.printRouteMap.firefoxBrowser,
				id : 'TravelNotes-PrintRouteMapDialog-FirefoxBrowser',
				name : 'Browser'
			},
			browserDiv
		);
		theHTMLElementsFactory.create (
			'label',
			{
				htmlFor : 'TravelNotes-PrintRouteMapDialog-FirefoxBrowser',
				innerText : 'Firefox'
			},
			browserDiv
		);
		theHTMLElementsFactory.create (
			'input',
			{
				type : 'radio',
				checked : ! theConfig.printRouteMap.firefoxBrowser,
				id : 'TravelNotes-PrintRouteMapDialog-OtherBrowser',
				name : 'Browser'
			},
			browserDiv
		);
		theHTMLElementsFactory.create (
			'label',
			{
				htmlFor : 'TravelNotes-PrintRouteMapDialog-OtherBrowser',
				innerText : theTranslator.getText ( 'PrintRouteMapDialog - Another browser' )
			},
			browserDiv
		);

		return browserDiv;
	}

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
	}

	/**
	Overload of the BaseDialog.onOk ( ) method. Called when the Ok button is clicked
	*/

	onOk ( ) {

		const printRouteMapOptions = new PrintRouteMapOptions ( );
		printRouteMapOptions.paperWidth = parseInt ( this.#paperWidthInput.value );
		printRouteMapOptions.paperHeight = parseInt ( this.#paperHeightInput.value );
		printRouteMapOptions.borderWidth = parseInt ( this.#borderWidthInput.value );
		printRouteMapOptions.zoomFactor = parseInt ( this.#zoomFactorInput.value );
		printRouteMapOptions.printNotes = this.#printNotesInput.checked;
		printRouteMapOptions.firefoxBrowser = this.#firefoxBrowserInput.checked;
		Object.freeze ( printRouteMapOptions );

		super.onOk ( printRouteMapOptions );
	}

	/**
	Get an array with the HTMLElements that have to be added in the content of the dialog.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [
			this.#createPaperWidthDiv ( ),
			this.#createPaperHeightDiv ( ),
			this.#createBorderWidthDiv ( ),
			this.#createZoomFactorDiv ( ),
			this.#createPrintNotesDiv ( ),
			this.#createBrowserDiv ( )
		];
	}

	/**
	Return the dialog title. Overload of the BaseDialog.title property
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'PrintRouteMapDialog - Print' ); }

}

export default PrintRouteMapDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */