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
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import theConfig from '../data/Config.js';

import { ZERO, ONE, TWO, THREE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Smooth a route profile
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ProfileSmoothingIron {

	/**
	The route for witch the profile will be smoothed
	@type {Route}
	*/

	#route;

	/**
	The distance between smooth points
	@type {Number}
	*/

	#smoothDistance;

	/**
	An array with point used to smooth the elevation
	@type {Array.<Object>}
	*/

	#smoothPoints;

	/**
	The number of points used to compute the smooth elevation. Alias for theConfig.route.elev.smoothPoints.
	@type {Number}
	*/

	get #smoothPointsNumber ( ) { return theConfig.route.elev.smoothPoints; }

	/**
	Create the array of points with the elevation
	*/

	#createSmoothPoints ( ) {
		this.#smoothPoints = [];

		// first point
		this.#smoothPoints.push (
			{
				distance : ZERO,
				elev : this.#route.itinerary.itineraryPoints.first.elev,
				smoothElev : this.#route.itinerary.itineraryPoints.first.elev
			}
		);
		const itineraryPointsIterator = this.#route.itinerary.itineraryPoints.iterator;
		itineraryPointsIterator.done;
		let previousItineraryPointDistance = ZERO;
		let itineraryPointdistance = itineraryPointsIterator.value.distance;
		let previousItineraryPointElev = itineraryPointsIterator.value.elev;
		itineraryPointsIterator.done;

		let smoothPointDistance = this.#smoothDistance;

		// next points
		while ( smoothPointDistance < this.#route.distance ) {

			if ( itineraryPointdistance < smoothPointDistance ) {
				previousItineraryPointDistance = itineraryPointdistance;
				previousItineraryPointElev = itineraryPointsIterator.value.elev;
				while ( itineraryPointdistance < smoothPointDistance ) {
					itineraryPointdistance += itineraryPointsIterator.value.distance;
					itineraryPointsIterator.done;
				}
			}

			let ascentFactor =
				( itineraryPointsIterator.value.elev - previousItineraryPointElev )
				/
				( itineraryPointdistance - previousItineraryPointDistance );
			const smoothPointElev =
				previousItineraryPointElev
				+
				( ( smoothPointDistance - previousItineraryPointDistance ) * ascentFactor );
			this.#smoothPoints.push (
				{
					distance : smoothPointDistance,
					elev : smoothPointElev,
					smoothElev : ZERO
				}
			);
			smoothPointDistance += this.#smoothDistance;
		}

		// last point
		this.#smoothPoints.push (
			{
				distance : this.#route.distance,
				elev : this.#route.itinerary.itineraryPoints.last.elev,
				smoothElev : this.#route.itinerary.itineraryPoints.last.elev
			}
		);
	}

	/**
	Compute the smooth elevation for the points in the array
	*/

	#computeSmoothElev ( ) {
		let deltaElev =
			( this.#smoothPoints [ this.#smoothPointsNumber - ONE ].elev - this.#smoothPoints [ ZERO ].elev )
			/
			( this.#smoothPointsNumber - ONE );

		let pointCounter = ZERO;
		for ( pointCounter = ZERO; pointCounter < this.#smoothPointsNumber; pointCounter ++ ) {
			this.#smoothPoints [ pointCounter ].smoothElev =
				this.#smoothPoints [ ZERO ].elev + ( deltaElev * pointCounter );
		}

		for (
			pointCounter = this.#smoothPointsNumber;
			pointCounter < this.#smoothPoints.length - this.#smoothPointsNumber;
			pointCounter ++
		) {
			let elevSum = ZERO;
			for (
				let pointNumber = pointCounter - this.#smoothPointsNumber;
				pointNumber <= pointCounter + this.#smoothPointsNumber;
				pointNumber ++
			) {
				elevSum += this.#smoothPoints [ pointNumber ].elev;
			}
			this.#smoothPoints [ pointCounter ].smoothElev = elevSum / ( ( this.#smoothPointsNumber * TWO ) + ONE );
		}

		pointCounter --;

		const deltaSmoothElev =
			(
				this.#smoothPoints [ pointCounter + this.#smoothPointsNumber ].smoothElev
				-
				this.#smoothPoints [ pointCounter ].smoothElev
			)
			/
			this.#smoothPointsNumber;

		let tmpSmoothElev = this.#smoothPoints [ pointCounter ].smoothElev;
		let tmpPointCounter = ONE;

		pointCounter ++;

		for ( ; pointCounter < this.#smoothPoints.length - ONE; tmpPointCounter ++, pointCounter ++ ) {
			this.#smoothPoints [ pointCounter ].smoothElev =
				tmpSmoothElev + ( deltaSmoothElev * tmpPointCounter );
		}
	}

	/**
	Compute the smooth distance
	The smooth distance is depending of the toal ascent and descent of the route and of the route distance.
	Smooth distance must be an integer.
	*/

	#computeSmoothDistance ( ) {

		// computing the distance and elev of the route (elev is the sum of ascent and descent see Math.abs)
		const itineraryPointsIterator = this.#route.itinerary.itineraryPoints.iterator;
		let elev = ZERO;
		while ( ! itineraryPointsIterator.done ) {
			elev +=
				itineraryPointsIterator.next
					?
					Math.abs ( itineraryPointsIterator.value.elev - itineraryPointsIterator.next.elev )
					:
					ZERO;

		}

		// Computing smooth distance
		this.#smoothDistance =
			Math.floor (
				Math.min (
					theConfig.route.elev.smoothCoefficient * this.#route.distance / elev,
					this.#route.distance / ( THREE * this.#smoothPointsNumber )
				)
			);
	}

	/**
	Report the smooth elev from the smoothPoints array to the route itinerary
	*/

	#setSmoothElev ( ) {

		const itineraryPointsIterator = this.#route.itinerary.itineraryPoints.iterator;

		// we skip the first itinerary point
		itineraryPointsIterator.done;
		let itineraryPointsTotalDistance = itineraryPointsIterator.value.distance;

		// loop on the itinerary point to push the smooth elev
		while ( ! itineraryPointsIterator.done ) {
			const previousIronPoint =
			this.#smoothPoints [ Math.floor ( itineraryPointsTotalDistance / this.#smoothDistance ) ];
			const nextIronPoint =
				this.#smoothPoints [ Math.ceil ( itineraryPointsTotalDistance / this.#smoothDistance ) ];

			// nextIronPoint is null for the last itineray point, so the last point is also skipped
			if ( previousIronPoint && nextIronPoint ) {
				const deltaDist = itineraryPointsTotalDistance - previousIronPoint.distance;
				const ascentFactor = ( nextIronPoint.elev - previousIronPoint.elev ) /
					( nextIronPoint.distance - previousIronPoint.distance );
				itineraryPointsIterator.value.elev = previousIronPoint.elev + ( deltaDist * ascentFactor );
			}
			itineraryPointsTotalDistance += itineraryPointsIterator.value.distance;
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Smooth a route profile.
	@param {Route} route The route to smooth
	*/

	smooth ( route ) {
		this.#route = route;
		this.#computeSmoothDistance ( );
		this.#createSmoothPoints ( );
		this.#computeSmoothElev ( );
		this.#setSmoothElev ( );
	}
}

export default ProfileSmoothingIron;

/* --- End of file --------------------------------------------------------------------------------------------------------- */