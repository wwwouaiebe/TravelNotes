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

import ObjId from '../data/ObjId.js';
import ObjType from '../data/ObjType.js';
import TravelObject from '../data/TravelObject.js';
import { ELEV, LAT_LNG, DISTANCE, ZERO, ONE, INVALID_OBJ_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class represent an itinerary point
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ItineraryPoint extends TravelObject {

	/**
	The object type for itinerary points
	@type {ObjType}
	*/

	static #objType = new ObjType ( 'ItineraryPoint', [ 'lat', 'lng', 'distance', 'elev', 'objId' ] );

	/**
	the latitude of the ItineraryPoint
	@type {Number}
	*/

	#lat = LAT_LNG.defaultValue;

	/**
	the longitude of the ItineraryPoint
	@type {Number}
	*/

	#lng = LAT_LNG.defaultValue;

	/**
	the distance between the beginning of the itinerary and the ItineraryPoint
	@type {Number}
	*/

	#distance = DISTANCE.defaultValue;

	/**
	the elevation (if any)  of the ItineraryPoint
	@type {Number}
	*/

	#elev = ELEV.defaultValue;

	/**
	the objId of the ItineraryPoint.
	@type {Number}
	*/

	#objId = INVALID_OBJ_ID;

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
		this.#objId = ObjId.nextObjId;

	}

	/**
	the latitude of the ItineraryPoint
	@type {Number}
	*/

	get lat ( ) { return this.#lat; }

	set lat ( lat ) {
		this.#lat = 'number' === typeof ( lat ) ? lat : LAT_LNG.defaultValue;
	}

	/**
	the longitude of the ItineraryPoint
	@type {Number}
	*/

	get lng ( ) { return this.#lng; }

	set lng ( lng ) {
		this.#lng = 'number' === typeof ( lng ) ? lng : LAT_LNG.defaultValue;
	}

	/**
	the distance between the ItineraryPoint and the next ItineraryPoint
	@type {Number}
	*/

	get distance ( ) { return this.#distance; }

	set distance ( distance ) {
		this.#distance = 'number' === typeof ( distance ) ? distance : DISTANCE.defaultValue;
	}

	/**
	the elevation (if any)  of the ItineraryPoint
	@type {Number}
	*/

	get elev ( ) { return this.#elev; }

	set elev ( elev ) {
		this.#elev = 'number' === typeof ( elev ) ? elev : LAT_LNG.defaultValue;
	}

	/**
	the latitude and longitude of the ItineraryPoint
	@type {Array.<number>}
	*/

	get latLng ( ) { return [ this.lat, this.lng ]; }

	set latLng ( latLng ) {
		if (
			'number' === typeof ( latLng [ ZERO ] )
			&&
			'number' === typeof ( latLng [ ONE ] )
		) {
			this.#lat = latLng [ ZERO ];
			this.#lng = latLng [ ONE ];
		}
		else {
			this.#lat = LAT_LNG.defaultValue;
			this.#lng = LAT_LNG.defaultValue;
		}
	}

	/**
	the ObjType of the WayPoint.
	@type {ObjType}
	*/

	get objType ( ) { return ItineraryPoint.#objType; }

	/**
	the objId of the ItineraryPoint. objId are unique identifier given by the code
	@type {Number}
	*/

	get objId ( ) { return this.#objId; }

	/**
	An object literal with the ItineraryPoint properties and without any methods.
	This object can be used with the JSON object
	@type {JsonObject}
	*/

	get jsonObject ( ) {
		return {
			lat : parseFloat ( this.lat.toFixed ( LAT_LNG.fixed ) ),
			lng : parseFloat ( this.lng.toFixed ( LAT_LNG.fixed ) ),
			distance : parseFloat ( this.distance.toFixed ( DISTANCE.fixed ) ),
			elev : parseFloat ( this.elev.toFixed ( ELEV.fixed ) ),
			objId : this.#objId,
			objType : this.objType.jsonObject
		};
	}

	set jsonObject ( something ) {
		const otherthing = this.validateObject ( something );
		this.lat = otherthing.lat;
		this.lng = otherthing.lng;
		this.distance = otherthing.distance;
		this.elev = otherthing.elev;
		this.#objId = ObjId.nextObjId;
	}
}

export default ItineraryPoint;

/* --- End of file --------------------------------------------------------------------------------------------------------- */