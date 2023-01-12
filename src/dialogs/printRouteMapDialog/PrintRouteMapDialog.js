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

import theTranslator from '../../core/uiLib/Translator.js';
import theConfig from '../../data/Config.js';
import ModalBaseDialog from '../baseDialog/ModalBaseDialog.js';
import theTravelNotesData from '../../data/TravelNotesData.js';
import NumberInputControl from '../../controls/numberInputControl/NumberInputControl.js';
import CheckboxInputControl from '../../controls/checkboxInputControl/CheckboxInputControl.js';
import RadioInputControl from '../../controls/radioInputControl/RadioInputControl.js';
import PrintRouteMapOptions from './PrintRouteMapOptions.js';
import { ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class create and manage the print route map dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PrintRouteMapDialog extends ModalBaseDialog {

	/**
	The paper width input
	@type {NumberInputControl}
	*/

	#paperWidthControl;

	/**
	The paper height input
	@type {NumberInputControl}
	*/

	#paperHeightControl;

	/**
	The border width input
	@type {NumberInputControl}
	*/

	#borderWidthControl;

	/**
	The zoom factor input
	@type {NumberInputControl}
	*/

	#zoomFactorControl;

	/**
	The print notes control
	@type {CheckboxInputControl}
	*/

	#printNotesControl;

	/**
	The Firefox browser control
	@type {RadioInputControl}
	*/

	#firefoxBrowserControl;

	/**
	The greatest acceptable zoom to avoid to mutch tiles asked to OSM
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MAX_ZOOM ( ) { return 15; }

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
	}

	/**
	Create all the controls needed for the dialog.
	Overload of the base class createContentHTML
	*/

	createContentHTML ( ) {
		this.#paperWidthControl = new NumberInputControl (
			{
				beforeText : theTranslator.getText ( 'PrintRouteMapDialog - Paper width' ),
				afterText : theTranslator.getText ( 'PrintRouteMapDialog - Paper width units' ),
				value : theConfig.printRouteMap.paperWidth
			}
		);
		this.#paperHeightControl = new NumberInputControl (
			{
				beforeText : theTranslator.getText ( 'PrintRouteMapDialog - Paper height' ),
				afterText : theTranslator.getText ( 'PrintRouteMapDialog - Paper height units' ),
				value : theConfig.printRouteMap.paperHeight
			}
		);
		this.#borderWidthControl = new NumberInputControl (
			{
				beforeText : theTranslator.getText ( 'PrintRouteMapDialog - Border width' ),
				afterText : theTranslator.getText ( 'PrintRouteMapDialog - Border width units' ),
				value : theConfig.printRouteMap.borderWidth
			}
		);
		this.#zoomFactorControl = new NumberInputControl (
			{
				beforeText : theTranslator.getText ( 'PrintRouteMapDialog - Zoom factor' ),
				value : Math.min ( theConfig.printRouteMap.zoomFactor, PrintRouteMapDialog.#MAX_ZOOM ),
				min : theTravelNotesData.map.getMinZoom ( ),
				max : Math.min ( theTravelNotesData.map.getMaxZoom ( ), PrintRouteMapDialog.#MAX_ZOOM )
			}
		);
		this.#printNotesControl = new CheckboxInputControl (
			{
				afterText : theTranslator.getText ( 'PrintRouteMapDialog - Print notes' ),
				checked : theConfig.printRouteMap.printNotes
			}
		);
		this.#firefoxBrowserControl = new RadioInputControl (
			{
				headerText : theTranslator.getText ( 'PrintRouteMapDialog - Print with' ),
				buttons : [
					{
						label : 'Firefox',
						checked : theConfig.printRouteMap.firefoxBrowser
					},
					{
						label : theTranslator.getText ( 'PrintRouteMapDialog - Another browser' ),
						checked : ! theConfig.printRouteMap.firefoxBrowser
					}
				]
			}
		);
	}

	/**
	Overload of the ModalBaseDialog.show ( ) method.
	*/

	show ( ) {
		let showPromise = super.show ( );
		this.addCssClass ( 'TravelNotes-PrintRouteMapDialog' );
		return showPromise;
	}

	/**
	Overload of the BaseDialog.onOk ( ) method. Called when the Ok button is clicked
	*/

	onOk ( ) {
		const printRouteMapOptions = new PrintRouteMapOptions ( );
		printRouteMapOptions.paperWidth = this.#paperWidthControl.value;
		printRouteMapOptions.paperHeight = this.#paperHeightControl.value;
		printRouteMapOptions.borderWidth = this.#borderWidthControl.value;
		printRouteMapOptions.zoomFactor = this.#zoomFactorControl.value;
		printRouteMapOptions.printNotes = this.#printNotesControl.checked;
		printRouteMapOptions.firefoxBrowser = ZERO === this.#firefoxBrowserControl.value;
		Object.freeze ( printRouteMapOptions );
		super.onOk ( printRouteMapOptions );
	}

	/**
	Get an array with the HTMLElements that have to be added in the content of the dialog.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [
			this.#paperWidthControl.controlHTMLElement,
			this.#paperHeightControl.controlHTMLElement,
			this.#borderWidthControl.controlHTMLElement,
			this.#zoomFactorControl.controlHTMLElement,
			this.#printNotesControl.controlHTMLElement,
			this.#firefoxBrowserControl.controlHTMLElement
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