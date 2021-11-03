/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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
Doc reviewed 20210914
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file PrintRouteMapDialog.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module dialogs

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@typedef {Object} PrintRouteMapOptions
@desc An object to store the PrintRouteMapDialog options
@property {Number} paperWidth The paper width option
@property {Number} paperHeight The paper height option
@property {Number} borderWidth The border width option
@property {Number} zoomFactor The zoom factor option
@property {Boolean} pageBreak The page break option
@property {Boolean} printNotes The print notes option

@------------------------------------------------------------------------------------------------------------------------------
*/

import theTranslator from '../UILib/Translator.js';
import theConfig from '../data/Config.js';
import BaseDialog from '../dialogBase/BaseDialog.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';

const OUR_MAX_ZOOM = 15;

/**
@--------------------------------------------------------------------------------------------------------------------------

@class PrintRouteMapDialog
@classdesc This class create and manage the print route map dialog
@extends BaseDialog
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class PrintRouteMapDialog extends BaseDialog {

	/**
	The paper width input
	@type {HTMLElement}
	*/

	#paperWidthInput = null;

	/**
	The paper height input
	@type {HTMLElement}
	*/

	#paperHeightInput = null;

	/**
	The border width input
	@type {HTMLElement}
	*/

	#borderWidthInput = null;

	/**
	The page break input
	@type {HTMLElement}
	*/

	#pageBreakInput = null;

	/**
	The print notes input
	@type {HTMLElement}
	*/

	#printNotesInput = null;

	/**
	The zoom factor input
	@type {HTMLElement}
	*/

	#zoomFactorInput = null;

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
				value : Math.min ( theConfig.printRouteMap.zoomFactor, OUR_MAX_ZOOM ),
				min : theTravelNotesData.map.getMinZoom ( ),
				max : Math.min ( theTravelNotesData.map.getMaxZoom ( ), OUR_MAX_ZOOM )
			},
			zoomFactorDiv
		);

		return zoomFactorDiv;
	}

	/**
	Create the page break div
	@return {HTMLElement} the page break div
	*/

	#createPageBreakDiv ( ) {
		const pageBreakDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-PrintRouteMapDialog-DataDiv'
			}
		);
		this.#pageBreakInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'checkbox',
				checked : theConfig.printRouteMap.pageBreak
			},
			pageBreakDiv
		);
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'PrintRouteMapDialog - Page break' )
			},
			pageBreakDiv
		);

		return pageBreakDiv;
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

	/*
	constructor
	*/

	constructor ( ) {
		super ( );
	}

	/**
	Overload of the BaseDialog.onOk ( ) method. Called when the Ok button is clicked
	*/

	onOk ( ) {
		super.onOk (
			Object.freeze (
				{
					paperWidth : parseInt ( this.#paperWidthInput.value ),
					paperHeight : parseInt ( this.#paperHeightInput.value ),
					borderWidth : parseInt ( this.#borderWidthInput.value ),
					zoomFactor : parseInt ( this.#zoomFactorInput.value ),
					pageBreak : this.#pageBreakInput.checked,
					printNotes : this.#printNotesInput.checked
				}
			)
		);
	}

	/**
	Get an array with the HTMLElements that have to be added in the content of the dialog.
	*/

	get contentHTMLElements ( ) {
		return [
			this.#createPaperWidthDiv ( ),
			this.#createPaperHeightDiv ( ),
			this.#createBorderWidthDiv ( ),
			this.#createZoomFactorDiv ( ),
			this.#createPageBreakDiv ( ),
			this.#createPrintNotesDiv ( )
		];
	}

	/**
	Return the dialog title. Overload of the BaseDialog.title property
	*/

	get title ( ) { return theTranslator.getText ( 'PrintRouteMapDialog - Print' ); }

}

export default PrintRouteMapDialog;

/*
--- End of PrintRouteMapDialog.js file ----------------------------------------------------------------------------------------
*/