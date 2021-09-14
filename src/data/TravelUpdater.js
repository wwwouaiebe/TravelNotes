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
Doc reviewed ...
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file TravelUpdater.js
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

import Route from '../data/Route.js';
import { theDataVersion } from '../data/Version.js';

import { ZERO, ROUTE_EDITION_STATUS, ELEV, DISTANCE } from '../main/Constants.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class TravelUpdater
@classdesc coming soon...
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class TravelUpdater {

	/* eslint-disable camelcase */
	/* eslint no-fallthrough: ["error", { "commentPattern": "eslint break omitted intentionally" }]*/

	#jsonTravel = null;

	/* v1.0.0 */

	#updateRoutesV_1_0_0 ( ) {
		this.#jsonTravel.routes.forEach (
			route => {
				route.dashArray = ZERO;
				route.hidden = false;
			}
		);
	}

	/* v1.4.0 */

	#updateRoutesV_1_4_0 ( ) {
		this.#jsonTravel.routes.forEach (
			route => {
				route.edited = ROUTE_EDITION_STATUS.notEdited;
			}
		);
	}

	#updateTravelV_1_4_0 ( ) {
		this.#updateRoutesV_1_4_0 ( );
		this.#jsonTravel.editedRoute = new Route ( ).jsonObject;
	}

	/* v1.5.0 */

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

	/* v1.6.0 */

	#updateItineraryPointsV_1_6_0 ( itineraryPoints ) {
		itineraryPoints.forEach (
			itineraryPoint => {
				itineraryPoint.elev = ELEV.defaultValue;
			}
		);
	}

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

	/* v1.11.0 */

	#updateManeuversV_1_11_0 ( route ) {
		route.itinerary.maneuvers.forEach (
			maneuver => {
				if ( 'kArriveDefault' === maneuver.iconName ) {
					maneuver.distance = DISTANCE.defaultValue;
				}
			}
		);
	}

	#updateWayPointsV_1_11_0 ( route ) {
		route.wayPoints.forEach (
			wayPoint => {
				wayPoint.address = wayPoint.name;
				wayPoint.name = '';
			}
		);
	}

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

	/* v1.13.0 */

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

	#updateNoteV1_13_0 ( note ) {
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

	#updateNotesV_1_13_0 ( ) {
		this.#jsonTravel.notes.forEach (
			note => {
				this.#updateNoteV1_13_0 ( note );
			}
		);
		this.jsonTravel.routes.forEach (
			route => {
				route.notes.forEach (
					note => {
						this.#updateNoteV1_13_0 ( note );
					}
				);
			}
		);
	}

	/* v2.3.0 */

	#updateVersion ( jsonObject ) {
		jsonObject.objType.version = theDataVersion;
	}

	#updateRouteVersion ( route ) {
		this.#updateVersion ( route );
		route.wayPoints.forEach (
			wayPoint => {
				this.updateVersion ( wayPoint );
			}
		);
		route.notes.forEach (
			note => {
				this.updateVersion ( note );
			}
		);
		this.updateVersion ( route.itinerary );
		route.itinerary.itineraryPoints.forEach (
			itineraryPoint => {
				this.updateVersion ( itineraryPoint );
			}
		);
		route.itinerary.maneuvers.forEach (
			maneuver => {
				this.updateVersion ( maneuver );
			}
		);
	}

	#updateVersions ( ) {
		this.#updateVersion ( this.#jsonTravel );
		this.jsonTravel.notes.forEach (
			note => {
				this.#updateVersion ( note );
			}
		);
		this.jsonTravel.routes.forEach (
			route => {
				this.#updateRouteVersion ( route );
			}
		);
		this.#updateRouteVersion ( this.#jsonTravel.editedRoute );
	}

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
			this.#jsonTravel.objType.version = '2.3.0';
			break;
		default :
			throw new Error ( 'invalid version for travel' );
		}
	}

	/* eslint-enable camelcase */

	constructor ( ) {
		Object.freeze ( this );
	}

	update ( jsonTravel ) {
		if ( jsonTravel.objType.version === theDataVersion ) {
			return;
		}
		this.#jsonTravel = jsonTravel;
		this.#updateTravel ( );
	}
}

export default TravelUpdater;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of TravelUpdater.js file

@------------------------------------------------------------------------------------------------------------------------------
*/