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
	- v1.8.0:
		- Issue ♯100 : Fix circular dependancies with Collection
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
import Collection from '../data/Collection.js';
import ItineraryPoint from '../data/ItineraryPoint.js';
import Maneuver from '../data/Maneuver.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import TravelObject from '../data/TravelObject.js';
import { ZERO, INVALID_OBJ_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class represent an itinerary
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class Itinerary	extends TravelObject {

	/**
	The object type for itineraries
	@type {ObjType}
	*/

	static #objType = new ObjType (
		'Itinerary',
		[ 'hasProfile', 'ascent', 'descent', 'itineraryPoints', 'maneuvers', 'provider', 'transitMode', 'objId' ]
	);

	/**
	the objId of the Itinerary
	@type {Number}
	*/

	#objId = INVALID_OBJ_ID;

	/**
	a boolean set to true when the itinerary have a profile
	@type {Boolean}
	*/

	#hasProfile = false;

	/**
	the ascent of the Itinerary when a profile exists, otherwise ZERO
	@type {Number}
	*/

	#ascent = ZERO;

	/**
	the descent of the Itinerary when a profile exists, otherwise ZERO
	@type {Number}
	*/

	#descent = ZERO;

	/**
	the provider name used for this Itinerary
	@type {String}
	*/

	#provider = '';

	/**
	the transit mode used for this Itinerary
	@type {String}
	*/

	#transitMode = '';

	/**
	a Collection of ItineraryPoints
	@type {Collection.<ItineraryPoint>}
	*/

	#itineraryPoints = new Collection ( ItineraryPoint );

	/**
	a Collection of Maneuvers
	@type {Collection.<Maneuver>}
	*/

	#maneuvers = new Collection ( Maneuver );

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
		this.#objId = ObjId.nextObjId;
	}

	/**
	a boolean set to true when the itinerary have a profile
	@type {Boolean}
	*/

	get hasProfile ( ) { return this.#hasProfile; }

	set hasProfile ( hasProfile ) {
		this.#hasProfile = 'boolean' === typeof ( hasProfile ) ? hasProfile : false;
	}

	/**
	the ascent of the Itinerary when a profile exists, otherwise ZERO
	@type {Number}
	*/

	get ascent ( ) { return this.#ascent; }

	set ascent ( ascent ) {
		this.#ascent = 'number' === typeof ( ascent ) ? Number.parseInt ( ascent ) : ZERO;
	}

	/**
	the descent of the Itinerary when a profile exists, otherwise ZERO
	@type {Number}
	*/

	get descent ( ) { return this.#descent; }

	set descent ( descent ) {
		this.#descent = 'number' === typeof ( descent ) ? Number.parseInt ( descent ) : ZERO;
	}

	/**
	the provider name used for this Itinerary
	@type {String}
	*/

	get provider ( ) { return this.#provider; }

	set provider ( provider ) {
		this.#provider = 'string' === typeof ( provider ) ? theHTMLSanitizer.sanitizeToJsString ( provider ) : '';
	}

	/**
	the transit mode used for this Itinerary
	@type {String}
	*/

	get transitMode ( ) { return this.#transitMode; }

	set transitMode ( transitMode ) {
		this.#transitMode = 'string' === typeof ( transitMode ) ? theHTMLSanitizer.sanitizeToJsString ( transitMode ) : '';
	}

	/**
	a Collection of ItineraryPoints
	@type {Collection.<ItineraryPoint>}
	*/

	get itineraryPoints ( ) { return this.#itineraryPoints; }

	/**
	a Collection of Maneuvers
	@type {Collection.<Maneuver>}
	*/

	get maneuvers ( ) { return this.#maneuvers; }

	/**
	the ObjType of the Itinerary.
	@type {ObjType}
	*/

	get objType ( ) { return Itinerary.#objType; }

	/**
	the objId of the Itinerary. objId are unique identifier given by the code
	@type {Number}
	*/

	get objId ( ) { return this.#objId; }

	/**
	An object literal with the Itinerary properties and without any methods.
	This object can be used with the JSON object
	@type {JsonObject}
	*/

	get jsonObject ( ) {
		return {
			hasProfile : this.hasProfile,
			ascent : this.ascent,
			descent : this.descent,
			itineraryPoints : this.itineraryPoints.jsonObject,
			maneuvers : this.maneuvers.jsonObject,
			provider : this.provider,
			transitMode : this.transitMode,
			objId : this.#objId,
			objType : this.objType.jsonObject
		};
	}
	set jsonObject ( something ) {
		const otherthing = this.validateObject ( something );
		this.hasProfile = otherthing.hasProfile;
		this.ascent = otherthing.ascent;
		this.descent = otherthing.descent;
		this.itineraryPoints.jsonObject = otherthing.itineraryPoints;
		this.maneuvers.jsonObject = otherthing.maneuvers;
		this.provider = otherthing.provider;
		this.transitMode = otherthing.transitMode;
		this.#objId = ObjId.nextObjId;

		// rebuilding links between maneuvers and itineraryPoints
		const itineraryPointObjIdMap = new Map ( );
		let sourceCounter = ZERO;
		const itineraryPointsIterator = this.itineraryPoints.iterator;
		while ( ! itineraryPointsIterator.done ) {
			itineraryPointObjIdMap.set (
				otherthing.itineraryPoints [ sourceCounter ].objId,
				itineraryPointsIterator.value.objId
			);
			sourceCounter ++;
		}
		const maneuverIterator = this.maneuvers.iterator;
		while ( ! maneuverIterator.done ) {
			maneuverIterator.value.itineraryPointObjId =
				itineraryPointObjIdMap.get ( maneuverIterator.value.itineraryPointObjId );
		}
	}
}

export default Itinerary;

/* --- End of file --------------------------------------------------------------------------------------------------------- */