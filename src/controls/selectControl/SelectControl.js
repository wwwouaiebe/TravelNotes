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
		- created
Doc reviewed 20220828
Tests ...
*/

import BaseControl from '../baseControl/BaseControl.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import MouseAndTouchBaseEL from '../../mouseAndTouchEL/MouseAndTouchBaseEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is a generic control with a select element
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SelectControl extends BaseControl {

	/**
	The select HTMLElement
	@type {HTMLElement}
	*/

	#selectHTMLElement;

	/**
	The selectHTMLElement event listeners
	@type {MouseAndTouchBaseEL}
	*/

	#selectHTMLElementEL;

	/**
	The constructor
	@param {Object} options An object with the  options ( beforeText, value, min, max, datasetName, afterText )
	*/

	constructor ( options ) {
		super ( );
		theHTMLElementsFactory.create (
			'text',
			{
				value : options?.beforeText || ''
			},
			this.controlHTMLElement
		);
		this.#selectHTMLElement = theHTMLElementsFactory.create ( 'select', null, this.controlHTMLElement );
		this.#selectHTMLElementEL = new MouseAndTouchBaseEL ( { preventDefaultTouchEvents : false } );
		this.#selectHTMLElementEL.addEventListeners ( this.#selectHTMLElement );
		options?.elements.forEach (
			element => {
				this.#selectHTMLElement.add (
					theHTMLElementsFactory.create ( 'option', { text : element } )
				);
			}
		);
	}

	/**
	The destructor
	*/

	destructor ( ) {
		this.#selectHTMLElementEL.removeEventListeners ( this.#selectHTMLElement );
		this.#selectHTMLElementEL = null;
	}

	/**
	The index of the selected item in the control.
	@type {Number}
	*/

	get selectedIndex ( ) { return this.#selectHTMLElement.selectedIndex; }

	set selectedIndex ( selectedIndex ) { this.#selectHTMLElement.selectedIndex = selectedIndex; }
}

export default SelectControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */