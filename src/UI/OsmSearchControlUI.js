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

import OsmSearchToolbarUI from '../UI/OsmSearchToolbarUI.js';
import OsmSearchTreeUI from '../UI/OsmSearchTreeUI.js';
import OsmSearchWaitUI from '../UI/OsmSearchWaitUI.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class add or remove the search toolbar and search tree on the pane control
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmSearchControlUI {

	/**
	A reference to the OsmSearchTreeUI object
	@type {OsmSearchTreeUI}
	*/

	#osmSearchTreeUI;

	/**
	A reference to the OsmSearchToolbarUI object
	@type {OsmSearchToolbarUI}
	*/

	#osmSearchToolbar;

	/**
	A reference to the OsmSearchWaitUI Object
	@type {OsmSearchWaitUI}
	*/

	#osmSearchWaitUI;

	/**
	The HTMLElement in witch the control have to be added
	@type {HTMLElement}
	*/

	#paneControl;

	/**
	The constructor
	@param {HTMLElement} paneControl The HTMLElement in witch the control have to be added
	*/

	constructor ( paneControl ) {
		Object.freeze ( this );
		this.#paneControl = paneControl;
		this.#osmSearchTreeUI = new OsmSearchTreeUI ( );
		this.#osmSearchWaitUI = new OsmSearchWaitUI ( );
		this.#osmSearchToolbar = new OsmSearchToolbarUI ( this.#osmSearchTreeUI, this.#osmSearchWaitUI );
	}

	/**
	Add the HTMLElements to the controlPane
	*/

	addControl ( ) {
		this.#paneControl.appendChild ( this.#osmSearchToolbar.toolbarHTMLElement );
		this.#paneControl.appendChild ( this.#osmSearchTreeUI.treeHTMLElement );
		this.#paneControl.appendChild ( this.#osmSearchWaitUI.waitHTMLElement );
	}

	/**
	remove the HTMLElements from the controlPane
	*/

	clearControl ( ) {
		this.#paneControl.removeChild ( this.#osmSearchTreeUI.treeHTMLElement );
		this.#paneControl.removeChild ( this.#osmSearchToolbar.toolbarHTMLElement );
		this.#osmSearchWaitUI.hideWait ( );
		this.#paneControl.removeChild ( this.#osmSearchWaitUI.waitHTMLElement );
	}
}

export default OsmSearchControlUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */