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

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theRouteHTMLViewsFactory from '../viewsFactories/RouteHTMLViewsFactory.js';
import theTranslator from '../UILib/Translator.js';
import theConfig from '../data/Config.js';
import theTravelNotesData from '../data/TravelNotesData.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
input event listener for the show notes checkbox
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NotesCheckboxInputEL {

	/**
	A reference to the ItineraryDataUI Object
	@type {ItineraryDataUI}
	*/

	#itineraryDataUI;

	/**
	The constructor
	@param {ItineraryDataUI} itineraryDataUI A reference to the ItineraryDataUI Object
	*/

	constructor ( itineraryDataUI ) {
		Object.freeze ( this );
		this.#itineraryDataUI = itineraryDataUI;
	}

	/**
	Event listener method
	@param {Event} inputEvent The event to handle
	*/

	handleEvent ( inputEvent ) {
		inputEvent.stopPropagation ( );
		this.#itineraryDataUI.toggleNotes ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
input event listener for the show maneuver checkbox
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ManeuversCheckboxInputEL {

	/**
	A reference to the ItineraryDataUI Object
	@type {ItineraryDataUI}
	*/

	#itineraryDataUI;

	/**
	The constructor
	@param {ItineraryDataUI} itineraryDataUI A reference to the ItineraryDataUI Object
	*/

	constructor ( itineraryDataUI ) {
		Object.freeze ( this );
		this.#itineraryDataUI = itineraryDataUI;
	}

	/**
	Event listener method
	@param {Event} inputEvent The event to handle
	*/

	handleEvent ( inputEvent ) {
		inputEvent.stopPropagation ( );
		this.#itineraryDataUI.toggleManeuvers ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class manages the controlPane for the itineraries
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ItineraryControlUI {

	/**
	The header of the route with the route name , distance and ascent
	@type {HTMLElement}
	*/

	#routeHeaderHTMLElement;

	/**
	The checkboxes container
	@type {HTMLElement}
	*/

	#checkBoxesHTMLElement;

	/**
	The show notes checkbox
	@type {HTMLElement}
	*/

	#showNotesCheckBoxHTMLElement;

	/**
	The show maneuvers checkbox
	@type {HTMLElement}
	*/

	#showManeuversCheckBoxHTMLElement;

	/**
	The current status of the notes
	@type {Boolean}
	*/

	#showNotes = theConfig.itineraryPaneUI.showNotes;

	/**
	The current status of the maneuvers
	@type {Boolean}
	*/

	#showManeuvers = theConfig.itineraryPaneUI.showManeuvers;

	/**
	event listener for the notes checkbox
	@type {NotesCheckboxInputEL}
	*/

	#notesCheckboxInputEL = null;

	/**
	event listener for the maneuver checkbox
	@type {ManeuversCheckboxInputEL}
	*/

	#maneuversCheckboxInputEL = null;

	/**
	A reference to the HTMLElement in witch the control have to be added
	@type {HTMLElement}
	*/

	#paneControl = null;

	/**
	A reference to the associated ItineraryDataUI
	@type {ItineraryDataUI}
	*/

	#itineraryDataUI = null;

	/**
	The constructor
	@param {HTMLElement} paneControl The HTMLElement in witch the control have to be added
	@param {ItineraryDataUI} itineraryDataUI A reference to the associated ItineraryDataUI
	*/

	constructor ( paneControl, itineraryDataUI ) {

		Object.freeze ( this );

		this.#paneControl = paneControl;
		this.#itineraryDataUI = itineraryDataUI;
		this.#notesCheckboxInputEL = new NotesCheckboxInputEL ( itineraryDataUI );
		this.#maneuversCheckboxInputEL = new ManeuversCheckboxInputEL ( itineraryDataUI );
	}

	/**
	Add the HTMLElements to the controlPane
	*/

	addControl ( ) {
		this.#checkBoxesHTMLElement = theHTMLElementsFactory.create ( 'div', null, this.#paneControl );

		// Notes
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'ItineraryControlUI - Show notes' )
			},
			this.#checkBoxesHTMLElement
		);
		this.#showNotesCheckBoxHTMLElement = theHTMLElementsFactory.create (
			'input',
			{
				type : 'checkbox',
				id : 'TravelNotes-ItineraryPane-ShowNotesInput',
				checked : this.#showNotes
			},
			this.#checkBoxesHTMLElement
		);
		this.#showNotesCheckBoxHTMLElement.addEventListener ( 'click', this.#notesCheckboxInputEL );

		// Maneuvers
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'ItineraryControlUI - Show maneuvers' )
			},
			this.#checkBoxesHTMLElement
		);
		this.#showManeuversCheckBoxHTMLElement = theHTMLElementsFactory.create (
			'input',
			{
				type : 'checkbox',
				id : 'TravelNotes-ItineraryPane-ShowManeuversInput',
				checked : this.#showManeuvers
			},
			this.#checkBoxesHTMLElement
		);
		this.#showManeuversCheckBoxHTMLElement.addEventListener ( 'click', this.#maneuversCheckboxInputEL );

		// Route header
		this.#routeHeaderHTMLElement = theRouteHTMLViewsFactory.getRouteHeaderHTML (
			'TravelNotes-ItineraryPaneUI-',
			theTravelNotesData.travel.editedRoute
		);

		this.#paneControl.appendChild ( this.#routeHeaderHTMLElement );

		if ( ! this.#showManeuvers ) {
			this.#itineraryDataUI.toggleManeuvers ( );
		}
		if ( ! this.#showNotes ) {
			this.#itineraryDataUI.toggleNotes ( );
		}
	}

	/**
	remove the HTMLElements from the controlPane
	*/

	clearControl ( ) {
		if ( this.#checkBoxesHTMLElement ) {

			// maneuvers
			if ( this.#showManeuversCheckBoxHTMLElement ) {
				this.#showManeuvers = this.#showManeuversCheckBoxHTMLElement.checked;
				this.#showManeuversCheckBoxHTMLElement.removeEventListener (
					'click',
					this.#maneuversCheckboxInputEL
				);
				this.#checkBoxesHTMLElement.removeChild ( this.#showManeuversCheckBoxHTMLElement );
				this.#showManeuversCheckBoxHTMLElement = null;
			}

			// notes
			if ( this.#showNotesCheckBoxHTMLElement ) {
				this.#showNotes = this.#showNotesCheckBoxHTMLElement.checked;
				this.#showNotesCheckBoxHTMLElement.removeEventListener ( 'click', this.#notesCheckboxInputEL );
				this.#checkBoxesHTMLElement.removeChild ( this.#showNotesCheckBoxHTMLElement );
				this.#showNotesCheckBoxHTMLElement = null;
			}
			this.#paneControl.removeChild ( this.#checkBoxesHTMLElement );
			this.#checkBoxesHTMLElement = null;
		}
		if ( this.#routeHeaderHTMLElement ) {
			this.#paneControl.removeChild ( this.#routeHeaderHTMLElement );
			this.#routeHeaderHTMLElement = null;
		}
	}
}

export default ItineraryControlUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */