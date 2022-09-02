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
		- created from v3.6.0
Doc reviewed 202208
 */

import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import theTravelNotesData from '../../data/TravelNotesData.js';
import theConfig from '../../data/Config.js';
import theUtilities from '../../core/uiLib/Utilities.js';
import { SAVE_STATUS } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class show the mouse position and the zoom on the screen
See theMouseUI for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MouseUI {

	/**
	The HTMLElement with the status, mouse and zoom infos
	@type {HTMLElement}
	*/

	#mouseUIElement;

	/**
	The save status
	@type {String}
	*/

	#saveStatus;

	/**
	The mouse position
	@type {String}
	*/

	#mousePosition;

	/**
	The zoom factor
	@type {String}
	*/

	#zoom;

	/**
	The save timer id
	@type {Number}
	*/

	#saveTimer;

	/**
	The time in milliseconds between the first change and the moment the SAVE_STATUS.notSaved is displayed
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #SAVE_TIME ( ) { return 300000; }

	/**
	Update the UI with the changed saveStatus, mouse position or zoom
	*/

	#updateUI ( ) {
		if ( this.#mouseUIElement ) {
			this.#mouseUIElement.textContent =
				this.#saveStatus + '\u00a0' + this.#mousePosition + '\u00a0-\u00a0Zoom\u00a0:\u00a0' + this.#zoom;
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#saveStatus = SAVE_STATUS.saved;
		this.#mousePosition = '';
		this.#zoom = '';
		this.#saveTimer = null;
	}

	/**
	change the save status on the UI
	@param {String} saveStatus the new saveStatus
	*/

	set saveStatus ( saveStatus ) {

		// Status unchanged... return directly
		if ( SAVE_STATUS.modified === saveStatus && SAVE_STATUS.notSaved === this.#saveStatus ) {
			return;
		}
		this.#saveStatus = saveStatus;
		if ( SAVE_STATUS.modified === saveStatus && ! this.#saveTimer ) {

			// Starting the timer
			this.#saveTimer = setTimeout (
				( ) => this.#saveStatus = SAVE_STATUS.notSaved,
				MouseUI.#SAVE_TIME
			);
		}
		else if ( SAVE_STATUS.saved === saveStatus && this.#saveTimer ) {

			// clear the timer
			clearTimeout ( this.#saveTimer );
			this.#saveTimer = null;
		}
		this.#updateUI ( );
	}

	/**
	creates the user interface
	*/

	createUI ( ) {

		// HTML creation
		this.#mouseUIElement =
			theHTMLElementsFactory.create ( 'div', { id : 'TravelNotes-MouseUI' }, document.body );

		// init vars for mouse and zoom
		this.#zoom = theTravelNotesData.map.getZoom ( );
		this.#mousePosition =
			theUtilities.formatLat ( theConfig.map.center.lat ) +
			'\u00a0-\u00a0' +
			theUtilities.formatLng ( theConfig.map.center.lng );

		// Event listeners for mouse
		theTravelNotesData.map.on (
			'mousemove',
			mouseMoveEvent => {
				this.#mousePosition =
					theUtilities.formatLatLng ( [ mouseMoveEvent.latlng.lat, mouseMoveEvent.latlng.lng ] );
				this.#updateUI ( );
			}
		);

		// Event listeners for zoom
		theTravelNotesData.map.on (
			'zoomend',
			( ) => {
				this.#zoom = String ( theTravelNotesData.map.getZoom ( ) );
				this.#updateUI ( );
			}
		);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of MouseUI class
@type {MouseUI}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theMouseUI = new MouseUI ( );

export default theMouseUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */