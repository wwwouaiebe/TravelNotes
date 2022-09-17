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
	- v4.0.0:
		- created from v3.6.0
Doc reviewed 202208
 */

import theConfig from '../data/Config.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import WayPointPropertiesDialog from '../dialogs/wayPointPropertiesDialog/WayPointPropertiesDialog.js';
import GeoCoder from './lib/GeoCoder.js';
import WayPoint from '../data/WayPoint.js';
import theEventDispatcher from './lib/EventDispatcher.js';
import theGeometry from './lib/Geometry.js';
import theRouter from './lib/Router.js';

import { ROUTE_EDITION_STATUS, TWO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class contains methods fot WayPoints creation or modifications
See theWayPointEditor for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class WayPointEditor {

	/**
	This method rename a WayPoint with data from Nominatim
	@param {WayPoint} wayPoint The wayPoint to rename
	*/

	async #renameWayPointWithGeocoder ( wayPoint ) {
		if ( ! theConfig.wayPoint.reverseGeocoding ) {
			theEventDispatcher.dispatch ( 'updatetravelproperties' );
			theEventDispatcher.dispatch ( 'updateroadbook' );
			return;
		}

		const address = await new GeoCoder ( ).getAddressAsync ( wayPoint.latLng );

		// Due to slow response of the geocoder, sometime the edited route is not anymore edited...
		// See issue ♯15
		if ( theTravelNotesData.editedRouteObjId === theTravelNotesData.travel.editedRoute.objId ) {
			theTravelNotesData.travel.editedRoute.editionStatus = ROUTE_EDITION_STATUS.editedChanged;
		}
		wayPoint.address = address.street;
		if ( '' !== address.city ) {
			wayPoint.address += ' ' + address.city;
		}
		wayPoint.name = '';
		if ( theConfig.wayPoint.geocodingIncludeName ) {
			wayPoint.name = address.name;
		}
		theEventDispatcher.dispatch ( 'updatetravelproperties' );
		theEventDispatcher.dispatch ( 'updateroadbook' );
	}

	/**
	This method set the starting WayPoint
	@param {Array.<Number>} latLng The latitude and longitude where the WayPoint will be added
	*/

	#setStartPoint ( latLng ) {
		const wayPoint = theTravelNotesData.travel.editedRoute.wayPoints.first;
		wayPoint.latLng = latLng;
		this.#renameWayPointWithGeocoder ( wayPoint );
		theEventDispatcher.dispatch (
			'addwaypoint',
			{
				wayPoint : wayPoint,
				letter : 'A'
			}
		);
	}

	/**
	This method set the ending WayPoint
	@param {Array.<Number>} latLng The latitude and longitude where the WayPoint will be added
	*/

	#setEndPoint ( latLng ) {
		const wayPoint = theTravelNotesData.travel.editedRoute.wayPoints.last;
		wayPoint.latLng = latLng;
		this.#renameWayPointWithGeocoder ( wayPoint );
		theEventDispatcher.dispatch (
			'addwaypoint',
			{
				wayPoint : wayPoint,
				letter : 'B'
			}
		);
	}

	/**
	the constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	This method add a WayPoint
	@param {Array.<Number>} latLng The latitude and longitude where the WayPoint will be added
	*/

	addWayPoint ( latLng ) {
		theTravelNotesData.travel.editedRoute.editionStatus = ROUTE_EDITION_STATUS.editedChanged;
		const wayPoint = new WayPoint ( );
		wayPoint.latLng = latLng;
		theTravelNotesData.travel.editedRoute.wayPoints.add ( wayPoint );
		this.#renameWayPointWithGeocoder ( wayPoint );
		theEventDispatcher.dispatch (
			'addwaypoint',
			{
				wayPoint : theTravelNotesData.travel.editedRoute.wayPoints.last,
				letter : theTravelNotesData.travel.editedRoute.wayPoints.length - TWO
			}
		);
		theTravelNotesData.travel.editedRoute.wayPoints.swap ( wayPoint.objId, true );
		theRouter.startRouting ( );
	}

	/**
	This method add a waypoint at a given position on the edited route. It's used to add a WayPoint by
	dragging
	@param {Array.<Number>} initialLatLng The latitude and longitude from witch the WayPoint is coming
	@param {Array.<Number>} finalLatLng The latitude and longitude where the WayPoint will be added
	*/

	addWayPointOnRoute ( initialLatLng, finalLatLng ) {
		const newWayPointDistance = theGeometry.getClosestLatLngDistance (
			theTravelNotesData.travel.editedRoute,
			initialLatLng
		).distance;
		theTravelNotesData.travel.editedRoute.editionStatus = ROUTE_EDITION_STATUS.editedChanged;
		const wayPoint = new WayPoint ( );
		wayPoint.latLng = finalLatLng;
		let letter = '';
		const wayPointsIterator = theTravelNotesData.travel.editedRoute.wayPoints.iterator;
		while ( ! wayPointsIterator.done ) {
			const latLngDistance = theGeometry.getClosestLatLngDistance (
				theTravelNotesData.travel.editedRoute,
				wayPointsIterator.value.latLng
			);
			if ( newWayPointDistance < latLngDistance.distance ) {
				letter = String ( wayPointsIterator.index );
				theTravelNotesData.travel.editedRoute.wayPoints.add ( wayPoint );
				theTravelNotesData.travel.editedRoute.wayPoints.moveTo (
					wayPoint.objId, wayPointsIterator.value.objId, true
				);
				this.#renameWayPointWithGeocoder ( wayPoint );
				theEventDispatcher.dispatch ( 'addwaypoint', { wayPoint : wayPoint, letter : letter } );
				theRouter.startRouting ( );
				break;
			}
		}
	}

	/**
	This method reverse the waypoints order
	*/

	reverseWayPoints ( ) {
		theTravelNotesData.travel.editedRoute.editionStatus = ROUTE_EDITION_STATUS.editedChanged;
		let wayPointsIterator = theTravelNotesData.travel.editedRoute.wayPoints.iterator;
		while ( ! wayPointsIterator.done ) {
			theEventDispatcher.dispatch ( 'removeobject', { objId : wayPointsIterator.value.objId } );
		}
		theTravelNotesData.travel.editedRoute.wayPoints.reverse ( );
		wayPointsIterator = theTravelNotesData.travel.editedRoute.wayPoints.iterator;
		while ( ! wayPointsIterator.done ) {
			theEventDispatcher.dispatch (
				'addwaypoint',
				{
					wayPoint : wayPointsIterator.value,
					letter :
						wayPointsIterator .first ? 'A' : ( wayPointsIterator.last ? 'B' : String ( wayPointsIterator.index ) )
				}
			);
		}
		theEventDispatcher.dispatch ( 'updatetravelproperties' );
		theEventDispatcher.dispatch ( 'updateroadbook' );
		theRouter.startRouting ( );
	}

	/**
	This method remove a WayPoint
	@param {Number} wayPointObjId The objId of the WayPoint to remove
	*/

	removeWayPoint ( wayPointObjId ) {
		theTravelNotesData.travel.editedRoute.editionStatus = ROUTE_EDITION_STATUS.editedChanged;
		theEventDispatcher.dispatch ( 'removeobject', { objId : wayPointObjId } );
		theTravelNotesData.travel.editedRoute.wayPoints.remove ( wayPointObjId );
		theRouter.startRouting ( );
	}

	/**
	This method set the starting WayPoint
	@param {Array.<Number>} latLng The latitude and longitude where the WayPoint will be added
	*/

	setStartPoint ( latLng ) {
		theTravelNotesData.travel.editedRoute.editionStatus = ROUTE_EDITION_STATUS.editedChanged;
		this.#setStartPoint ( latLng );
		theRouter.startRouting ( );
	}

	/**
	This method set the ending WayPoint
	@param {Array.<Number>} latLng The latitude and longitude where the WayPoint will be added
	*/

	setEndPoint ( latLng ) {
		theTravelNotesData.travel.editedRoute.editionStatus = ROUTE_EDITION_STATUS.editedChanged;
		this.#setEndPoint ( latLng );
		theRouter.startRouting ( );
	}

	/**
	This method set the starting and ending WayPoint
	@param {Array.<Number>} latLng The latitude and longitude where the WayPoints will be added
	*/

	setStartAndEndPoint ( latLng ) {
		theTravelNotesData.travel.editedRoute.editionStatus = ROUTE_EDITION_STATUS.editedChanged;
		this.#setStartPoint ( latLng );
		this.#setEndPoint ( latLng );
		if ( TWO < theTravelNotesData.travel.editedRoute.wayPoints.length ) {
			theRouter.startRouting ( );
		}
	}

	/**
	This method is called when a drag of a WayPoint ends on the map
	@param {Number} dragEndEvent The drag event
	*/

	wayPointDragEnd ( dragEndEvent ) {
		theTravelNotesData.travel.editedRoute.editionStatus = ROUTE_EDITION_STATUS.editedChanged;
		const draggedWayPoint = theTravelNotesData.travel.editedRoute.wayPoints.getAt ( dragEndEvent.target.objId );
		const latLng = dragEndEvent.target.getLatLng ( );
		draggedWayPoint.latLng = [ latLng.lat, latLng.lng ];
		this.#renameWayPointWithGeocoder ( draggedWayPoint );
		theRouter.startRouting ( );
	}

	/**
	This method shows the WayPointPropertiesDialog
	@param {Number} wayPointObjId The objId of the WayPoint that modify
	*/

	wayPointProperties ( wayPointObjId ) {
		const wayPoint = theTravelNotesData.travel.editedRoute.wayPoints.getAt ( wayPointObjId );
		new WayPointPropertiesDialog ( wayPoint )
			.show ( )
			.then (
				( ) => {
					theEventDispatcher.dispatch ( 'updatetravelproperties' );
					theEventDispatcher.dispatch ( 'updateroadbook' );
				}
			)
			.catch (
				err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
				}
			);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of WayPointEditor class
@type {WayPointEditor}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theWayPointEditor = new WayPointEditor ( );

export default theWayPointEditor;

/* --- End of file --------------------------------------------------------------------------------------------------------- */