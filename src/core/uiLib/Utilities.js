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
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v2.4.0:
		- Issue ♯174 : UUID generator is not rfc 4122 compliant
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210915
Tests ...
*/

import theTranslator from '../UILib/Translator.js';
import { LAT_LNG, ZERO, ONE, TWO, THREE, HEXADECIMAL, DISTANCE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class contains utility methods.
See theUtilities for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class Utilities {

	/**
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Gives an UUID conform to the rfc 4122 section 4.4
	@type {String}
	*/

	get UUID ( ) {
		const UUID_LENGHT = 16;
		const UUID_STRLENGHT = 2;
		const UUID_SEPARATORS = [ '', '', '', '-', '', '-', '', '-', '', '-', '', '', '', '', '', '' ];
		const randomValues = new Uint8Array ( UUID_LENGHT );

		window.crypto.getRandomValues ( randomValues );

		/* eslint-disable no-bitwise */
		/* eslint-disable no-magic-numbers */
		/*
		rfc 4122 section 4.4 : Set the four most significant bits (bits 12 through 15) of the
		time_hi_and_version field to the 4-bit version number from section 4.1.3.
		*/

		randomValues [ 6 ] = ( randomValues [ 6 ] & 0x0f ) | 0x40;

		/*
		rfc 4122 section 4.4 : Set the two most significant bits (bits 6 and 7) of the
		clock_seq_hi_and_reserved to zero and one, respectively.
		*/

		randomValues [ 8 ] = ( randomValues [ 8 ] & 0x3f ) | 0x80;
		/* eslint-enable no-bitwise */
		/* eslint-enable no-magic-numbers */

		let UUID = '';
		for ( let counter = ZERO; counter < UUID_LENGHT; counter ++ ) {
			UUID += randomValues [ counter ].toString ( HEXADECIMAL ).padStart ( UUID_STRLENGHT, '0' ) +
				UUID_SEPARATORS [ counter ];
		}

		return UUID;
	}

	/**
	Test the availibility of the storage
	@param {String} type The type of storage. Must be 'sessionStorage' or 'localStorage'
	*/

	storageAvailable ( type ) {
		try {
			const storage = window [ type ];
			const testString = '__storage_test__';
			storage.setItem ( testString, testString );
			storage.removeItem ( testString );
			return true;
		}
		catch ( err ) {
			return false;
		}
	}

	/**
	Open a file
	@param {function|Object} eventListener a change event listener to use when the file is opened
	@param {String} acceptFileType The extension of the file, included the dot.
	*/

	openFile ( eventListener, acceptFileType ) {
		const openFileInput = document.createElement ( 'input' );
		openFileInput.type = 'file';
		if ( acceptFileType ) {
			openFileInput.accept = acceptFileType;
		}
		openFileInput.addEventListener (
			'change',
			eventListener,
			false
		);
		openFileInput.click ( );
	}

	/**
	Save a string to a file
	@param {String} fileName The file name
	@param {String} fileContent The file content
	@param {?string} fileMimeType The mime type of the file. Default to 'text/plain'
	*/

	saveFile ( fileName, fileContent, fileMimeType ) {
		try {
			const objURL =
				fileMimeType
					?
					window.URL.createObjectURL ( new File ( [ fileContent ], fileName, { type : fileMimeType } ) )
					:
					URL.createObjectURL ( fileContent );
			const element = document.createElement ( 'a' );
			element.setAttribute ( 'href', objURL );
			element.setAttribute ( 'download', fileName );
			element.click ( );
			window.URL.revokeObjectURL ( objURL );
		}
		catch ( err ) {
			if ( err instanceof Error ) {
				console.error ( err );
			}
		}
	}

	/**
	Transform a time to a string
	@param {Number} time The time in seconds
	*/

	formatTime ( time ) {
		const SECOND_IN_DAY = 86400;
		const SECOND_IN_HOUR = 3600;
		const SECOND_IN_MINUT = 60;
		const iTtime = Math.floor ( time );
		if ( ZERO === iTtime ) {
			return '';
		}
		const days = Math.floor ( iTtime / SECOND_IN_DAY );
		const hours = Math.floor ( iTtime % SECOND_IN_DAY / SECOND_IN_HOUR );
		const minutes = Math.floor ( iTtime % SECOND_IN_HOUR / SECOND_IN_MINUT );
		const seconds = Math.floor ( iTtime % SECOND_IN_MINUT );
		if ( ZERO < days ) {
			return days +
				'\u00A0'
				+ theTranslator.getText ( 'Utilities - Day' ) +
				'\u00A0' +
				hours +
				'\u00A0' +
				theTranslator.getText ( 'Utilities - Hour' );
		}
		else if ( ZERO < hours ) {
			return hours +
				'\u00A0'
				+ theTranslator.getText ( 'Utilities - Hour' )
				+ '\u00A0' +
				minutes +
				'\u00A0'
				+ theTranslator.getText ( 'Utilities - Minute' );
		}
		else if ( ZERO < minutes ) {
			return minutes +
				'\u00A0' +
				theTranslator.getText ( 'Utilities - Minute' );
		}
		return seconds + '\u00A0' + theTranslator.getText ( 'Utilities - Second' );
	}

	/**
	Transform a distance to a string
	@param {Number} distance The distance in meters
	*/

	formatDistance ( distance ) {
		const DISTANCE_ROUND = 10;

		const iDistance = Math.floor ( distance );
		if ( ZERO >= iDistance ) {
			return '0\u00A0km';
		}
		return Math.floor ( iDistance / DISTANCE.metersInKm ) +
			',' +
			Math.floor ( ( iDistance % DISTANCE.metersInKm ) / DISTANCE_ROUND ).toFixed ( ZERO )
				.padStart ( TWO, '0' )
				.padEnd ( THREE, '0' ) +
			'\u00A0km';
	}

	/**
	Transform a number to a string with degree minutes and seconds
	@param {Number} number The number to transform
	*/

	numberToDMS ( number ) {
		const MINUTES_IN_DEGREE = 60.0;
		const SECONDS_IN_DEGREE = 3600.0;
		const SECONDS_DECIMALS = 100.0;
		let remind = number;
		let degrees = Math.floor ( number );
		remind -= degrees;
		let minutes = Math.floor ( remind * MINUTES_IN_DEGREE );
		remind -= minutes / MINUTES_IN_DEGREE;
		remind *= SECONDS_IN_DEGREE;
		let seconds = Math.floor ( remind );
		remind -= seconds;
		remind = Math.floor ( remind * SECONDS_DECIMALS );
		return degrees.toString ( ) + '° ' + minutes.toString ( ) + '\' ' + seconds + '" ' + remind;
	}

	/**
	Transform a latitude to a string with degree minutes and seconds
	@param {Number} lat The latitude
	*/

	formatLatDMS ( lat ) {
		return (
			lat > ZERO
				?
				this.numberToDMS ( lat ) + '\u00A0N'
				:
				this.numberToDMS ( -lat ) + '\u00A0S'
		);
	}

	/**
	Transform a longitude to a string with degree minutes and seconds
	@param {Number} lng The longitude
	*/

	formatLngDMS ( lng ) {
		return (
			lng > ZERO
				?
				this.numberToDMS ( lng ) + '\u00A0E'
				:
				this.numberToDMS ( -lng ) + '\u00A0W'
		);
	}

	/**
	Transform a latitude + longitude to a string with degree minutes and seconds
	@param {Array.<Number>} latLng The latitude and longitude
	*/

	formatLatLngDMS ( latLng ) {
		if ( ZERO === latLng [ ZERO ] && ZERO === latLng [ ONE ] ) {
			return '';
		}
		return this.formatLatDMS ( latLng [ ZERO ] ) + '\u00A0-\u00A0' + this.formatLngDMS ( latLng [ ONE ] );
	}

	/**
	Transform a latitude to a string
	@param {Number} lat The latitude
	*/

	formatLat ( lat ) {
		return (
			lat > ZERO
				?
				lat.toFixed ( LAT_LNG.fixed ) + '\u00A0N'
				:
				( -lat ).toFixed ( LAT_LNG.fixed ) + '\u00A0S'
		);
	}

	/**
	Transform a longitude to a string
	@param {Number} lng The longitude
	*/

	formatLng ( lng ) {
		return (
			lng > ZERO
				?
				lng.toFixed ( LAT_LNG.fixed ) + '\u00A0E'
				:
				( -lng ).toFixed ( LAT_LNG.fixed ) + '\u00A0W'
		);
	}

	/**
	Transform a latitude + longitude to a string
	@param {Array.<Number>} latLng The latitude and longitude
	*/

	formatLatLng ( latLng ) {
		if ( ZERO === latLng [ ZERO ] && ZERO === latLng [ ONE ] ) {
			return '';
		}
		return this.formatLat ( latLng [ ZERO ] ) + '\u00A0-\u00A0' + this.formatLng ( latLng [ ONE ] );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of Utilities class
@type {Utilities}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theUtilities = new Utilities ( );

export default theUtilities;

/* --- End of file --------------------------------------------------------------------------------------------------------- */