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

import theEventDispatcher from './lib/EventDispatcher.js';
import theConfig from '../data/Config.js';
import theErrorsUI from '../uis/errorsUI/ErrorsUI.js';
import { GEOLOCATION_STATUS, ONE, TWO } from '../main/Constants.js';
import theTranslator from './uiLib/Translator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class manage the geolocation

See theGeoLocator for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class GeoLocator {

	/**
	The current status of the geoLocator.
	@type {GEOLOCATION_STATUS}
	*/

	#status = navigator.geolocation ? GEOLOCATION_STATUS.inactive : GEOLOCATION_STATUS.disabled;

	/**
	The id returned by the
	[Geolocation.watchPosition ( )](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition)
	method
	@type {Number}
	*/

	#watchId = null;

	/**
	Send an event to show the current position on the map
	@param {GeolocationPosition} position a JS GeolocationPosition object
	*/

	#showPosition ( position ) {
		theEventDispatcher.dispatch ( 'geolocationpositionchanged', { position : position } );
	}

	/**
	Stop the geolocation
	*/

	#stop ( ) {
		if ( GEOLOCATION_STATUS.active === this.#status ) {
			this.#status = GEOLOCATION_STATUS.inactive;
		}

		theEventDispatcher.dispatch ( 'geolocationstatuschanged', { status : this.#status } );

		if ( this.#watchId ) {
			navigator.geolocation.clearWatch ( this.#watchId );
			this.#watchId = null;
		}
	}

	/**
	Stop the geolocation because the user don't accept the geolocation or the geolocation
	is disabled on the device
	@param {GeolocationPositionError} positionError See GeolocationPositionError on mdn
	*/

	#error ( positionError ) {
		if ( ONE === positionError.code ) {
			this.#status = GEOLOCATION_STATUS.refusedByUser;
		}
		if ( TWO === positionError.code ) {
			theErrorsUI.showError ( theTranslator.getText ( 'GeoLocator - Geolocation disabled on the device' ) );
		}
		this.#stop ( );
	}

	/**
	Start the geolocation
	*/

	#start ( ) {
		this.#status = GEOLOCATION_STATUS.active;
		theEventDispatcher.dispatch ( 'geolocationstatuschanged', { status : this.#status } );

		if ( theConfig.geoLocation.watch ) {
			this.#watchId = navigator.geolocation.watchPosition (
				position => this.#showPosition ( position ),
				positionError => this.#error ( positionError ),
				theConfig.geoLocation.options
			);
		}
		else {
			navigator.geolocation.getCurrentPosition (
				position => this.#showPosition ( position ),
				positionError => this.#error ( positionError ),
				theConfig.geoLocation.options
			);
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	The status of the geolocation
	@type {GEOLOCATION_STATUS}
	*/

	get status ( ) { return this.#status; }

	/**
	Start or stop the geolocatiion, depending of the status
	@return {GEOLOCATION_STATUS} the status after the switch
	*/

	switch ( ) {
		switch ( this.#status ) {
		case GEOLOCATION_STATUS.inactive :
			this.#start ( );
			break;
		case GEOLOCATION_STATUS.active :
			this.#stop ( );
			break;
		default :
			break;
		}

		return this.#status;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of GeoLocator class
@type {GeoLocator}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theGeoLocator = new GeoLocator ( );

export default theGeoLocator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */