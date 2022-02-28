
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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210915
Tests ...
*/

import { PANE_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class for panes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PaneUI {

	/**
	A reference to the HTMLElement in witch the data have to be added
	@type {HTMLElement}
	*/

	#paneData;

	/**
	A reference to the HTMLElement in witch the control have to be added
	@type {HTMLElement}
	*/

	#paneControl;

	/**
	The constructor
	@param {HTMLElement} paneData The HTMLElement in witch the data have to be added
	@param {HTMLElement} paneControl The HTMLElement in witch the control have to be added
	*/

	constructor ( paneData, paneControl ) {
		Object.freeze ( this );
		this.#paneData = paneData;
		this.#paneControl = paneControl;
	}

	/**
	A reference to the HTMLElement in witch the data have to be added
	@type {HTMLElement}
	*/

	get paneData ( ) { return this.#paneData; }

	/**
	A reference to the HTMLElement in witch the control have to be added
	@type {HTMLElement}
	*/

	get paneControl ( ) { return this.#paneControl; }

	/**
	This method removes all the elements from the paneData HTMLElement and paneControl HTMLElement
	Must be implemented in the derived classes
	*/

	remove ( ) {
	}

	/**
	This method add the maneuvers and notes to the paneData HTMLElement and controls to the paneControl HTMLElement
	Must be implemented in the derived classes
	*/

	add ( ) {
	}

	/**
	A unique identifier for the pane
	Must be implemented in the derived classes
	@type {String}
	*/

	get paneId ( ) {
		return PANE_ID.invalidPane;
	}

	/**
	The text to be displayer in the pane button
	Must be implemented in the derived classes
	@type {String}
	*/

	get buttonText ( ) {
		return '';
	}
}

export default PaneUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */