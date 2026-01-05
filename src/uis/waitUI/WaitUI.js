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

import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class display a Wait window on the screen with a message and an animation
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class WaitUI {

	/**
	The background div
	@type {HTMLElement}
	*/

	#backgroundDiv;

	/**
	The message div
	@type {HTMLElement}
	*/

	#messageDiv;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	creates the user interface
	*/

	createUI ( ) {

		// We can create the waitUI only once...
		if ( this.#backgroundDiv ) {
			return;
		}

		// Background div, so the map and controls are unavailable
		this.#backgroundDiv = theHTMLElementsFactory.create ( 'div', { className : 'travelnotes-background' }, document.body );

		// Wait div
		const waitDiv = theHTMLElementsFactory.create ( 'div', { id : 'travelnotes-wait-ui' }, this.#backgroundDiv );

		// Message div
		this.#messageDiv = theHTMLElementsFactory.create ( 'div', { id : 'travelnotes-wait-ui-message' }, waitDiv );
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'travelnotes-wait-animation-bullet'
			},
			theHTMLElementsFactory.create ( 'div', { className : 'travelnotes-wait-animation' }, waitDiv ) );
	}

	/**
	Show an info in the WaitUI
	@param {String} info The info to be displayed
	*/

	showInfo ( info ) {
		this.#messageDiv.textContent = info;
	}

	/**
	Close the WaitUI
	*/

	close ( ) {
		document.body.removeChild ( this.#backgroundDiv );
		this.#backgroundDiv = null;
	}
}

export default WaitUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */