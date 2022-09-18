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
 */

import theProvidersToolbar from '../../toolbars/providersToolbar/ProvidersToolbar.js';
import theConfig from '../../data/Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
screen resize event listener
Re organize the screen
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ResizeEL {

	/**
	Timer id for the window resized event
	@type {Number}
	*/

	#windowResizedTimerId = null;

	/**
	Re organize the screen after a resize.
	*/

	#windowResized ( ) {
		theProvidersToolbar.centerToolbar ( );
		this.#windowResizedTimerId = null;
	}

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

		// we use a timer to avoid toolbar flickering...
		if ( this.#windowResizedTimerId ) {
			clearTimeout ( this.#windowResizedTimerId );
			this.#windowResizedTimerId = null;
		}
		this.#windowResizedTimerId = setTimeout ( ( ) => this.#windowResized ( ), theConfig.travelNotes.resizeDelay );
	}
}

export default ResizeEL;