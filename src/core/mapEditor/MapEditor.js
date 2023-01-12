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

import theConfig from '../../data/Config.js';
import theTravelNotesData from '../../data/TravelNotesData.js';
import theDataSearchEngine from '../../data/DataSearchEngine.js';
import theGeometry from '../../core/lib/Geometry.js';
import theApiKeysManager from '../../core/ApiKeysManager.js';
import MapEditorViewer from './MapEditorViewer.js';
import EditedRouteMouseOverEL from './editedRouteEL/EditedRouteMouseOverEL.js';
import NoteBulletDragEndEL from './noteBulletEL/NoteBulletDragEndEL.js';
import NoteBulletDragEL from './noteBulletEL/NoteBulletDragEL.js';
import NoteBulletMouseEnterEL from './noteBulletEL/NoteBulletMouseEnterEL.js';
import NoteBulletMouseLeaveEL from './noteBulletEL/NoteBulletMouseLeaveEL.js';
import NoteMarkerContextMenuEL from './NoteMarkerEL/NoteMarkerContextMenuEL.js';
import NoteMarkerDragEndEL from './NoteMarkerEL/NoteMarkerDragEndEL.js';
import NoteMarkerDragEL from './NoteMarkerEL/NoteMarkerDragEL.js';
import WayPointContextMenuEL from './wayPointEL/WayPointContextMenuEL.js';
import WayPointDragEndEL from './wayPointEL/WayPointDragEndEL.js';
import RouteMapContextMenuEL from './RouteEL/RouteMapContextMenuEL.js';
import { ROUTE_EDITION_STATUS, LAT_LNG, INVALID_OBJ_ID, TWO, WAY_POINT_ICON_SIZE } from '../../main/Constants.js';
import theDevice from '../lib/Device.js';

import {
	LeafletCircleMarker,
	LeafletDivIcon,
	LeafletMarker,
	LeafletPolyline,
	LeafletRectangle,
	LeafletDomEvent
} from '../../leaflet/LeafletImports.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class performs all the read/write updates on the map

See theMapEditor for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapEditor	extends MapEditorViewer {

	/**
	Simple constant for computing if we add a polyline or a marker for the search
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MARKER_BOUNDS_PRECISION ( ) { return 0.01; }

	/**
	Remove a Leaflet object from the map
	@param {Number} objId The objId of the object to remove
	*/

	#RemoveFromMap ( objId ) {
		const layer = theTravelNotesData.mapObjects.get ( objId );
		if ( layer ) {
			LeafletDomEvent.off ( layer );
			theTravelNotesData.map.removeLayer ( layer );
			theTravelNotesData.mapObjects.delete ( objId );
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
	}

	/**
	This method update a route on the map.
	This method is also used for removing a route with the addedRouteObjId = INVALID_OBJ_ID.
	This method is also used for adding a route with the removedRouteObjId = INVALID_OBJ_ID.
	This method is called by the 'routeupdated' event listener.
	@param {Number} removedRouteObjId The objId of the route to remove
	@param {Number} addedRouteObjId The objId of the route to add
	*/

	updateRoute ( removedRouteObjId, addedRouteObjId ) {
		if ( INVALID_OBJ_ID !== removedRouteObjId ) {
			const route = theDataSearchEngine.getRoute ( removedRouteObjId );
			this.#RemoveFromMap ( route.objId );

			const notesIterator = route.notes.iterator;
			while ( ! notesIterator.done ) {
				this.#RemoveFromMap ( notesIterator.value.objId );
			}

			const wayPointsIterator = route.wayPoints.iterator;
			while ( ! wayPointsIterator.done ) {
				this.#RemoveFromMap ( wayPointsIterator.value.objId );
			}
		}
		if ( INVALID_OBJ_ID !== addedRouteObjId ) {
			const route = this.addRoute ( addedRouteObjId );
			const polyline = theTravelNotesData.mapObjects.get ( addedRouteObjId );

			if ( ! theTravelNotesData.travel.readOnly ) {
				LeafletDomEvent.on ( polyline, 'contextmenu', RouteMapContextMenuEL.handleEvent );
				if ( ROUTE_EDITION_STATUS.notEdited !== route.editionStatus && ! theDevice.isTouch ) {
					LeafletDomEvent.on ( polyline, 'mouseover', EditedRouteMouseOverEL.handleEvent );
				}
				const notesIterator = route.notes.iterator;
				while ( ! notesIterator.done ) {
					const layerGroup = theTravelNotesData.mapObjects.get ( notesIterator.value.objId );
					const marker = layerGroup.getLayer ( layerGroup.markerId );
					const bullet = layerGroup.getLayer ( layerGroup.bulletId );
					LeafletDomEvent.on ( bullet, 'dragend', NoteBulletDragEndEL.handleEvent );
					LeafletDomEvent.on ( bullet, 'drag',	NoteBulletDragEL.handleEvent );
					LeafletDomEvent.on ( bullet, 'mouseenter', NoteBulletMouseEnterEL.handleEvent );
					LeafletDomEvent.on ( bullet, 'mouseleave', NoteBulletMouseLeaveEL.handleEvent );
					LeafletDomEvent.on ( marker, 'contextmenu', NoteMarkerContextMenuEL.handleEvent );
					LeafletDomEvent.on ( marker, 'dragend', NoteMarkerDragEndEL.handleEvent );
					LeafletDomEvent.on ( marker, 'drag', NoteMarkerDragEL.handleEvent );
				}
			}

			// waypoints are added
			if ( ! theTravelNotesData.travel.readOnly && ROUTE_EDITION_STATUS.notEdited !== route.editionStatus ) {
				const wayPointsIterator = theTravelNotesData.travel.editedRoute.wayPoints.iterator;
				while ( ! wayPointsIterator.done ) {
					this.addWayPoint (
						wayPointsIterator.value,
						wayPointsIterator .first ? 'A' : ( wayPointsIterator.last ? 'B' : wayPointsIterator.index )
					);
				}
			}
		}
	}

	/**
	This method update the properties of a route on the map
	This method is called by the 'routepropertiesupdated' event listener.
	@param {Number} routeObjId The objId of the route to update
	*/

	updateRouteProperties ( routeObjId ) {
		const polyline = theTravelNotesData.mapObjects.get ( routeObjId );
		const route = theDataSearchEngine.getRoute ( routeObjId );
		polyline.setStyle (
			{
				color : route.color,
				weight : route.width,
				dashArray : route.dashString
			}
		);
	}

	/**
	This method update a note on the map.
	This method is also used for removing a note with the addedNoteObjId = INVALID_OBJ_ID.
	This method is also used for adding a note with the removedNoteObjId = INVALID_OBJ_ID.
	This method is called by the 'noteupdated' event listener.
	@param {Number} removedNoteObjId The objId of the note to remove
	@param {Number} addedNoteObjId The objId of the note to add
	*/

	updateNote ( removedNoteObjId, addedNoteObjId ) {
		let isPopupOpen = false;
		if ( INVALID_OBJ_ID !== removedNoteObjId ) {
			const layerGroup = theTravelNotesData.mapObjects.get ( removedNoteObjId );
			if ( layerGroup ) {
				isPopupOpen = layerGroup.getLayer ( layerGroup.markerId ).isPopupOpen ( );
			}
			this.#RemoveFromMap ( removedNoteObjId );
		}
		if ( INVALID_OBJ_ID !== addedNoteObjId ) {
			const noteObjects = this.addNote ( addedNoteObjId );
			if ( isPopupOpen ) {
				noteObjects.marker.openPopup ( );
			}
			if ( ! theTravelNotesData.travel.readOnly ) {
				LeafletDomEvent.on ( noteObjects.bullet, 'dragend', NoteBulletDragEndEL.handleEvent );
				LeafletDomEvent.on ( noteObjects.bullet, 'drag',	NoteBulletDragEL.handleEvent );
				LeafletDomEvent.on ( noteObjects.bullet, 'mouseenter',	NoteBulletMouseEnterEL.handleEvent );
				LeafletDomEvent.on ( noteObjects.bullet, 'mouseleave',	NoteBulletMouseLeaveEL.handleEvent );
				LeafletDomEvent.on ( noteObjects.marker, 'contextmenu', NoteMarkerContextMenuEL.handleEvent );
				LeafletDomEvent.on ( noteObjects.marker, 'dragend', NoteMarkerDragEndEL.handleEvent );
				LeafletDomEvent.on ( noteObjects.marker, 'drag', NoteMarkerDragEL.handleEvent );
			}
		}
	}

	/**
	This method removes an object from the map.
	This method is called by the 'removeobject' event listener
	@param {Number} objId The objId of the object to remove
	*/

	removeObject ( objId ) { this.#RemoveFromMap ( objId ); }

	/**
	This method removes all objects from the map.
	This method is called by the 'removeallobjects' event listener
	*/

	removeAllObjects ( ) {
		theTravelNotesData.mapObjects.forEach (
			mapObject => {
				LeafletDomEvent.off ( mapObject );
				theTravelNotesData.map.removeLayer ( mapObject );
			}
		);
		theTravelNotesData.mapObjects.clear ( );
	}

	/**
	This method add a WayPoint to the map.
	This method is called by the 'addwaypoint' event listener.
	@param {WayPoint} wayPoint The wayPoint to add
	@param {string|number} letter The letter or number to show with the WayPoint
	*/

	addWayPoint ( wayPoint, letter ) {
		if ( ( LAT_LNG.defaultValue === wayPoint.lat ) && ( LAT_LNG.defaultValue === wayPoint.lng ) ) {
			return;
		}

		// a HTML element is created, with different class name, depending of the waypont position. See also WayPoints.css
		const iconHtml = '<div class="TravelNotes-Map-WayPoint TravelNotes-Map-WayPoint' +
		( 'A' === letter ? 'Start' : ( 'B' === letter ? 'End' : 'Via' ) ) +
		'"></div><div class="TravelNotes-Map-WayPointText">' + letter + '</div>';

		// a leaflet marker is created...
		const marker = new LeafletMarker (
			wayPoint.latLng,
			{
				icon : new LeafletDivIcon (
					{
						iconSize : [ WAY_POINT_ICON_SIZE, WAY_POINT_ICON_SIZE ],
						iconAnchor : [
							WAY_POINT_ICON_SIZE / TWO,
							WAY_POINT_ICON_SIZE
						],
						html : iconHtml,
						className : 'TravelNotes-Map-WayPointStyle'
					}
				),
				draggable : true
			}
		);

		marker.bindTooltip (
			tooltipWayPoint => theDataSearchEngine.getWayPoint ( tooltipWayPoint.objId ).fullName
		);
		marker.getTooltip ( ).options.offset = [
			WAY_POINT_ICON_SIZE / TWO,
			-WAY_POINT_ICON_SIZE / TWO
		];

		LeafletDomEvent.on ( marker, 'contextmenu', WayPointContextMenuEL.handleEvent );

		// ... and added to the map...
		marker.objId = wayPoint.objId;
		this.addToMap ( wayPoint.objId, marker );

		// ... and a dragend event listener is created
		LeafletDomEvent.on ( marker, 'dragend', WayPointDragEndEL.handleEvent );
	}

	/**
	This method add an itinerary point marker to the map (= a leaflet.circleMarker object).
	This method is called by the 'additinerarypointmarker' event listener.
	@param {Number} objId A unique identifier to attach to the circleMarker
	@param {Array.<Number>} latLng The latitude and longitude of the itinerary point marker
	*/

	addItineraryPointMarker ( objId, latLng ) {
		this.addToMap (
			objId,
			new LeafletCircleMarker ( latLng, theConfig.itineraryPoint.marker )
		);
	}

	/**
	This method add an search point marker to the map
	(= a leaflet.circleMarker object or a polyline, depending of the zoom and the geometry parameter).
	This method is called by the 'addsearchpointmarker' event listener.
	@param {Number} objId A unique identifier to attach to the circleMarker
	@param {Array.<Number>} latLng The latitude and longitude of the search point marker
	@param {?Array.<Array.<number>>} geometry The latitudes and longitudes of the search point marker when a polyline
	can be showed
	*/

	addSearchPointMarker ( objId, latLng, geometry ) {
		let showGeometry = false;
		if ( geometry ) {
			let latLngs = [];
			geometry.forEach (
				geometryPart => { latLngs = latLngs.concat ( geometryPart ); }
			);
			const geometryBounds = theGeometry.getLatLngBounds ( latLngs );
			const mapBounds = theTravelNotesData.map.getBounds ( );
			showGeometry =
				(
					( geometryBounds.getEast ( ) - geometryBounds.getWest ( ) )
					/
					( mapBounds.getEast ( ) - mapBounds.getWest ( ) )
				) > MapEditor.#MARKER_BOUNDS_PRECISION
				&&
				(
					( geometryBounds.getNorth ( ) - geometryBounds.getSouth ( ) )
					/
					( mapBounds.getNorth ( ) - mapBounds.getSouth ( ) )
				) > MapEditor.#MARKER_BOUNDS_PRECISION;
		}
		if ( showGeometry ) {
			this.addToMap ( objId, new LeafletPolyline ( geometry, theConfig.osmSearch.searchPointPolyline ) );
		}
		else {
			this.addToMap ( objId, new LeafletCircleMarker ( latLng, theConfig.osmSearch.searchPointMarker ) );
		}
	}

	/**
	This method add a rectangle to the map.
	This method is called by the 'addrectangle' event listener.
	@param {Number} objId A unique identifier to attach to the rectangle
	@param {Array.<Array.<number>>} bounds The lower left and upper right corner of the rectangle
	@param {LeafletObject} properties The Leaflet properties of the rectangle
	*/

	addRectangle ( objId, bounds, properties ) {
		this.addToMap (
			objId,
			new LeafletRectangle ( bounds, properties )
		);
	}

	/**
	This method changes the background map.
	This method is called by the 'layerchange' event listener.
	@param {MapLayer} layer The layer to set
	*/

	setLayer ( layer ) {
		const url = theApiKeysManager.getUrl ( layer );
		if ( ! url ) {
			return;
		}

		super.setLayer ( layer, url );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of MapEditor class
@type {MapEditor}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theMapEditor = new MapEditor ( );

export default theMapEditor;

/* --- End of file --------------------------------------------------------------------------------------------------------- */