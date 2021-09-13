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
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
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

@file WayPoint.js
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

/* eslint no-fallthrough: ["error", { "commentPattern": "eslint break omitted intentionally" }]*/

import ObjId from '../data/ObjId.js';
import ObjType from '../data/ObjType.js';
import theUtilities from '../UILib/Utilities.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';

import { LAT_LNG, ZERO, ONE, INVALID_OBJ_ID } from '../main/Constants.js';

const OUR_OBJ_TYPE = new ObjType ( 'WayPoint' );

/**
@--------------------------------------------------------------------------------------------------------------------------

@class WayPoint
@classdesc This class represent a way point

@--------------------------------------------------------------------------------------------------------------------------
*/

class WayPoint {

	#name = '';
	#address = '';
	#lat = LAT_LNG.defaultValue;
	#lng = LAT_LNG.defaultValue;

	#objId = INVALID_OBJ_ID;;

	/**
	Verify that the parameter can be transformed to a WayPoint and performs the upgrate if needed
	@param {Object} something an object to validate
	@return {Object} the validated object
	@throws {Error} when the parameter is invalid
	@private
	*/

	#validateObject ( something ) {
		if ( ! Object.getOwnPropertyNames ( something ).includes ( 'objType' ) ) {
			throw new Error ( 'No objType for ' + OUR_OBJ_TYPE.name );
		}
		OUR_OBJ_TYPE.validate ( something.objType );
		let properties = Object.getOwnPropertyNames ( something );
		[ 'address', 'name', 'lat', 'lng', 'objId' ].forEach (
			property => {
				if ( ! properties.includes ( property ) ) {
					throw new Error ( 'No ' + property + ' for ' + OUR_OBJ_TYPE.name );
				}
			}
		);
		return something;
	}

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#objId = ObjId.nextObjId;
	}

	/**
	the name of the WayPoint
	@type {string}
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
	@type {string}
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
	@type {number}
	*/

	get lat ( ) { return this.#lat; }

	set lat ( lat ) {
		this.#lat = 'number' === typeof ( lat ) ? lat : LAT_LNG.defaultValue;
	}

	/**
	the longitude of the WayPoint
	@type {number}
	*/

	get lng ( ) { return this.#lng; }

	set lng ( lng ) {
		this.#lng = 'number' === typeof ( lng ) ? lng : LAT_LNG.defaultValue;
	}

	/**
	the full name of the WayPoint. Full name is created with the name and address or latitude and longitude
	of the WayPoint
	@readonly
	@type {string}
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
	the objId of the WayPoint. objId are unique identifier given by the code
	@readonly
	@type {!number}
	*/

	get objId ( ) { return this.#objId; }

	/**
	the ObjType of the WayPoint.
	@type {ObjType}
	@readonly
	*/

	get objType ( ) { return OUR_OBJ_TYPE; }

	/**
	An object literal with the WayPoint properties and without any methods.
	This object can be used with the JSON object
	@type {Object}
	*/

	get jsonObject ( ) {
		return {
			name : this.name,
			address : this.address,
			lat : parseFloat ( this.lat.toFixed ( LAT_LNG.fixed ) ),
			lng : parseFloat ( this.lng.toFixed ( LAT_LNG.fixed ) ),
			objId : this.#objId,
			objType : OUR_OBJ_TYPE.jsonObject
		};
	}

	set jsonObject ( something ) {
		const otherthing = this.#validateObject ( something );
		this.address = otherthing.address;
		this.name = otherthing.name;
		this.lat = otherthing.lat;
		this.lng = otherthing.lng;
		this.#objId = ObjId.nextObjId;
	}
}

export default WayPoint;

/*
--- End of WayPoint.js file ---------------------------------------------------------------------------------------------------
*/