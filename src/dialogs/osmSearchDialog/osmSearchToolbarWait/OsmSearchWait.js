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

import theHTMLElementsFactory from '../../../core/uiLib/HTMLElementsFactory.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This the wait bar for the OsmSearch
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmSearchWait {

	/**
	The wait html element
	@type {HTMLElement}
	*/

	#waitHTMLElement;

	/**
	The constructor
	*/

	constructor ( ) {
		this.#waitHTMLElement = theHTMLElementsFactory.create (
			'div',
			{ className : 'travelnotes-wait-animation' }
		);

		theHTMLElementsFactory.create (
			'div',
			{
				className : 'travelnotes-wait-animation-bullet'
			},
			this.#waitHTMLElement
		);

		this.#waitHTMLElement.classList.add ( 'travelnotes-hidden' );
	}

	/**
	show the wait UI
	*/

	showWait ( ) {
		this.#waitHTMLElement.classList.remove ( 'travelnotes-hidden' );
	}

	/**
	hide the wait UI
	*/

	hideWait ( ) {
		this.#waitHTMLElement.classList.add ( 'travelnotes-hidden' );
	}

	/**
	The wait HTMLElement of the OsmSearchWaitUI
	@type {HTMLElement}
	*/

	get waitHTMLElement ( ) { return this.#waitHTMLElement; }
}

export default OsmSearchWait;

/* --- End of file --------------------------------------------------------------------------------------------------------- */