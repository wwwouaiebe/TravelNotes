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
	- v2.1.0:
		- created
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import { ZERO, ONE } from '../main/Constants.js';

/*
Encoded Polyline Algorithm Format

Polyline encoding is a lossy compression algorithm that allows you to store a series of coordinates as a single string.
Point coordinates are encoded using signed values. If you only have a few static points, you may also wish to use the
interactive polyline encoding utility.

The encoding process converts a binary value into a series of character codes for ASCII characters using the familiar
base64 encoding scheme: to ensure proper display of these characters, encoded values are summed with 63
(the ASCII character '?') before converting them into ASCII. The algorithm also checks for additional character codes
for a given point by checking the least significant bit of each byte group; if this bit is set to 1, the point is not
yet fully formed and additional data must follow.

Additionally, to conserve space, points only include the offset from the previous point (except of course for the first
point). All points are encoded in Base64 as signed integers, as latitudes and longitudes are signed values. The encoding
format within a polyline needs to represent two coordinates representing latitude and longitude to a reasonable precision.
Given a maximum longitude of +/- 180 degrees to a precision of 5 decimal places (180.00000 to -180.00000), this results
in the need for a 32 bit signed binary integer value.

Note that the backslash is interpreted as an escape character within string literals. Any output of this utility should
convert backslash characters to double-backslashes within string literals.

The steps for encoding such a signed value are specified below.

    Take the initial signed value:
    -179.9832104
    Take the decimal value and multiply it by 1e5, rounding the result:
    -17998321
    Convert the decimal value to binary. Note that a negative value must be calculated using its two's complement by
	inverting the binary value and adding one to the result:
    00000001 00010010 10100001 11110001
    11111110 11101101 01011110 00001110
    11111110 11101101 01011110 00001111
    Left-shift the binary value one bit:
    11111101 11011010 10111100 00011110
    If the original decimal value is negative, invert this encoding:
    00000010 00100101 01000011 11100001
    Break the binary value out into 5-bit chunks (starting from the right hand side):
    00001 00010 01010 10000 11111 00001
    Place the 5-bit chunks into reverse order:
    00001 11111 10000 01010 00010 00001
    OR each value with 0x20 if another bit chunk follows:
    100001 111111 110000 101010 100010 000001
    Convert each value to decimal:
    33 63 48 42 34 1
    Add 63 to each value:
    96 126 111 105 97 64
    Convert each value to its ASCII equivalent:
    `~oia@

The table below shows some examples of encoded points, showing the encodings as a series of offsets from
previous points.

Example

Points: (38.5, -120.2), (40.7, -120.95), (43.252, -126.453)
Latitude Longitude	Latitude	Longitude  	Change In  	Change In  	Encoded 	Encoded 	Encoded
					in E5 		in E5		Latitude	Longitude	Latitude	Longitude	Point
38.5 	-120.2 		3850000		-12020000 	+3850000 	-12020000 	_p~iF 		~ps|U 		_p~iF~ps|U
40.7 	-120.95 	4070000		-12095000 	+220000 	-75000 		_ulL 		nnqC 		_ulLnnqC
43.252 	-126.453 	4325200		-12645300 	+255200 	-550300 	_mqN 		vxq`@ 		_mqNvxq`@

Encoded polyline: _p~iF~ps|U_ulLnnqC_mqNvxq`@
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Encoder/decoder to encode or decode a polyline into a string.

See thePolylineEncoder for the one and only one instance of this class

Based on Mark McClure polyline encoder (more info needed...)

- See https://github.com/Project-OSRM/osrm-frontend/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
- See https://github.com/graphhopper/directions-api-js-client/blob/master/src/GHUtil.js GHUtil.prototype.decodePath
- See https://developers.google.com/maps/documentation/utilities/polylinealgorithm
- See https://github.com/mapbox/polyline
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PolylineEncoder {

	/**
	Simple constant to use for computations
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #DOT5 ( ) { return 0.5; }

	/**
	Simple constant to use for computations
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #NUMBER5 ( ) { return 5; }

	/**
	Simple constant to use for computations
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #NUMBER10 ( ) { return 10; }

	/**
	Simple constant to use for computations
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #NUMBER31 ( ) { return 0x1f; }

	/**
	Simple constant to use for computations
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #NUMBER32 ( ) { return 0x20; }

	/**
	Simple constant to use for computations
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #NUMBER63 ( ) { return 0x3f; }

	/**
	This method round a number in the same way than Python 2
	@param {Number} value The value to round
	@return {Number} The rounded value
	*/

	#python2Round ( value ) {
		return Math.floor ( Math.abs ( value ) + PolylineEncoder.#DOT5 ) * ( ZERO <= value ? ONE : -ONE );
	}

	/**
	Helper method for the encode...
	@param {<array.<number>} current The current coordinates to encode
	@param {<array.<number>} previous The previously encoded coordinates
	@param {Number} factorD The precision to use
	*/

	#encodeDelta ( current, previous, factorD ) {
		const currentCoordRound = this.#python2Round ( current * factorD );
		const previousCoordRound = this.#python2Round ( previous * factorD );
		let coordinateDelta = currentCoordRound - previousCoordRound;
		/* eslint-disable no-bitwise */
		coordinateDelta <<= ONE;
		if ( ZERO > currentCoordRound - previousCoordRound ) {
			coordinateDelta = ~ coordinateDelta;
		}
		let outputDelta = '';
		while ( PolylineEncoder.#NUMBER32 <= coordinateDelta ) {
			outputDelta +=
				String.fromCharCode (
					(
						PolylineEncoder.#NUMBER32
						|
						( coordinateDelta & PolylineEncoder.#NUMBER31 )
					) +
					PolylineEncoder.#NUMBER63
				);
			coordinateDelta >>= PolylineEncoder.#NUMBER5;
		}
		/* eslint-enable no-bitwise */
		outputDelta += String.fromCharCode ( coordinateDelta + PolylineEncoder.#NUMBER63 );
		return outputDelta;
	}

	/**
	tmp variable for decode and decodeDelta methods communication (cannot use parameter the two functions are modifying the
	value )
	@type {Number}
	*/

	#index;

	/**
	Helper method for the decode...
	@param {String} encodedString The string to decode
	*/

	#decodeDelta ( encodedString ) {
		let byte = null;
		let shift = ZERO;
		let result = ZERO;
		do {
			byte = encodedString.charCodeAt ( this.#index ++ ) - PolylineEncoder.#NUMBER63;
			/* eslint-disable no-bitwise */
			result |= ( byte & PolylineEncoder.#NUMBER31 ) << shift;
			shift += PolylineEncoder.#NUMBER5;
		} while ( PolylineEncoder.#NUMBER32 <= byte );
		return ( ( result & ONE ) ? ~ ( result >> ONE ) : ( result >> ONE ) );
		/* eslint-enable no-bitwise */
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	encode an array of coordinates to a string ( coordinates can be 1d or 2d or 3d or more...)
	@param {Array.<Array.<number>>} coordinatesArray the coordinates to encode
	@param {Array.<Number>} precisions an array with the precision to use for each dimension
	@return {String} the encoded coordinates
	*/

	encode ( coordinatesArray, precisions ) {
		if ( ! coordinatesArray.length ) {
			return '';
		}

		const dimensions = precisions.length;
		const factors = Array.from ( precisions, precision => Math.pow ( PolylineEncoder.#NUMBER10, precision ) );

		let output = '';
		for ( let counter = 0; counter < dimensions; counter ++ ) {
			output += this.#encodeDelta ( coordinatesArray [ ZERO ] [ counter ], ZERO, factors [ counter ] );
		}
		for ( let coordCounter = ONE; coordCounter < coordinatesArray.length; coordCounter ++ ) {
			const currentCoord = coordinatesArray [ coordCounter ];
			const previousCoord = coordinatesArray [ coordCounter - ONE ];
			for ( let counter = 0; counter < dimensions; counter ++ ) {
				output += this.#encodeDelta ( currentCoord [ counter ], previousCoord [ counter ], factors [ counter ] );
			}
		}

		return output;
	}

	/**
	decode a string into an array of coordinates (coordinates can be 1d, 2d, 3d or more...)
	@param {String} encodedString the string to decode
	@param {Array.<Number>} precisions an array with the precision to use for each dimension
	@return {Array.<Array.<number>>} the decoded coordinates
	*/

	decode ( encodedString, precisions ) {
		const dimensions = precisions.length;
		if ( ! encodedString || ZERO === encodedString.length ) {
			return [ ];
		}

		this.#index = ZERO;
		const allDecodedValues = [];
		const factors = Array.from ( precisions, precision => Math.pow ( PolylineEncoder.#NUMBER10, precision ) );
		const tmpValues = new Array ( dimensions ).fill ( ZERO );

		while ( this.#index < encodedString.length ) {
			const decodedValues = new Array ( dimensions ).fill ( ZERO );
			for ( let coordCounter = 0; coordCounter < dimensions; coordCounter ++ ) {
				tmpValues [ coordCounter ] += this.#decodeDelta ( encodedString );
				decodedValues [ coordCounter ] = tmpValues [ coordCounter ] / factors [ coordCounter ];
			}
			allDecodedValues.push ( decodedValues );
		}

		return allDecodedValues;
	}
}

export default PolylineEncoder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */