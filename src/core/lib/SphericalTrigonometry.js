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

import { ZERO, ONE, DEGREES, EARTH_RADIUS } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class contains methods for spherical trigonometry operations.
See theSphericalTrigonometry for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SphericalTrigonometry {

	/**
	This method normalize a longitude (always between -180° and 180°)
	@param {Number} Lng The longitude to normalize
	@return {Number} The normalized longitude
	*/

	#normalizeLng ( Lng ) {
		return ( ( Lng + DEGREES.d540 ) % DEGREES.d360 ) - DEGREES.d180;
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**

	This method gives an arc of a spherical triangle when the 2 others arcs and the opposite summit are know.
	It's the well know cosinus law:

	- cos a = cos b cos c + sin b sin c cos A
	- cos b =	cos c cos a + sin c sin a cos B
	- cos c = cos a cos b + sin a sin b cos C

	@param {Number} summit the opposite summit
	@param {Number} arc1 the first arc
	@param {Number} arc2 the second arc

	*/

	arcFromSummitArcArc ( summit, arc1, arc2 ) {
		return Math.acos (
			( Math.cos ( arc1 ) * Math.cos ( arc2 ) ) +
			( Math.sin ( arc1 ) * Math.sin ( arc2 ) * Math.cos ( summit ) )
		);
	}

	/**

	This method is also the well know cosinus law written in an other way....

	cos C = ( cos c - cos a cos b ) / sin a sin b

	@param {Number} arc1 the first arc
	@param {Number} arc2 the second arc
	@param {Number} oppositeArc the opposite arc

	*/

	summitFromArcArcArc ( arc1, arc2, oppositeArc ) {
		return Math.acos (
			( Math.cos ( oppositeArc ) - ( Math.cos ( arc1 ) * Math.cos ( arc2 ) ) ) /
			( Math.sin ( arc1 ) * Math.sin ( arc2 ) )
		);
	}

	/**
	This method returns the distance between two points
	Since v1.7.0 we use the simple spherical law of cosines formula
	(cos c = cos a cos b + sin a sin b cos C). The delta with the Leaflet method is
	always < 10e-3 m. The error due to the earth radius is a lot bigger.
	Notice: leaflet uses the haversine formula.
	@param {Array.<Number>} latLngStartPoint The coordinates of the start point
	@param {Array.<Number>} latLngEndPoint The coordinates of the end point
	*/

	pointsDistance ( latLngStartPoint, latLngEndPoint ) {
		if (
			latLngStartPoint [ ZERO ] === latLngEndPoint [ ZERO ]
			&&
			latLngStartPoint [ ONE ] === latLngEndPoint [ ONE ]
		) {

			// the method runs infinitely when latLngStartPoint === latLngEndPoint :-(
			return ZERO;
		}
		const latStartPoint = latLngStartPoint [ ZERO ] * DEGREES.toRadians;
		const latEndPoint = latLngEndPoint [ ZERO ] * DEGREES.toRadians;
		const deltaLng =
			(
				this.#normalizeLng ( latLngEndPoint [ ONE ] ) -
				this.#normalizeLng ( latLngStartPoint [ ONE ] )
			)
			* DEGREES.toRadians;
		return Math.acos (
			( Math.sin ( latStartPoint ) * Math.sin ( latEndPoint ) ) +
				( Math.cos ( latStartPoint ) * Math.cos ( latEndPoint ) * Math.cos ( deltaLng ) )
		) * EARTH_RADIUS;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of SphericalTrigonometry class
@type {SphericalTrigonometry}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theSphericalTrigonometry = new SphericalTrigonometry ( );

export default theSphericalTrigonometry;

/* --- End of file --------------------------------------------------------------------------------------------------------- */