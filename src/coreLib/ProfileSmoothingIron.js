/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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

/**
@------------------------------------------------------------------------------------------------------------------------------

@file ProfileSmoothingIron.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module coreLib
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import theConfig from '../data/Config.js';

import { ZERO, ONE, TWO } from '../main/Constants.js';

const TEN = 10;

/**
@------------------------------------------------------------------------------------------------------------------------------

@class ProfileSmoothingIron
@classdesc Smooth a route profile
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class ProfileSmoothingIron {

	/**
	The route for witch the profile will be smoothed
	@type {Route}
	@private
	*/

	#route = null;

	/**
	The distance between smooth points
	@type {number}
	@private
	*/

	#smoothDistance = ZERO;

	/**
	The number of points used to compute the elevation
	#type {number}
	@private
	*/

	#SmoothPointsNumber = theConfig.route.elev.smoothPoints;

	/**
	@type {Array.<Object>}
	@private
	*/

	#tempSmoothPoints = [];

	/**
	@type {Map}
	@private
	*/

	#smoothPoints = new Map ( );

	/**
	This method creates an array with temporary points that are all at the same distance.
	Elevation of tmp points is computed from the elevation of the route to smooth
	@private
	*/

	#createTempSmoothPoints ( ) {

		let tempPointsDistance = ZERO;
		let tmpPointElev = ZERO;
		let itineraryPointsDistance = ZERO;
		this.#tempSmoothPoints = [];
		const itineraryPointsIterator = this.#route.itinerary.itineraryPoints.iterator;

		// going to the first itinerary point
		let done = itineraryPointsIterator.done;

		// adding the first itinerary point to the tempSmoothPoints
		this.#tempSmoothPoints.push ( { distance : tempPointsDistance, elev : itineraryPointsIterator.value.elev } );

		// going to the second itinerary point
		itineraryPointsDistance += itineraryPointsIterator.value.distance;
		done = itineraryPointsIterator.done;

		// loop on next itinerary points
		while ( ! done ) {
			tempPointsDistance += this.#smoothDistance;

			// loop on the itinerary points till we pass the itinerary point distance
			while ( tempPointsDistance >= itineraryPointsDistance && ! done ) {
				itineraryPointsDistance += itineraryPointsIterator.value.distance;
				done = itineraryPointsIterator.done;
			}
			if ( ! done ) {

				// adding temp point
				const ascentFactor = ( itineraryPointsIterator.value.elev - itineraryPointsIterator.previous.elev ) /
					itineraryPointsIterator.previous.distance;
				tmpPointElev =
					itineraryPointsIterator.value.elev -
					( ( itineraryPointsDistance - tempPointsDistance ) * ascentFactor );
				this.#tempSmoothPoints.push ( { distance : tempPointsDistance, elev : tmpPointElev } );
			}
		}

		// last itinerary point is added
		this.#tempSmoothPoints.push (
			{
				distance : itineraryPointsDistance,
				elev : this.#route.itinerary.itineraryPoints.last.elev
			}
		);

		return this.#tempSmoothPoints;
	}

	/**
	Create a map from the tmppoints with smooth elevation
	@private
	*/

	#createSmoothPoints ( ) {

		this.#smoothPoints.clear ( );

		let deltaElev =
			( this.#tempSmoothPoints [ this.#SmoothPointsNumber ].elev - this.#tempSmoothPoints [ ZERO ].elev )
			/
			this.#SmoothPointsNumber;

		let pointCounter = ZERO;

		// Computing the first elevs
		for ( pointCounter = ZERO; pointCounter < this.#SmoothPointsNumber; pointCounter ++ ) {
			this.#smoothPoints.set (
				pointCounter * this.#smoothDistance,
				{
					distance : pointCounter * this.#smoothDistance,
					elev : this.#tempSmoothPoints [ ZERO ].elev + ( deltaElev * pointCounter )
				}
			);
		}

		// Computing next elevs
		for (
			pointCounter = this.#SmoothPointsNumber;
			pointCounter < this.#tempSmoothPoints.length - this.#SmoothPointsNumber;
			pointCounter ++
		) {
			let elevSum = ZERO;
			for (
				let pointNumber = pointCounter - this.#SmoothPointsNumber;
				pointCounter + this.#SmoothPointsNumber >= pointNumber;
				pointNumber ++
			) {
				elevSum += this.#tempSmoothPoints [ pointNumber ].elev;
			}
			this.#smoothPoints.set (
				this.#tempSmoothPoints [ pointCounter ].distance,
				{
					distance : this.#tempSmoothPoints [ pointCounter ].distance,
					elev : elevSum / ( ( this.#SmoothPointsNumber * TWO ) + ONE )
				}
			);
		}

		pointCounter --;

		deltaElev =
			this.#smoothDistance
			*
			(
				this.#tempSmoothPoints [ this.#tempSmoothPoints.length - ONE ].elev -
				this.#tempSmoothPoints [ this.#tempSmoothPoints.length - ONE - this.#SmoothPointsNumber ].elev
			)
			/
			(
				this.#tempSmoothPoints [ this.#tempSmoothPoints.length - ONE ].distance -
				this.#tempSmoothPoints [ this.#tempSmoothPoints.length - ONE - this.#SmoothPointsNumber ].distance
			);

		// Computing the last elevs
		this.#smoothPoints.set (
			this.#tempSmoothPoints [ pointCounter ].distance + this.#smoothDistance,
			{
				distance : this.#tempSmoothPoints [ pointCounter ].distance + this.#smoothDistance,
				elev : this.#tempSmoothPoints [ pointCounter ].elev + deltaElev
			}
		);
		this.#smoothPoints.set (
			this.#tempSmoothPoints [ pointCounter ].distance + ( this.#smoothDistance * TWO ),
			{
				distance : this.#tempSmoothPoints [ pointCounter ].distance + ( this.#smoothDistance * TWO ),
				elev : this.#tempSmoothPoints [ pointCounter ].elev + ( deltaElev * TWO )
			}
		);
	}

	/**
	Compute the smooth distance
	The smooth distance is depending of the toal ascent and descent of the route and of the route distance.
	Smooth distance must be an integer.
	@private
	*/

	#computeSmoothDistance ( ) {

		// computing the distance and elev of the route (elev is the sum of ascent and descent see Math.abs)
		const itineraryPointsIterator = this.#route.itinerary.itineraryPoints.iterator;
		let distance = ZERO;
		let elev = ZERO;
		while ( ! itineraryPointsIterator.done ) {
			distance += itineraryPointsIterator.value.distance;
			elev +=
				itineraryPointsIterator.next
					?
					Math.abs ( itineraryPointsIterator.value.elev - itineraryPointsIterator.next.elev )
					:
					ZERO;

		}

		// Computing smooth distance
		this.#smoothDistance =
			Number.parseInt ( Math.floor ( theConfig.route.elev.smoothCoefficient / ( elev / distance ) ) * TEN );

		// The route is too short to be smoothed. Setting smooth distance to null
		if ( distance <= TWO * this.#SmoothPointsNumber * this.#smoothDistance ) {
			this.#smoothDistance = null;
		}
	}

	/**
	Report the smooth elev from the smoothPoints map to the route
	@private
	*/

	#setSmoothElev ( ) {
		const itineraryPointsIterator = this.#route.itinerary.itineraryPoints.iterator;

		// we skip the first itinerary point
		itineraryPointsIterator.done;
		let itineraryPointsTotalDistance = itineraryPointsIterator.value.distance;

		// loop on the itinerary point to push the smooth elev
		while ( ! itineraryPointsIterator.done ) {
			const previousIronPoint = this.#smoothPoints.get (
				Math.floor ( itineraryPointsTotalDistance / this.#smoothDistance ) * this.#smoothDistance );
			const nextIronPoint = this.#smoothPoints.get (
				Math.ceil ( itineraryPointsTotalDistance / this.#smoothDistance ) * this.#smoothDistance );
			if ( previousIronPoint && nextIronPoint ) {
				const deltaDist = itineraryPointsTotalDistance - previousIronPoint.distance;
				const ascentFactor = ( nextIronPoint.elev - previousIronPoint.elev ) /
					( nextIronPoint.distance - previousIronPoint.distance );
				itineraryPointsIterator.value.elev = previousIronPoint.elev + ( deltaDist * ascentFactor );
			}
			itineraryPointsTotalDistance += itineraryPointsIterator.value.distance;
		}
	}

	/*
	constructor
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
		if ( ! this.#smoothDistance ) {
			return;
		}
		this.#createTempSmoothPoints ( );
		this.#createSmoothPoints ( );
		this.#setSmoothElev ( );
	}
}

export default ProfileSmoothingIron;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of ProfileSmoothingIron.js file

@------------------------------------------------------------------------------------------------------------------------------
*/