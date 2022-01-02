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
	- v3.2.0:
		- Issue ♯4 : Line type and line width for routes are not adapted on the print views
Doc reviewed ...
Tests ...
*/

import { theDataVersion } from '../data/Version.js';

import { ZERO, ROUTE_EDITION_STATUS, ELEV, DISTANCE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class update a Travel contained in a json object and created with a previous version to the
current version
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelUpdater {

	/* eslint-disable camelcase */
	/* eslint no-fallthrough: ["error", { "commentPattern": "eslint break omitted intentionally" }]*/

	/**
	The travel to update
	@type {JsonObject}
	*/

	#jsonTravel;

	/**
	Update the routes when version is v1.0.0
	*/

	#updateRoutesV_1_0_0 ( ) {
		this.#jsonTravel.routes.forEach (
			route => {
				route.dashArray = ZERO;
				route.hidden = false;
			}
		);
	}

	/**
	Update the routes when version is v1.4.0
	*/

	#updateRoutesV_1_4_0 ( ) {
		this.#jsonTravel.routes.forEach (
			route => {
				route.edited = ROUTE_EDITION_STATUS.notEdited;
			}
		);
	}

	/**
	Update the travel when version is v1.4.0
	*/

	#updateTravelV_1_4_0 ( ) {
		this.#updateRoutesV_1_4_0 ( );
		/* eslint-disable no-magic-numbers */
		this.#jsonTravel.editedRoute = {
			name : '',
			wayPoints : [
				{ name : '', lat : 0, lng : 0, objId : 2, objType : { name : 'WayPoint', version : '1.4.0' } },
				{ name : '', lat : 0, lng : 0, objId : 3, objType : { name : 'WayPoint', version : '1.4.0' } }
			],
			notes : [],
			itinerary : {
				itineraryPoints : [],
				maneuvers : [],
				provider : '',
				transitMode : '',
				objId : 1,
				objType : { name : 'Itinerary', version : '1.4.0' }
			},
			width : 3,
			color : '#ff0000',
			dashArray : 0,
			chain : true,
			distance : 0,
			duration : 0,
			edited : ROUTE_EDITION_STATUS.notEdited,
			hidden : false,
			chainedDistance : 0,
			objId : 4,
			objType : { name : 'Route', version : '1.4.0' }
		};
		/* eslint-enable no-magic-numbers */
	}

	/**
	Update the travel when version is v1.5.0
	*/

	#updateTravelV_1_5_0 ( ) {
		if ( this.#jsonTravel.userData.layerId ) {

			// old layersId from maps are converted to TravelNotes layerName
			const layerConvert =
				[
					{ layerId : '0', layerName : 'OSM - Color' },
					{ layerId : '1', layerName : 'OSM - Black and White' },
					{ layerId : '2', layerName : 'Thunderforest - Transport' },
					{ layerId : '3', layerName : 'Thunderforest - OpenCycleMap' },
					{ layerId : '4', layerName : 'Thunderforest - Outdoors' },
					{ layerId : '5', layerName : 'Esri - Aerial view' },
					{ layerId : '6', layerName : 'Kartverket - Norway' },
					{ layerId : '7', layerName : 'IGN-NGI - Belgium now' },
					{ layerId : '12', layerName : 'Thunderforest - Landscape' },
					{ layerId : '24', layerName : 'Lantmäteriet - Sweden' },
					{ layerId : '25', layerName : 'Maanmittauslaitos - Finland' }
				].find ( layerConversion => layerConversion.layerId === this.#jsonTravel.userData.layerId );
			if ( layerConvert ) {
				this.#jsonTravel.layerName = layerConvert.layerName;
			}
			else {
				this.#jsonTravel.layerName = 'OSM - Color';
			}
		}
		else {
			this.#jsonTravel.layerName = 'OSM - Color';
		}
	}

	/**
	Update the itinerary points when version is v1.6.0
	@param {Array.<Object>} itineraryPoints A list with itinerary points to update
	*/

	#updateItineraryPointsV_1_6_0 ( itineraryPoints ) {
		itineraryPoints.forEach (
			itineraryPoint => {
				itineraryPoint.elev = ELEV.defaultValue;
			}
		);
	}

	/**
	Update the itinerary when version is v1.6.0
	*/

	#updateItineraryV_1_6_0 ( ) {
		this.#jsonTravel.routes.forEach (
			route => {
				route.itinerary.hasProfile = false;
				route.itinerary.ascent = ZERO;
				route.itinerary.descent = ZERO;
				this.#updateItineraryPointsV_1_6_0 ( route.itinerary.itineraryPoints );
			}
		);
		this.#jsonTravel.editedRoute.itinerary.hasProfile = false;
		this.#jsonTravel.editedRoute.itinerary.ascent = ZERO;
		this.#jsonTravel.editedRoute.itinerary.descent = ZERO;
		this.#updateItineraryPointsV_1_6_0 ( this.#jsonTravel.editedRoute.itinerary.itineraryPoints );
	}

	/**
	Update the maneuvers when version is v1.11.0
	@param {JsonObject} route The route containing the maneuvers
	*/

	#updateManeuversV_1_11_0 ( route ) {
		route.itinerary.maneuvers.forEach (
			maneuver => {
				if ( 'kArriveDefault' === maneuver.iconName ) {
					maneuver.distance = DISTANCE.defaultValue;
				}
			}
		);
	}

	/**
	Update the way points when version is v1.11.0
	@param {JsonObject} route The route containing the way points
	*/

	#updateWayPointsV_1_11_0 ( route ) {
		route.wayPoints.forEach (
			wayPoint => {
				wayPoint.address = wayPoint.name;
				wayPoint.name = '';
			}
		);
	}

	/**
	Update the routes when version is v1.11.0
	*/

	#updateRoutesV_1_11_0 ( ) {
		this.#jsonTravel.routes.forEach (
			route => {
				route.editionStatus = route.edited;
				this.#updateManeuversV_1_11_0 ( route );
				this.#updateWayPointsV_1_11_0 ( route );
			}
		);
		this.#jsonTravel.editedRoute.editionStatus = this.#jsonTravel.editedRoute.edited;
		this.#updateManeuversV_1_11_0 ( this.#jsonTravel.editedRoute );
		this.#updateWayPointsV_1_11_0 ( this.#jsonTravel.editedRoute );
	}

	/**
	Update the routes when version is v2.3.0
	*/

	#updateRouteV_2_3_0 ( ) {
		this.#jsonTravel.routes.forEach (
			route => {
				route.dashIndex = route.dashArray;
			}
		);
		this.#jsonTravel.editedRoute.dashIndex = this.#jsonTravel.editedRoute.dashArray;
	}

	/**
	Update a note style when version is v1.13.0
	@param {String} somethingText A text containing HTML with style attributes
	*/

	#UpdateStyleNoteV1_13_0 ( somethingText ) {
		const returnValue = somethingText
			.replaceAll ( /style='color:white;background-color:red'/g, 'class=\'TravelNotes-Note-WhiteRed\'' )
			.replaceAll ( /style='color:white;background-color:green'/g, 'class=\'TravelNotes-Note-WhiteGreen\'' )
			.replaceAll ( /style='color:white;background-color:blue'/g, 'class=\'TravelNotes-Note-WhiteBlue\'' )
			.replaceAll ( /style='color:white;background-color:brown'/g, 'class=\'TravelNotes-Note-WhiteBrown\'' )
			.replaceAll ( /style='color:white;background-color:black'/g, 'class=\'TravelNotes-Note-WhiteBlack\'' )
			.replaceAll ( /style='border:solid 0.1em'/g, 'class=\'TravelNotes-Note-BlackWhite\'' )
			.replaceAll ( /style='background-color:white;'/g, 'class=\'TravelNotes-Note-Knooppunt\'' )
			.replaceAll ( /style='fill:green;font:bold 120px sans-serif;'/g, '' )
			.replaceAll ( /style='fill:none;stroke:green;stroke-width:10;'/g, '' );
		return returnValue;
	}

	/**
	Update a note when version is v1.13.0
	@param {JsonObject} note The note to update
	*/

	#updateNote_V1_13_0 ( note ) {
		if ( 'string' === typeof ( note.iconHeight ) ) {
			note.iconHeight = Number.parseInt ( note.iconHeight );
		}
		if ( 'string' === typeof ( note.iconWidth ) ) {
			note.iconWidth = Number.parseInt ( note.iconWidth );
		}
		note.iconContent = this.#UpdateStyleNoteV1_13_0 ( note.iconContent );
		note.popupContent = this.#UpdateStyleNoteV1_13_0 ( note.popupContent );
		note.tooltipContent = this.#UpdateStyleNoteV1_13_0 ( note.tooltipContent );
		note.phone = this.#UpdateStyleNoteV1_13_0 ( note.phone );
		note.address = this.#UpdateStyleNoteV1_13_0 ( note.address );
	}

	/**
	Update the notes when version is v1.13.0
	*/

	#updateNotesV_1_13_0 ( ) {
		this.#jsonTravel.notes.forEach (
			note => {
				this.#updateNote_V1_13_0 ( note );
			}
		);
		this.jsonTravel.routes.forEach (
			route => {
				route.notes.forEach (
					note => {
						this.#updateNote_V1_13_0 ( note );
					}
				);
			}
		);
	}

	/**
	Update the travel
	*/

	#updateTravel ( ) {
		switch ( this.#jsonTravel.objType.version ) {
		case '1.0.0' :
			this.#updateRoutesV_1_0_0 ( );
			// eslint break omitted intentionally
		case '1.1.0' :
		case '1.2.0' :
		case '1.3.0' :
		case '1.4.0' :
			this.#updateTravelV_1_4_0 ( );
			// eslint break omitted intentionally
		case '1.5.0' :
			this.#updateTravelV_1_5_0 ( );
			// eslint break omitted intentionally
		case '1.6.0' :
			this.#updateItineraryV_1_6_0 ( );
			// eslint break omitted intentionally
		case '1.7.0' :
		case '1.7.1' :
		case '1.8.0' :
		case '1.9.0' :
		case '1.10.0' :
		case '1.11.0' :
			this.#updateRoutesV_1_11_0 ( );
			// eslint break omitted intentionally
		case '1.12.0' :
		case '1.13.0' :
			this.#updateNotesV_1_13_0 ( );
			// eslint break omitted intentionally
		case '2.0.0' :
		case '2.1.0' :
		case '2.2.0' :
		case '2.3.0' :
			this.#updateRouteV_2_3_0 ( );
			this.#jsonTravel.objType.version = '2.4.0';
			break;

		default :
			throw new Error ( 'invalid version for travel' );
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Update the travel
	@param {JsonObject} jsonTravel The travel to update
	*/

	update ( jsonTravel ) {
		if ( jsonTravel.objType.version === theDataVersion ) {
			return;
		}
		this.#jsonTravel = jsonTravel;
		this.#updateTravel ( );
	}
}

export default TravelUpdater;

/* --- End of file --------------------------------------------------------------------------------------------------------- */