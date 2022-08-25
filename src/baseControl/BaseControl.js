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
Doc reviewed ...
Tests ...
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is a base class for dialog controls
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseControl {

	/**
	The control container
	@type {HTMLElement}
	*/

	#controlHTMLElement;

	/**
	The constructor
	*/

	constructor ( ) {

		Object.freeze ( this );

		// HTMLElement creation
		this.#controlHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-DataDiv'
			}
		);
	}

	/**
	get the main HTMLElement of the control
	@type {HTMLElement}
	*/

	get controlHTMLElement ( ) {
		return this.#controlHTMLElement;
	}

}

export default BaseControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */