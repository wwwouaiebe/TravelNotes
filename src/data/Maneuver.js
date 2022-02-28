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
	- v1.0.0:
		- created
	- v1.4.0:
		- Replacing DataManager with TravelNotesData, Config, Version and DataSearchEngine
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v2.0.0:
		- Issue ♯138 : Protect the app - control html entries done by user.
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

import ObjId from '../data/ObjId.js';
import ObjType from '../data/ObjType.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import TravelObject from '../data/TravelObject.js';
import { DISTANCE, INVALID_OBJ_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class represent a maneuver
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class Maneuver extends TravelObject {

	/**
	The object type for maneuvers
	@type {ObjType}
	*/

	static #objType = new ObjType (
		'Maneuver',
		[ 'iconName', 'instruction', 'distance', 'duration', 'itineraryPointObjId', 'objId' ]
	);

	/**
	The icon displayed with the Maneuver in the roadbook
	@type {String}
	*/

	#iconName = '';

	/**
	The instruction of the Maneuver
	@type {String}
	*/

	#instruction = '';

	/**
	The objId of the ItineraryPoint at the same position than the Maneuver
	@type {Number}
	*/

	#itineraryPointObjId = INVALID_OBJ_ID;

	/**
	The distance between the Maneuver and the next Maneuver
	@type {Number}
	*/

	#distance = DISTANCE.defaultValue;

	/**
	The time between the Maneuver and the next Maneuver
	@type {Number}
	*/

	#duration = DISTANCE.defaultValue;

	/**
	the objId of the Maneuver.
	@type {Number}
	*/

	#objId = INVALID_OBJ_ID;

	/**
	the constructor
	*/

	constructor ( ) {
		super ( );
		this.#objId = ObjId.nextObjId;
	}

	/**
	The icon displayed with the Maneuver in the roadbook
	@type {String}
	*/

	get iconName ( ) { return this.#iconName; }

	set iconName ( iconName ) {
		this.#iconName = 'string' === typeof ( iconName ) ? theHTMLSanitizer.sanitizeToJsString ( iconName ) : '';
	}

	/**
	The instruction of the Maneuver
	@type {String}
	*/

	get instruction ( ) { return this.#instruction; }

	set instruction ( instruction ) {
		this.#instruction = 'string' === typeof ( instruction ) ? theHTMLSanitizer.sanitizeToJsString ( instruction ) : '';
	}

	/**
	The objId of the ItineraryPoint at the same position than the Maneuver
	@type {Number}
	*/

	get itineraryPointObjId ( ) { return this.#itineraryPointObjId; }

	set itineraryPointObjId ( itineraryPointObjId ) {
		this.#itineraryPointObjId = 'number' === typeof ( itineraryPointObjId ) ? itineraryPointObjId : INVALID_OBJ_ID;
	}

	/**
	The distance between the Maneuver and the next Maneuver
	@type {Number}
	*/

	get distance ( ) { return this.#distance; }

	set distance ( distance ) {
		this.#distance = 'number' === typeof ( distance ) ? distance : DISTANCE.defaultValue;
	}

	/**
	The time between the Maneuver and the next Maneuver
	@type {Number}
	*/

	get duration ( ) { return this.#duration; }

	set duration ( duration ) {
		this.#duration = 'number' === typeof ( duration ) ? duration : DISTANCE.defaultValue;
	}

	/**
	the ObjType of the Maneuver.
	@type {ObjType}
	*/

	get objType ( ) { return Maneuver.#objType; }

	/**
	the objId of the Maneuver. objId are unique identifier given by the code
	@type {Number}
	*/

	get objId ( ) { return this.#objId; }

	/**
	An object literal with the Maneuver properties and without any methods.
	This object can be used with the JSON object
	@type {JsonObject}
	*/

	get jsonObject ( ) {
		return {
			iconName : this.iconName,
			instruction : this.instruction,
			distance : parseFloat ( this.distance.toFixed ( DISTANCE.fixed ) ),
			duration : this.duration,
			itineraryPointObjId : this.itineraryPointObjId,
			objId : this.#objId,
			objType : this.objType.jsonObject
		};
	}
	set jsonObject ( something ) {
		const otherthing = this.validateObject ( something );
		this.iconName = otherthing.iconName;
		this.instruction = otherthing.instruction;
		this.distance = otherthing.distance;
		this.duration = otherthing.duration;
		this.itineraryPointObjId = otherthing.itineraryPointObjId;
		this.#objId = ObjId.nextObjId;
	}
}

export default Maneuver;

/* --- End of file --------------------------------------------------------------------------------------------------------- */