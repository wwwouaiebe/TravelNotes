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
	- v1.0.0:
		- created
	- v1.4.0:
		- Replacing DataManager with TravelNotesData, Config, Version and DataSearchEngine
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v1.7.0:
		- Issue ♯89 : Add elevation graph
	- v2.0.0:
		- Issue ♯138 : Protect the app - control html entries done by user.
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file ItineraryPoint.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module data
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import ObjId from '../data/ObjId.js';
import ObjType from '../data/ObjType.js';
import TravelObject from '../data/TravelObject.js';
import { ELEV, LAT_LNG, DISTANCE, ZERO, ONE, INVALID_OBJ_ID } from '../main/Constants.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class ItineraryPoint
@classdesc This class represent an itinerary point
@extends TravelObject
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class ItineraryPoint extends TravelObject {

	static #objType = new ObjType ( 'ItineraryPoint', [ 'lat', 'lng', 'distance', 'elev', 'objId' ] );

	/**
	the latitude of the ItineraryPoint
	@type {number}
	@private
	*/

	#lat = LAT_LNG.defaultValue;

	/**
	the longitude of the ItineraryPoint
	@type {number}
	@private
	*/

	#lng = LAT_LNG.defaultValue;

	/**
	the distance between the beginning of the itinerary and the ItineraryPoint
	@type {number}
	@private
	*/

	#distance = DISTANCE.defaultValue;

	/**
	the elevation (if any)  of the ItineraryPoint
	@type {number}
	@private
	*/

	#elev = ELEV.defaultValue;

	/**
	the objId of the ItineraryPoint.
	@type {!number}
	@private
	*/

	#objId = INVALID_OBJ_ID;

	/*
	constructor
	*/

	constructor ( ) {
		super ( );
		this.#objId = ObjId.nextObjId;

	}

	/**
	the latitude of the ItineraryPoint
	@type {number}
	*/

	get lat ( ) { return this.#lat; }

	set lat ( lat ) {
		this.#lat = 'number' === typeof ( lat ) ? lat : LAT_LNG.defaultValue;
	}

	/**
	the longitude of the ItineraryPoint
	@type {number}
	*/

	get lng ( ) { return this.#lng; }

	set lng ( lng ) {
		this.#lng = 'number' === typeof ( lng ) ? lng : LAT_LNG.defaultValue;
	}

	/**
	the distance between the beginning of the itinerary and the ItineraryPoint
	@type {number}
	*/

	get distance ( ) { return this.#distance; }

	set distance ( distance ) {
		this.#distance = 'number' === typeof ( distance ) ? distance : DISTANCE.defaultValue;
	}

	/**
	the elevation (if any)  of the ItineraryPoint
	@type {number}
	*/

	get elev ( ) { return this.#elev; }

	set elev ( elev ) {
		this.#elev = 'number' === typeof ( elev ) ? elev : LAT_LNG.defaultValue;
	}

	/**
	the latitude and longitude of the ItineraryPoint
	@type {number[]}
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
	@readonly
	*/

	get objType ( ) { return ItineraryPoint.#objType; }

	/**
	the objId of the ItineraryPoint. objId are unique identifier given by the code
	@readonly
	@type {!number}
	*/

	get objId ( ) { return this.#objId; }

	/**
	An object literal with the ItineraryPoint properties and without any methods.
	This object can be used with the JSON object
	@type {Object}
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

/*
--- End of ItineraryPoint.js file ---------------------------------------------------------------------------------------------
*/