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
	- v1.6.0:
		- created
	- v1.7.0:
		- Issue ♯89 : Add elevation graph
	- v2.1.0:
		- Issue ♯151 : Add itineraries elevations distances and ObjIds to the compressed data...
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
Doc reviewed 20210901
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file FileCompactor.js
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

import thePolylineEncoder from '../coreLib/PolylineEncoder.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import ItineraryPoint from '../data/ItineraryPoint.js';
import Travel from '../data/Travel.js';
import { ROUTE_EDITION_STATUS, ELEV, ZERO, ONE, TWO, INVALID_OBJ_ID, LAT_LNG, DISTANCE } from '../main/Constants.js';

/**
@--------------------------------------------------------------------------------------------------------------------------

@class FileCompactor
@classdesc This class compress the travel to reduce the size of the file when saved to a file or decompress the
travel when reading from a file. Each route of a compressed file have the ItineraryPoints in only one object
and the lat and lng of	the ItineraryPoints are encoded with the polyline.encode algorithm
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class FileCompactor {

	/**
	Compress a route
	@param {Object} routeJsonObject the route to compress. routeJsonObject is not a Route instance!
	It's an Object created with Route.jsonObject ( ).
	@private
	*/

	#compressRoute ( routeJsonObject ) {
		const compressedItineraryPoints = {
			values : '',
			objType : new ItineraryPoint ( ).objType.jsonObject
		};
		const itineraryPoints = [];
		routeJsonObject.itinerary.itineraryPoints.forEach (
			itineraryPoint => {
				itineraryPoints.push (
					[
						itineraryPoint.lat,
						itineraryPoint.lng,
						itineraryPoint.distance,
						itineraryPoint.elev,
						itineraryPoint.objId
					]
				);
			}
		);
		compressedItineraryPoints.values = thePolylineEncoder.encode (
			itineraryPoints,
			[ LAT_LNG.fixed, LAT_LNG.fixed, TWO, TWO, ZERO ]
		);

		routeJsonObject.itinerary.itineraryPoints = compressedItineraryPoints;
	}

	/**
	Decompress a route
	@param {Object} routeJsonObject the compressed route. routeJsonObject is not a Route instance!
	It's an Object created with JSON.parse ( ).
	@private
	*/

	#decompressRoute ( routeJsonObject ) {
		const decompressedItineraryPoints = [];

		/*
		routeJsonObject.itinerary.itineraryPoints have values since version 2.1.0 ,
		routeJsonObject.itinerary.itineraryPoints have latLngs before version 2.1.0
		not possible to adapt with TravelUpdater because TravelUpdater is executed after this
		*/

		if ( routeJsonObject.itinerary.itineraryPoints.values ) {
			thePolylineEncoder.decode (
				routeJsonObject.itinerary.itineraryPoints.values,
				[ LAT_LNG.fixed, LAT_LNG.fixed, TWO, TWO, ZERO ]
			)
				.forEach (
					value => {
						const itineraryPoint = {
							lat : LAT_LNG.defaultValue,
							lng : LAT_LNG.defaultValue,
							distance : DISTANCE.defaultValue,
							elev : ELEV.defaultValue,
							objId : INVALID_OBJ_ID
						};
						[
							itineraryPoint.lat,
							itineraryPoint.lng,
							itineraryPoint.distance,
							itineraryPoint.elev,
							itineraryPoint.objId
						] = value;
						itineraryPoint.objType = routeJsonObject.itinerary.itineraryPoints.objType;
						decompressedItineraryPoints.push ( itineraryPoint );
					}
				);
		}
		else {
			routeJsonObject.itinerary.itineraryPoints.latLngs = thePolylineEncoder.decode (
				routeJsonObject.itinerary.itineraryPoints.latLngs, [ LAT_LNG.fixed, LAT_LNG.fixed ]
			);
			let latLngsCounter = ZERO;
			routeJsonObject.itinerary.itineraryPoints.latLngs.forEach (
				latLng => {
					const itineraryPoint = {};
					itineraryPoint.lat = latLng [ ZERO ];
					itineraryPoint.lng = latLng [ ONE ];
					itineraryPoint.distance = routeJsonObject.itinerary.itineraryPoints.distances [ latLngsCounter ];
					if ( routeJsonObject.itinerary.itineraryPoints.elevs ) {
						itineraryPoint.elev = routeJsonObject.itinerary.itineraryPoints.elevs [ latLngsCounter ];
					}
					else {
						itineraryPoint.elev = ELEV.defaultValue;
					}
					itineraryPoint.objId = routeJsonObject.itinerary.itineraryPoints.objIds [ latLngsCounter ];
					itineraryPoint.objType = routeJsonObject.itinerary.itineraryPoints.objType;
					decompressedItineraryPoints.push ( itineraryPoint );
					latLngsCounter ++;
				}
			);
		}
		routeJsonObject.itinerary.itineraryPoints = decompressedItineraryPoints;
	}

	/**
	Decompress a travel
	@param {Object} travelJsonObject the compressed travel. travelJsonObject is not a Travel instance!
	It's an Object created with JSON.parse ( ).
	@private
	*/

	#decompressTravel ( travelJsonObject ) {
		travelJsonObject.routes.forEach ( this.#decompressRoute );
		if ( travelJsonObject.editedRoute ) {

			// don't remove the if statment... files created with version < 1.5.0 don't have editedRoute...
			this.#decompressRoute ( travelJsonObject.editedRoute );
		}
	}

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Decompress a file
	@param {Object} travelJsonObject the compressed travel as read from the file. travelJsonObject is not a Travel instance!
	It's an Object created with JSON.parse ( ).
	*/

	decompress ( travelJsonObject ) {
		this.#decompressTravel ( travelJsonObject );
		theTravelNotesData.travel.jsonObject = travelJsonObject;
		theTravelNotesData.editedRouteObjId = INVALID_OBJ_ID;
		theTravelNotesData.travel.routes.forEach (
			route => {
				if ( ROUTE_EDITION_STATUS.notEdited !== route.editionStatus ) {
					theTravelNotesData.editedRouteObjId = route.objId;
				}
			}
		);
	}

	/**
	Decompress a file and merge this travel with the currently edited travel
	@param {Object} travelJsonObject the compressed travel as read from the file. travelJsonObject is not a Travel instance!
	It's an Object created with JSON.parse ( ).
	*/

	decompressMerge ( travelJsonObject ) {
		this.#decompressTravel ( travelJsonObject );
		const mergedTravel = new Travel ( );
		mergedTravel.jsonObject = travelJsonObject;

		// routes are added with their notes
		const routesIterator = mergedTravel.routes.iterator;
		while ( ! routesIterator.done ) {
			theTravelNotesData.travel.routes.add ( routesIterator.value );
		}

		// travel notes are added
		const notesIterator = mergedTravel.notes.iterator;
		while ( ! notesIterator.done ) {
			theTravelNotesData.travel.notes.add ( notesIterator.value );
		}
	}

	/**
	Compress the currently edited travel
	@return a copy of the currently edited travel compressed and ready to be written in a file
	*/

	compress ( travel ) {
		const compressedTravelJsonObject = travel.jsonObject;
		compressedTravelJsonObject.routes.forEach (
			routeJsonObject => this.#compressRoute ( routeJsonObject )
		);
		this.#compressRoute ( compressedTravelJsonObject.editedRoute );

		return compressedTravelJsonObject;
	}
}

export default FileCompactor;

/*
--- End of FileCompactor.js file ----------------------------------------------------------------------------------------------
*/