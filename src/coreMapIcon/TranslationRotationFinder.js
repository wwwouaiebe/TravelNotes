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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import theConfig from '../data/Config.js';
import theGeometry from '../coreLib/Geometry.js';
import theSphericalTrigonometry from '../coreLib/SphericalTrigonometry.js';

import { ICON_DIMENSIONS, ZERO, ONE, TWO, DEGREES, ICON_POSITION } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Search:
- the translation needed to have the icon point in the middle of the icon
- the rotation needed to have the entry point at the bottom of the icon
- the direction to follow
- adapt the icon if icon is on the start or the end point
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TranslationRotationFinder {

	/**
	A reference to the computeData object of the MapIconFromOsmFactory
	@type {ComputeDataForMapIcon}
	*/

	#computeData;

	/**
	A reference to the noteData Object of the MapIconFromOsmFactory
	@type {NoteDataForMapIcon}
	*/

	#noteData;

	/**
	A reference to the itineraryPoint used to compute the rotation
	@type {ItineraryPoint}
	*/

	#rotationItineraryPoint;

	/**
	A reference to the itineraryPoint used to compute the direction
	@type {ItineraryPoint}
	*/

	#directionItineraryPoint;

	/**
	The coordinates in pixel of the icon point
	@type {Array.<Number>}
	*/

	#iconPoint;

	/**
	This method compute the translation needed to have the itinerary point in the middle of the svg
	*/

	#computeTranslation ( ) {
		this.#computeData.translation = theGeometry.subtrackPoints (
			[ ICON_DIMENSIONS.svgViewboxDim / TWO, ICON_DIMENSIONS.svgViewboxDim / TWO ],
			theGeometry.project ( this.#noteData.latLng, theConfig.note.svgIcon.zoom )
		);
	}

	/**
	Searching a point at least at 10 m ( theConfig.note.svgIcon.angleDistance ) from the icon point for rotation
	*/

	#findRotationPoint ( ) {

		this.#rotationItineraryPoint = this.#computeData.route.itinerary.itineraryPoints.previous (
			this.#computeData.nearestItineraryPointObjId,
			itineraryPoint => theSphericalTrigonometry.pointsDistance ( itineraryPoint.latLng, this.#noteData.latLng )
				>
				theConfig.note.svgIcon.angleDistance
		)
		||
		this.#computeData.route.itinerary.itineraryPoints.first;
	}

	/**
	Searching a point at least at 10 m ( theConfig.note.svgIcon.angleDistance ) from the icon point for direction
	*/

	#findDirectionPoint ( ) {

		this.#directionItineraryPoint = this.#computeData.route.itinerary.itineraryPoints.next (
			this.#computeData.nearestItineraryPointObjId,
			itineraryPoint => theSphericalTrigonometry.pointsDistance ( itineraryPoint.latLng, this.#noteData.latLng )
				>
				theConfig.note.svgIcon.angleDistance
		)
		||
		this.#computeData.route.itinerary.itineraryPoints.last;
	}

	/**
	Transform the latLng of the icon ro pixel coordinates relative to the map origin
	*/

	#computeIconPoint ( ) {
		this.#iconPoint = theGeometry.addPoints (
			theGeometry.project ( this.#noteData.latLng, theConfig.note.svgIcon.zoom ),
			this.#computeData.translation
		);

	}

	/**
	Computing rotation... if possible
	*/

	#findRotation ( ) {

		if (
			this.#computeData.nearestItineraryPointObjId
			!==
			this.#computeData.route.itinerary.itineraryPoints.first.objId
		) {
			const rotationPoint = theGeometry.addPoints (
				theGeometry.project ( this.#rotationItineraryPoint.latLng, theConfig.note.svgIcon.zoom ),
				this.#computeData.translation
			);
			this.#computeData.rotation =
				Math.atan (
					( this.#iconPoint [ ONE ] - rotationPoint [ ONE ] )
					/
					( rotationPoint [ ZERO ] - this.#iconPoint [ ZERO ] )
				)
				*
				DEGREES.d180 / Math.PI;

			if ( ZERO > this.#computeData.rotation ) {
				this.#computeData.rotation += DEGREES.d360;
			}
			this.#computeData.rotation -= DEGREES.d270;

			// point 0,0 of the svg is the UPPER left corner
			if ( ZERO > rotationPoint [ ZERO ] - this.#iconPoint [ ZERO ] ) {
				this.#computeData.rotation += DEGREES.d180;
			}
		}
	}

	/**
	Computing direction ... if possible
	*/

	#findDirection ( ) {
		if (
			this.#computeData.nearestItineraryPointObjId
			!==
			this.#computeData.route.itinerary.itineraryPoints.last.objId
		) {
			const directionPoint = theGeometry.addPoints (
				theGeometry.project ( this.#directionItineraryPoint.latLng, theConfig.note.svgIcon.zoom ),
				this.#computeData.translation
			);
			this.#computeData.direction = Math.atan (
				( this.#iconPoint [ ONE ] - directionPoint [ ONE ] )
				/
				( directionPoint [ ZERO ] - this.#iconPoint [ ZERO ] )
			)
				*
				DEGREES.d180 / Math.PI;

			// point 0,0 of the svg is the UPPER left corner
			if ( ZERO > directionPoint [ ZERO ] - this.#iconPoint [ ZERO ] ) {
				this.#computeData.direction += DEGREES.d180;
			}
			this.#computeData.direction -= this.#computeData.rotation;

			// setting direction between 0 and 360
			while ( DEGREES.d0 > this.#computeData.direction ) {
				this.#computeData.direction += DEGREES.d360;
			}
			while ( DEGREES.d360 < this.#computeData.direction ) {
				this.#computeData.direction -= DEGREES.d360;
			}
		}
	}

	/**
	Search if the icon is at the start or the end of the route and adapt data
	*/

	#findPositionOnRoute ( ) {
		if (
			this.#computeData.nearestItineraryPointObjId
			===
			this.#computeData.route.itinerary.itineraryPoints.first.objId
		) {
			this.#computeData.rotation = -this.#computeData.direction - DEGREES.d90;
			this.#computeData.direction = null;
			this.#computeData.positionOnRoute = ICON_POSITION.atStart;
		}

		if (
			this.#noteData.latLng [ ZERO ] === this.#computeData.route.itinerary.itineraryPoints.last.lat
			&&
			this.#noteData.latLng [ ONE ] === this.#computeData.route.itinerary.itineraryPoints.last.lng
		) {

			// using lat & lng because last point is sometime duplicated
			this.#computeData.direction = null;
			this.#computeData.positionOnRoute = ICON_POSITION.atEnd;
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	this method compute the rotation needed to have the SVG oriented on the itinerary
	and compute also the direction to take after the icon
	@param {ComputeDataForMapIcon} computeData The object with the data needed for the computations
	@param {NoteDataForMapIcon} noteData The object with the nota data
	*/

	findData ( computeData, noteData ) {

		this.#computeData = computeData;
		this.#noteData = noteData;

		this.#computeTranslation ( );
		this.#findRotationPoint ( );
		this.#findDirectionPoint ( );
		this.#computeIconPoint ( );
		this.#findRotation ( );
		this.#findDirection ( );
		this.#findPositionOnRoute ( );
	}
}

export default TranslationRotationFinder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */