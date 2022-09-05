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

import theViewerLayersToolbar from '../../toolbars/viewerLayersToolbar/ViewerLayersToolbar.js';
import theGeoLocator from '../../core/GeoLocator.js';
import Zoomer from '../../core/Zoomer.js';

import { ZERO } from '../Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
keydown event listener, so we can use the keyboard for zoom on the travel, geolocator and maps
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ViewerKeydownEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} keyBoardEvent The event to handle
	*/

	handleEvent ( keyBoardEvent ) {
		keyBoardEvent.stopPropagation ( );
		if ( 'Z' === keyBoardEvent.key || 'z' === keyBoardEvent.key ) {
			new Zoomer ( ).zoomToTravel ( );
		}
		else if ( 'G' === keyBoardEvent.key || 'g' === keyBoardEvent.key ) {
			theGeoLocator.switch ( );
		}
		else {
			const charCode = keyBoardEvent.key.charCodeAt ( ZERO );
			// eslint-disable-next-line no-magic-numbers
			if ( 47 < charCode && 58 > charCode ) {
				theViewerLayersToolbar.setMapLayer ( keyBoardEvent.key );
			}
		}
	}
}

export default ViewerKeydownEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */