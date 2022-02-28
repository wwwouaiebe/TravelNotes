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
	- v1.4.0:
		- created from RouteEditor
	- v1.5.0:
		- Issue ♯52 : when saving the travel to the file, save also the edited route.
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
		- Issue ♯68 : Review all existing promises.
	- v1.8.0:
		- Issue ♯97 : Improve adding a new waypoint to a route
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v2.2.0:
		- Issue ♯64 : Improve geocoding
	- v2.3.0:
		- Issue ♯170 : The apps crash when renaming a waypoint and then saving the route before the end of the renaming...
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v3.3.0:
		- Issue ♯15 : Not possible to edit a route due to slow response of the Geocoder.
Doc reviewed 20210914
Tests 20210902
*/

import theConfig from '../data/Config.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import WayPointPropertiesDialog from '../dialogs/WayPointPropertiesDialog.js';
import GeoCoder from '../coreLib/GeoCoder.js';
import WayPoint from '../data/WayPoint.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import theGeometry from '../coreLib/Geometry.js';
import theRouter from '../coreLib/Router.js';

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
			theEventDispatcher.dispatch ( 'setrouteslist' );
			theEventDispatcher.dispatch ( 'showitinerary' );
			theEventDispatcher.dispatch ( 'roadbookupdate' );
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
		theEventDispatcher.dispatch ( 'setrouteslist' );
		theEventDispatcher.dispatch ( 'updateitinerary' );
		theEventDispatcher.dispatch ( 'roadbookupdate' );
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
		theEventDispatcher.dispatch ( 'setrouteslist' );
		theEventDispatcher.dispatch ( 'showitinerary' );
		theEventDispatcher.dispatch ( 'roadbookupdate' );
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
					theEventDispatcher.dispatch ( 'setrouteslist' );
					theEventDispatcher.dispatch ( 'showitinerary' );
					theEventDispatcher.dispatch ( 'roadbookupdate' );
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