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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210915
Tests ...
*/

import PaneUI from '../UI/PaneUI.js';
import theTranslator from '../UILib/Translator.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import ItineraryControlUI from '../UI/ItineraryControlUI.js';
import ItineraryDataUI from '../UI/ItineraryDataUI.js';
import { INVALID_OBJ_ID, PANE_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class manages the itinerary pane UI
See PanesManagerUI for pane UI management
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ItineraryPaneUI extends PaneUI {

	/**
	the ItineraryDataUI Object
	@type {ItineraryDataUI}
	*/

	#itineraryDataUI;

	/**
	the ItineraryControlUI Object
	@type {ItineraryControlUI}
	*/

	#itineraryControlUI;

	/**
	constructor
	@param {HTMLElement} paneData The HTMLElement in witch the data have to be added
	@param {HTMLElement} paneControl The HTMLElement in witch the control have to be added
	*/

	constructor ( paneData, paneControl ) {
		super ( paneData, paneControl );
		this.#itineraryDataUI = new ItineraryDataUI ( this.paneData );
		this.#itineraryControlUI = new ItineraryControlUI ( this.paneControl, this.#itineraryDataUI );
	}

	/**
	This method removes all the elements from the paneData HTMLElement and paneControl HTMLElement
	Overload of the PaneUI.remove ( ) method
	*/

	remove ( ) {
		this.#itineraryDataUI.clearData ( );
		this.#itineraryControlUI.clearControl ( );
	}

	/**
	This method add the maneuvers and notes to the paneData HTMLElement and controls to the paneControl HTMLElement
	Overload of the PaneUI.add ( ) method
	*/

	add ( ) {
		if ( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId ) {
			this.#itineraryDataUI.addData ( );
			this.#itineraryControlUI.addControl ( );
		}
	}

	/**
	A unique identifier for the pane
	Overload of the PaneUI.paneId property
	@type {String}
	*/

	get paneId ( ) { return PANE_ID.itineraryPane; }

	/**
	The text to be displayer in the pane button
	Overload of the PaneUI.buttonText property
	@type {String}
	*/

	get buttonText ( ) { return theTranslator.getText ( 'ItineraryPaneUI - Itinerary' ); }

}

export default ItineraryPaneUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */