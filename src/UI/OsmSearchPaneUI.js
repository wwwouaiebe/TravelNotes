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
	- v1.4.0:
		- created
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v1.13.0:
		- Issue ♯125 : Outphase osmSearch and add it to TravelNotes
		- Issue ♯126 : Add a command "select as start/end/intermediate point" in the osmSearch context menu
		- Issue ♯128 : Unify osmSearch and notes icons and data
	- v2.0.0:
		- Issue ♯135 : Remove innerHTML from code
		- Issue ♯138 : Protect the app - control html entries done by user.
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210915
Tests ...
*/

import PaneUI from '../UI/PaneUI.js';
import theTranslator from '../UILib/Translator.js';
import OsmSearchLimitsUI from '../UI/OsmSearchLimitsUI.js';
import OsmSearchDataUI from '../UI/OsmSearchDataUI.js';
import OsmSearchControlUI from '../UI/OsmSearchControlUI.js';

import { PANE_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class manages the search pane UI
See PanesManagerUI for pane UI management
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmSearchPaneUI extends PaneUI {

	/**
	the data UI
	@type {OsmSearchDataUI}
	*/

	#osmSearchDataUI;

	/**
	The control UI
	@type {OsmSearchControlUI}
	*/

	#osmSearchControlUI;

	/**
	The limits UI
	@type {OsmSearchLimitsUI}
	*/

	#osmSearchLimitsUI;

	/**
	The constructor
	@param {HTMLElement} paneData The HTMLElement in witch the data have to be added
	@param {HTMLElement} paneControl The HTMLElement in witch the control have to be added
	*/

	constructor ( paneData, paneControl ) {

		super ( paneData, paneControl );

		this.#osmSearchDataUI = new OsmSearchDataUI ( this.paneData );
		this.#osmSearchControlUI = new OsmSearchControlUI ( this.paneControl );
		this.#osmSearchLimitsUI = new OsmSearchLimitsUI ( );
	}

	/**
	This method removes all the elements from the paneData HTMLElement and paneControl HTMLElement
	Overload of the PaneUI.remove ( ) method
	*/

	remove ( ) {
		this.#osmSearchLimitsUI.hide ( );
		this.#osmSearchDataUI.clearData ( );
		this.#osmSearchControlUI.clearControl ( );
	}

	/**
	This method add the search results to the paneData HTMLElement and controls to the paneControl HTMLElement
	Overload of the PaneUI.add ( ) method
	*/

	add ( ) {
		this.#osmSearchLimitsUI.show ( );
		this.#osmSearchControlUI.addControl ( );
		this.#osmSearchDataUI.addData ( );
	}

	/**
	A unique identifier for the pane
	Overload of the PaneUI.paneId property
	@type {String}
	*/

	get paneId ( ) { return PANE_ID.searchPane; }

	/**
	The text to be displayer in the pane button
	Overload of the PaneUI.buttonText property
	@type {String}
	*/

	get buttonText ( ) { return theTranslator.getText ( 'OsmSearchPaneUI - Search' ); }

}

export default OsmSearchPaneUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */