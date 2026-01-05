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

import theTranslator from '../core/uiLib/Translator.js';
import theIndexedDb from '../core/uiLib/IndexedDb.js';
import theRoadbookUpdater from './RoadbookUpdater.js';
import ShowManeuverNotesChangeEL from './ShowManeuverNotesChangeEL.js';
import ShowRouteNotesChangeEL from './ShowRouteNotesChangeEL.js';
import ShowTravelNotesChangeEL from './ShowTravelNotesChangeEL.js';
import ShowSmallNotesChangeEL from './ShowSmallNotesChangeEL.js';
import ShowProfilesChangeEL from './ShowProfilesChangeEL.js';
import PrintRoadbookClickEL from './PrintRoadbookClickEL.js';
import SaveFileButtonClickEL from './SaveFileButtonClickEL.js';
import StorageEL from './StorageEL.js';

import { ZERO, ONE, HTTP_STATUS_OK } from '../main/Constants.js';

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
		document.getElementById ( 'travelnotes-travel-show-notes' ).checked = theRoadbookUpdater.showTravelNotes;
		document.getElementById ( 'travelnotes-routes-show-notes' ).checked = theRoadbookUpdater.showRouteNotes;
		document.getElementById ( 'travelnotes-routes-show-maneuvers' ).checked = theRoadbookUpdater.showManeuversNotes;
		document.getElementById ( 'travelnotes-routes-show-small-notes' ).checked = theRoadbookUpdater.showSmallNotes;
		document.getElementById ( 'travelnotes-routes-show-profiles' ).checked = theRoadbookUpdater.showProfiles;
	}

	/**
	Adding event listeners
	*/

	#addEventListeners ( ) {
		document.getElementById ( 'travelnotes-travel-show-notes' )
			.addEventListener ( 'change', new ShowTravelNotesChangeEL ( ) );
		document.getElementById ( 'travelnotes-routes-show-notes' )
			.addEventListener ( 'change', new ShowRouteNotesChangeEL ( ) );
		document.getElementById ( 'travelnotes-routes-show-maneuvers' )
			.addEventListener ( 'change', new ShowManeuverNotesChangeEL ( ) );
		document.getElementById ( 'travelnotes-routes-show-small-notes' )
			.addEventListener ( 'change', new ShowSmallNotesChangeEL ( ) );
		document.getElementById ( 'travelnotes-routes-show-profiles' )
			.addEventListener ( 'change', new ShowProfilesChangeEL ( ) );
		document.getElementById ( 'travelnotes-print-button' )
			.addEventListener ( 'click', new PrintRoadbookClickEL ( ) );

	}

	/**
	Adding save button
	*/

	#addSaveButton ( ) {
		this.#saveButton = document.createElement ( 'div' );
		this.#saveButton.id = 'travelnotes-save-button';
		this.#saveButton.textContent = '💾';
		this.#saveButton.className = 'travelnotes-roadbook-button';
		this.#saveButton.addEventListener ( 'click', new SaveFileButtonClickEL ( ) );
		document.getElementById ( 'travelnotes-roadbook-buttons-container' ).appendChild ( this.#saveButton );
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
		document.getElementById ( 'travelnotes-travel-show-notes-label' ).textContent =
			theTranslator.getText ( 'RoadbookLoader - show travel notes' );
		document.getElementById ( 'travelnotes-routes-show-maneuvers-label' ).textContent =
			theTranslator.getText ( 'RoadbookLoader - show maneuver' );
		document.getElementById ( 'travelnotes-routes-show-notes-label' ).textContent =
			theTranslator.getText ( 'RoadbookLoader - show routes notes' );
		document.getElementById ( 'travelnotes-routes-show-small-notes-label' ).textContent =
			theTranslator.getText ( 'RoadbookLoader - show small routes notes' );
		document.getElementById ( 'travelnotes-routes-show-profiles-label' ).textContent =
			theTranslator.getText ( 'RoadbookLoader - show profiles' );
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

		theRoadbookUpdater.updateNotesAndProfiles ( );
	}
}

export default RoadbookLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */