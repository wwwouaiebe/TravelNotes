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
	-v1.1.0:
		- Issue ♯33: Add a command to hide a route
		- Issue ♯36: Add a linetype property to route
	- v1.4.0:
		- Replacing DataManager with TravelNotesData, Config, Version and DataSearchEngine
	- v1.5.0:
		- Issue ♯52 : when saving the travel to the file, save also the edited route.
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v1.8.0:
		- Issue ♯100 : Fix circular dependancies with Collection
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

@file Route.js
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

import theConfig from '../data/Config.js';
import ObjId from '../data/ObjId.js';
import ObjType from '../data/ObjType.js';
import Collection from '../data/Collection.js';
import WayPoint from '../data/WayPoint.js';
import Itinerary from '../data/Itinerary.js';
import Note from '../data/Note.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import TravelObject from '../data/TravelObject.js';
import { ROUTE_EDITION_STATUS, DISTANCE, ZERO, INVALID_OBJ_ID, LAT_LNG } from '../main/Constants.js';

/**
@--------------------------------------------------------------------------------------------------------------------------

@class Route
@classdesc This class represent a route
@extends TravelObject
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class Route extends TravelObject {

	static #objType = new ObjType (
		'Route',
		[
			'name',
			'wayPoints',
			'notes',
			'itinerary',
			'width',
			'color',
			'dashArray',
			'chain',
			'chainedDistance',
			'distance',
			'duration',
			'editionStatus',
			'hidden',
			'objId'
		]
	);

	/**
	the name of the Route
	@type {string}
	*/

	#name = '';

	/**
	a Collection of WayPoints
	@type {Collection.<WayPoint>}
	*/

	#wayPoints = new Collection ( WayPoint );

	/**
	a Collection of Notes
	@type {Collection.<Note>}
	*/

	#notes = new Collection ( Note );

	/**
	the Route Itinerary
	@type {Itinerary}
	*/

	#itinerary = new Itinerary ( );

	/**
	the width of the Leaflet polyline used to represent the Route on the map
	@type {!number}
	*/

	#width = theConfig.route.width;

	/**
	the color of the Leaflet polyline used to represent the Route on the map
	using the css format '#rrggbb'
	@type {string}
	*/

	#color = theConfig.route.color;

	/**
	the dash of the Leaflet polyline used to represent the Route on the map.
	It's the index of the dash in the array Config.route.dashChoices
	@type {!number}
	*/

	#dashArray = theConfig.route.dashArray;

	/**
	boolean indicates if the route is chained
	@type {boolean}
	*/

	#chain = true;

	/**
	the distance betwween the starting point of the travel and the starting point
	of the route if the route is chained, otherwise DISTANCE.defaultValue
	@type {!number}
	*/

	#chainedDistance = DISTANCE.defaultValue;

	/**
	the length of the route or DISTANCE.defaultValue if the Itinerary is not anymore computed
	@type {number}
	*/

	#distance = DISTANCE.defaultValue;

	/**
	the duration of the route or DISTANCE.defaultValue if the Itinerary is not anymore computed
	@type {number}
	*/

	#duration = DISTANCE.defaultValue;

	/**
	A number indicating the status of the route.
	See ROUTE_EDITION_STATUS for possible values
	@type {!number}
	*/

	#editionStatus = ROUTE_EDITION_STATUS.notEdited;

	/**
	a boolean set to true when the route is hidden on the map
	@type {boolean}
	*/

	#hidden = false;

	/**
	the objId of the route
	@type {!number}
	@private
	*/

	#objId = INVALID_OBJ_ID;;

	/*
	constructor
	*/

	constructor ( ) {
		super ( );
		this.#wayPoints.add ( new WayPoint ( ) );
		this.#wayPoints.add ( new WayPoint ( ) );
		this.#objId = ObjId.nextObjId;
	}

	/**
	the name of the Route
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
	a Collection of WayPoints
	@type {Collection.<WayPoint>}
	@readonly
	*/

	get wayPoints ( ) { return this.#wayPoints; }

	/**
	a Collection of Notes
	@type {Collection.<Note>}
	@readonly
	*/

	get notes ( ) { return this.#notes; }

	/**
	the Route Itinerary
	@type {Itinerary}
	@readonly
	*/

	get itinerary ( ) { return this.#itinerary; }

	/**
	the width of the Leaflet polyline used to represent the Route on the map
	@type {!number}
	*/

	get width ( ) { return this.#width; }

	set width ( width ) {
		this.#width = 'number' === typeof ( width ) ? width : theConfig.route.width;
	}

	/**
	the color of the Leaflet polyline used to represent the Route on the map
	using the css format '#rrggbb'
	@type {string}
	*/

	get color ( ) { return this.#color; }

	set color ( color ) {
		this.#color =
			'string' === typeof ( color )
				?
				theHTMLSanitizer.sanitizeToColor ( color ) || theConfig.route.color
				:
				theConfig.route.color;
	}

	/**
	the dash of the Leaflet polyline used to represent the Route on the map.
	It's the index of the dash in the array Config.route.dashChoices
	@type {!number}
	*/

	get dashArray ( ) { return this.#dashArray; }

	set dashArray ( dashArray ) {
		this.#dashArray =
			'number' === typeof ( dashArray ) && theConfig.route.dashChoices [ dashArray ]
				?
				dashArray
				:
				ZERO;
	}

	/**
	boolean indicates if the route is chained
	@type {boolean}
	*/

	get chain ( ) { return this.#chain; }

	set chain ( chain ) { this.#chain = 'boolean' === typeof ( chain ) ? chain : false; }

	/**
	the distance betwween the starting point of the travel and the starting point
	of the route if the route is chained, otherwise DISTANCE.defaultValue
	@type {!number}
	*/

	get chainedDistance ( ) { return this.#chainedDistance; }

	set chainedDistance ( chainedDistance ) {
		this.#chainedDistance = 'number' === typeof ( chainedDistance ) ? chainedDistance : DISTANCE.defaultValue;
	}

	/**
	the length of the route or DISTANCE.defaultValue if the Itinerary is not anymore computed
	@type {number}
	*/

	get distance ( ) { return this.#distance; }

	set distance ( distance ) {
		this.#distance = 'number' === typeof ( distance ) ? distance : DISTANCE.defaultValue;
	}

	/**
	the duration of the route or DISTANCE.defaultValue if the Itinerary is not anymore computed
	@type {number}
	*/

	get duration ( ) { return this.#duration; }

	set duration ( duration ) {
		this.#duration = 'number' === typeof ( duration ) ? duration : DISTANCE.defaultValue;

	}

	/**
	A number indicating the status of the route.
	See ROUTE_EDITION_STATUS for possible values
	@type {!number}
	*/

	get editionStatus ( ) { return this.#editionStatus; }

	set editionStatus ( editionStatus ) {
		this.#editionStatus =
			'number' === typeof ( editionStatus )
				?
				editionStatus
				:
				ROUTE_EDITION_STATUS.notEdited;
	}

	/**
	a boolean set to true when the route is hidden on the map
	@type {boolean}
	*/

	get hidden ( ) { return this.#hidden; }

	set hidden ( hidden ) {
		this.#hidden = 'boolean' === typeof ( hidden ) ? hidden : false;
	}

	/**
	A name computed from the starting WayPoint and ending WayPoint names and addresses
	@type {string}
	@readonly
	*/

	get computedName ( ) {
		let computedName = this.name;
		if ( '' === computedName ) {
			computedName =
				( '' === this.wayPoints.first.fullName ? '???' : this.wayPoints.first.fullName ) +
				' ⮞ ' +
				( '' === this.wayPoints.last.fullName ? '???' : this.wayPoints.last.fullName );
		}

		return computedName;
	}

	/**
	the objId of the Route. objId are unique identifier given by the code
	@readonly
	@type {!number}
	*/

	get objId ( ) { return this.#objId; }

	/**
	the ObjType of the Route.
	@type {ObjType}
	@readonly
	*/

	get objType ( ) { return Route.#objType; }

	/**
	This method verify that all waypoints have valid coordinates ( reminder: a route have always a startpoint
	and an endpoint!)
	@return {boolean} true when all waypoints have valid coordinates
	@private
	*/

	haveValidWayPoints ( ) {
		let haveValidWayPoints = true;
		this.wayPoints.forEach (
			wayPoint => {
				haveValidWayPoints =
					haveValidWayPoints
					&&
					LAT_LNG.defaultValue !== wayPoint.lat
					&&
					LAT_LNG.defaultValue !== wayPoint.lng;
			}
		);
		return haveValidWayPoints;
	}

	/**
	An object literal with the WayPoint properties and without any methods.
	This object can be used with the JSON object
	@type {Object}
	*/

	get jsonObject ( ) {
		return {
			name : this.name,
			wayPoints : this.wayPoints.jsonObject,
			notes : this.notes.jsonObject,
			itinerary : this.itinerary.jsonObject,
			width : this.width,
			color : this.color,
			dashArray : this.dashArray,
			chain : this.chain,
			distance : parseFloat ( this.distance.toFixed ( DISTANCE.fixed ) ),
			duration : this.duration,
			editionStatus : this.editionStatus,
			hidden : this.hidden,
			chainedDistance : parseFloat ( this.chainedDistance.toFixed ( DISTANCE.fixed ) ),
			objId : this.#objId,
			objType : this.objType.jsonObject
		};
	}

	set jsonObject ( something ) {
		const otherthing = this.validateObject ( something );
		this.name = otherthing.name;
		this.wayPoints.jsonObject = otherthing.wayPoints;
		this.notes.jsonObject = otherthing.notes;
		this.itinerary.jsonObject = otherthing.itinerary;
		this.width = otherthing.width;
		this.color = otherthing.color;
		this.dashArray = otherthing.dashArray;
		this.chain = otherthing.chain;
		this.distance = otherthing.distance;
		this.duration = otherthing.duration;
		this.editionStatus = otherthing.editionStatus;
		this.hidden = otherthing.hidden;
		this.chainedDistance = otherthing.chainedDistance;
		this.#objId = ObjId.nextObjId;
	}
}

export default Route;

/*
--- End of Route.js file ------------------------------------------------------------------------------------------------------
*/