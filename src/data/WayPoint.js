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
import theUtilities from '../core/uiLib/Utilities.js';
import theHTMLSanitizer from '../core/htmlSanitizer/HTMLSanitizer.js';
import TravelObject from '../data/TravelObject.js';

import { LAT_LNG, ZERO, ONE, INVALID_OBJ_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class represent a way point
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class WayPoint extends TravelObject {

	/**
	The object type for wayPoints
	@type {ObjType}
	*/

	static #objType = new ObjType ( 'WayPoint', [ 'address', 'name', 'lat', 'lng', 'objId' ] );

	/**
	the name of the WayPoint
	@type {String}
	*/

	#name = '';

	/**
	the address of the WayPoint
	@type {String}
	*/

	#address = '';

	/**
	the latitude of the WayPoint
	@type {Number}
	*/

	#lat = LAT_LNG.defaultValue;

	/**
	the longitude of the WayPoint
	@type {Number}
	*/

	#lng = LAT_LNG.defaultValue;

	/**
	the objId of the WayPoint.
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
	the name of the WayPoint
	@type {String}
	*/

	get name ( ) { return this.#name; }

	set name ( Name ) {
		this.#name =
			'string' === typeof ( Name )
				?
				theHTMLSanitizer.sanitizeToJsString ( Name )
				:
				'';
	}

	/**
	the address of the WayPoint
	@type {String}
	*/

	get address ( ) { return this.#address; }

	set address ( address ) {
		this.#address =
			'string' === typeof ( address )
				?
				theHTMLSanitizer.sanitizeToJsString ( address )
				:
				'';
	}

	/**
	the latitude of the WayPoint
	@type {Number}
	*/

	get lat ( ) { return this.#lat; }

	set lat ( lat ) {
		this.#lat = 'number' === typeof ( lat ) ? lat : LAT_LNG.defaultValue;
	}

	/**
	the longitude of the WayPoint
	@type {Number}
	*/

	get lng ( ) { return this.#lng; }

	set lng ( lng ) {
		this.#lng = 'number' === typeof ( lng ) ? lng : LAT_LNG.defaultValue;
	}

	/**
	the full name of the WayPoint. Full name is created with the name and address or latitude and longitude
	of the WayPoint
	@type {String}
	*/

	get fullName ( ) {
		let fullName = ( '' === this.name ? this.address : this.name + ', ' + this.address );
		if ( '' === fullName ) {
			fullName = theUtilities.formatLatLng ( [ this.lat, this.lng ] );
		}

		return fullName;
	}

	/**
	the latitude and longitude of the WayPoint
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
	the objId of the WayPoint. objId are unique identifier given by the code
	@type {Number}
	*/

	get objId ( ) { return this.#objId; }

	/**
	the ObjType of the WayPoint.
	@type {ObjType}
	*/

	get objType ( ) { return WayPoint.#objType; }

	/**
	An object literal with the WayPoint properties and without any methods.
	This object can be used with the JSON object
	@type {JsonObject}
	*/

	get jsonObject ( ) {
		return {
			name : this.name,
			address : this.address,
			lat : parseFloat ( this.lat.toFixed ( LAT_LNG.fixed ) ),
			lng : parseFloat ( this.lng.toFixed ( LAT_LNG.fixed ) ),
			objId : this.#objId,
			objType : this.objType.jsonObject
		};
	}

	set jsonObject ( something ) {
		const otherthing = this.validateObject ( something );
		this.address = otherthing.address;
		this.name = otherthing.name;
		this.lat = otherthing.lat;
		this.lng = otherthing.lng;
		this.#objId = ObjId.nextObjId;
	}
}

export default WayPoint;

/* --- End of file --------------------------------------------------------------------------------------------------------- */