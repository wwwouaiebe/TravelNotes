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
	- v3.2.0:
		- Issue ♯9 : String.substr ( ) is deprecated... Replace...
	- v3.4.0:
		- Issue ♯22 : Nice to have a table view for notes in the roadbook
		- Issue ♯25 : Add a print button to the roadbook page
Doc reviewed 20210915
Tests ...
*/

import theTranslator from '../UILib/Translator.js';
import theIndexedDb from '../UILib/IndexedDb.js';
import theRoadbookUpdater from '../roadbook/RoadbookUpdater.js';

import { ZERO, ONE, HTTP_STATUS_OK } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the show travel notes checkbox
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ShowTravelNotesChangeEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		theRoadbookUpdater.showTravelNotes = changeEvent.target.checked;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the show route notes checkbox
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ShowRouteNotesChangeEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		theRoadbookUpdater.showRouteNotes = changeEvent.target.checked;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the show maneuver notes checkbox
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ShowManeuverNotesChangeEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		theRoadbookUpdater.showManeuversNotes = changeEvent.target.checked;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the show small notes checkbox
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ShowSmallNotesChangeEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		theRoadbookUpdater.showSmallNotes = changeEvent.target.checked;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
storage event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class StorageEL {

	/**
	The UUID of the page
	@type {String}
	*/

	#UUID = null;

	/**
	The constructor
	@param {String} UUID The UUID of the page
	*/

	constructor ( UUID ) {
		this.#UUID = UUID;
	}

	/**
	Event listener method
	*/

	handleEvent ( ) {
		theIndexedDb.getReadPromise ( this.#UUID )
			.then (
				pageContent => {
					if ( pageContent ) {
						theRoadbookUpdater.updateRoadbook ( pageContent );
					}
					else {
						theRoadbookUpdater.updateRoadbook ( '' );
					}
				}
			)
			.catch (
				err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
				}
			);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the print button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PrintRoadbookClickEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	*/

	handleEvent ( ) {
		window.print ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the save button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SaveFileButtonClickEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	*/

	handleEvent ( ) {
		try {
			const fileName =
				document.querySelector ( '.TravelNotes-Roadbook-Travel-Header-Name' ).textContent + '-Roadbook.html';

			// Temporary removing the save button
			const buttonsDiv = document.getElementById ( 'TravelNotes-ButtonsDiv' );
			const saveButton = buttonsDiv.removeChild ( document.getElementById ( 'TravelNotes-SaveButton' ) );

			// Saving
			const mapFile = window.URL.createObjectURL (
				new File (
					[ '<!DOCTYPE html>', document.documentElement.outerHTML ],
					fileName,
					{ type : 'text/plain' }
				)
			);
			const anchorElement = document.createElement ( 'a' );
			anchorElement.setAttribute ( 'href', mapFile );
			anchorElement.setAttribute ( 'download', fileName );
			anchorElement.style.display = 'none';
			anchorElement.click ( );
			window.URL.revokeObjectURL ( mapFile );

			// Restoring the save button
			buttonsDiv.appendChild ( saveButton );
		}
		catch ( err ) {
			if ( err instanceof Error ) {
				console.error ( err );
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class load the roadbook,
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RoadbookLoader {

	/**
	UUID of the page
	@type {String}
	*/

	#UUID = null;

	/**
	The user language
	@type {String}
	*/

	#language = 'fr';

	/**
	A reference to the save button
	@type {HTMLElement}
	*/

	#saveButton = null;

	/**
	checkboxes init
	*/

	#initCheckboxes ( ) {
		document.getElementById ( 'TravelNotes-Travel-ShowNotes' ).checked = theRoadbookUpdater.showTravelNotes;
		document.getElementById ( 'TravelNotes-Routes-ShowNotes' ).checked = theRoadbookUpdater.showRouteNotes;
		document.getElementById ( 'TravelNotes-Routes-ShowManeuvers' ).checked = theRoadbookUpdater.showManeuversNotes;
		document.getElementById ( 'TravelNotes-Routes-ShowSmallNotes' ).checked = theRoadbookUpdater.showSmallNotes;
	}

	/**
	Adding event listeners
	*/

	#addEventListeners ( ) {
		document.getElementById ( 'TravelNotes-Travel-ShowNotes' )
			.addEventListener ( 'change', new ShowTravelNotesChangeEL ( ) );
		document.getElementById ( 'TravelNotes-Routes-ShowNotes' )
			.addEventListener ( 'change', new ShowRouteNotesChangeEL ( ) );
		document.getElementById ( 'TravelNotes-Routes-ShowManeuvers' )
			.addEventListener ( 'change', new ShowManeuverNotesChangeEL ( ) );
		document.getElementById ( 'TravelNotes-Routes-ShowSmallNotes' )
			.addEventListener ( 'change', new ShowSmallNotesChangeEL ( ) );
		document.getElementById ( 'TravelNotes-PrintButton' )
			.addEventListener ( 'click', new PrintRoadbookClickEL ( ) );

	}

	/**
	Adding save button
	*/

	#addSaveButton ( ) {
		this.#saveButton = document.createElement ( 'div' );
		this.#saveButton.id = 'TravelNotes-SaveButton';
		this.#saveButton.textContent = '💾';
		this.#saveButton.className = 'TravelNotes-RoadbookButton';
		this.#saveButton.addEventListener ( 'click', new SaveFileButtonClickEL ( ) );
		document.getElementById ( 'TravelNotes-ButtonsDiv' ).appendChild ( this.#saveButton );
	}

	/**
	Opening the indexed db
	*/

	#openIndexedDb ( ) {
		theIndexedDb.getOpenPromise ( )
			.then ( ( ) => theIndexedDb.getReadPromise ( this.#UUID ) )
			.then ( pageContent => theRoadbookUpdater.updateRoadbook ( pageContent ) )
			.catch (
				err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
				}
			);
		window.addEventListener ( 'storage', new StorageEL ( this.#UUID ) );
		window.addEventListener ( 'unload', ( ) => theIndexedDb.closeDb ( )	);
	}

	/**
	Loading translations from server
	*/

	#loadTranslations ( ) {
		fetch (
			window.location.href.substring ( ZERO, window.location.href.lastIndexOf ( '/' ) + ONE ) +
			'TravelNotes' +
			this.#language.toUpperCase ( ) +
			'.json'
		)
			.then (
				response => {
					if ( HTTP_STATUS_OK === response.status && response.ok ) {
						response.json ( )
							.then ( translations => theTranslator.setTranslations ( translations ) )
							.then ( ( ) => this.#translatePage ( ) )
							.catch (
								err => {
									if ( err instanceof Error ) {
										console.error ( err );
									}
								}
							);
					}
				}
			)
			.catch (
			);
	}

	/**
	Translating the page
	*/

	#translatePage ( ) {
		document.getElementById ( 'TravelNotes-Travel-ShowNotesLabel' ).textContent =
			theTranslator.getText ( 'RoadbookLoader - show travel notes' );
		document.getElementById ( 'TravelNotes-Routes-ShowManeuversLabel' ).textContent =
			theTranslator.getText ( 'RoadbookLoader - show maneuver' );
		document.getElementById ( 'TravelNotes-Routes-ShowNotesLabel' ).textContent =
			theTranslator.getText ( 'RoadbookLoader - show routes notes' );
		document.getElementById ( 'TravelNotes-Routes-ShowSmallNotesLabel' ).textContent =
			theTranslator.getText ( 'RoadbookLoader - show small routes notes' );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		let params = new URLSearchParams ( document.location.search.substring ( ONE ) );
		this.#UUID = params.get ( 'page' );
		this.#language = params.get ( 'lng' ) || 'fr';
	}

	/**
	Loading the roadbook
	*/

	loadRoadbook ( ) {
		this.#initCheckboxes ( );
		this.#addEventListeners ( );
		if ( this.#UUID ) {
			this.#addSaveButton ( );
			this.#openIndexedDb ( );
			this.#loadTranslations ( );
		}

		theRoadbookUpdater.updateNotes ( );
	}
}

export default RoadbookLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */