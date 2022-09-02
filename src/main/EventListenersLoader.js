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

import theMapEditor from '../core/mapEditor/MapEditor.js';
import theIndexedDb from '../core/uiLib/IndexedDb.js';
import theProfileDialogsManager from '../core/ProfileDialogsManager.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theConfig from '../data/Config.js';
import theDockableDialogsManager from '../core/DockableDialogsManager.js';
import theProvidersToolbar from '../toolbars/providersToolbar/ProvidersToolbar.js';
import RoadbookUpdateEL from './RoadbookUpdateEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Simple static methods for the loading of event listeners
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class EventListenersLoader {

	/**
	Loading event listeners
	*/

	static addEventsListeners ( ) {
		document.addEventListener (
			'routeupdated',
			updateRouteEvent => {
				if ( updateRouteEvent.data ) {
					theMapEditor.updateRoute (
						updateRouteEvent.data.removedRouteObjId,
						updateRouteEvent.data.addedRouteObjId
					);
				}
			},
			false
		);
		document.addEventListener (
			'routepropertiesupdated',
			updateRoutePropertiesEvent => {
				if ( updateRoutePropertiesEvent.data ) {
					theMapEditor.updateRouteProperties (
						updateRoutePropertiesEvent.data.routeObjId
					);
				}
			},
			false
		);
		document.addEventListener (
			'noteupdated',
			updateNoteEvent => {
				if ( updateNoteEvent.data ) {
					theMapEditor.updateNote (
						updateNoteEvent.data.removedNoteObjId,
						updateNoteEvent.data.addedNoteObjId
					);
				}
			},
			false
		);
		document.addEventListener (
			'removeobject',
			removeObjectEvent => {
				if ( removeObjectEvent.data ) {
					theMapEditor.removeObject (
						removeObjectEvent.data.objId
					);
				}
			},
			false
		);
		document.addEventListener ( 'removeallobjects',	( ) => theMapEditor.removeAllObjects ( ), false );
		document.addEventListener (
			'zoomto',
			zoomToEvent => {
				if ( zoomToEvent.data ) {
					theMapEditor.zoomTo (
						zoomToEvent.data.latLng,
						zoomToEvent.data.geometry
					);
				}
			},
			false
		);
		document.addEventListener (
			'additinerarypointmarker',
			addItineraryPointMarkerEvent => {
				if ( addItineraryPointMarkerEvent.data ) {
					theMapEditor.addItineraryPointMarker (
						addItineraryPointMarkerEvent.data.objId,
						addItineraryPointMarkerEvent.data.latLng
					);
				}
			},
			false
		);
		document.addEventListener (
			'addsearchpointmarker',
			addSearchPointMarkerEvent => {
				if ( addSearchPointMarkerEvent.data ) {
					theMapEditor.addSearchPointMarker (
						addSearchPointMarkerEvent.data.objId,
						addSearchPointMarkerEvent.data.latLng,
						addSearchPointMarkerEvent.data.geometry
					);
				}
			},
			false
		);
		document.addEventListener (
			'addrectangle',
			addRectangleEvent => {
				if ( addRectangleEvent.data ) {
					theMapEditor.addRectangle (
						addRectangleEvent.data.objId,
						addRectangleEvent.data.bounds,
						addRectangleEvent.data.properties
					);
				}
			},
			false
		);
		document.addEventListener (
			'addwaypoint',
			addWayPointEvent => {
				if ( addWayPointEvent.data ) {
					theMapEditor.addWayPoint (
						addWayPointEvent.data.wayPoint,
						addWayPointEvent.data.letter
					);
				}
			},
			false
		);
		document.addEventListener (
			'layerchange',
			layerChangeEvent => {
				if ( layerChangeEvent.data ) {
					theMapEditor.setLayer ( layerChangeEvent.data.layer );
				}
			}
		);
		document.addEventListener (
			'geolocationpositionchanged',
			geoLocationPositionChangedEvent => {
				if ( geoLocationPositionChangedEvent.data ) {
					theMapEditor.onGeolocationPositionChanged ( geoLocationPositionChangedEvent.data.position );
				}
			},
			false
		);
		document.addEventListener (
			'geolocationstatuschanged',
			geoLocationStatusChangedEvent => {
				if ( geoLocationStatusChangedEvent.data ) {
					theMapEditor.onGeolocationStatusChanged ( geoLocationStatusChangedEvent.data.status );
				}
			},
			false
		);
		document.addEventListener ( 'roadbookupdate', new RoadbookUpdateEL ( ), false );
		document.addEventListener (
			'profileclosed',
			profileClosedEvent => {
				if ( profileClosedEvent.data ) {
					theProfileDialogsManager.onProfileClosed ( profileClosedEvent.data.objId );
				}
			},
			false
		);
		document.addEventListener (
			'setrouteslist',
			( ) => theDockableDialogsManager.travelPropertiesDialog.updateContent ( ),
			false
		);
		document.addEventListener (
			'updatetravelnotes',
			( ) => theDockableDialogsManager.travelNotesDialog.updateContent ( ),
			false
		);
		document.addEventListener (
			'showsearch',
			( ) => theDockableDialogsManager.osmSearchDialog.updateContent ( ),
			false
		);
		document.addEventListener (
			'showtravelproperties',
			( ) => theDockableDialogsManager.showTravelProperties ( ),
			false
		);
		document.addEventListener ( 'providersadded', ( ) => theProvidersToolbar.providersAdded ( ), false );
		document.addEventListener (
			'setprovider',
			setProviderEvent => {
				if ( setProviderEvent?.data?.provider ) {
					theProvidersToolbar.provider = setProviderEvent.data.provider;
				}
			},
			false
		);
		document.addEventListener (
			'settransitmode',
			setTransitModeEvent => {
				if ( setTransitModeEvent?.data?.transitMode ) {
					theProvidersToolbar.transitMode = setTransitModeEvent.data.transitMode;
				}
			},
			false
		);

	}

	/**
	Loading unload and beforeunload event listeners
	*/

	static addUnloadEventsListeners ( ) {
		window.addEventListener ( 'unload', ( ) => localStorage.removeItem ( theTravelNotesData.UUID ) );
		window.addEventListener (
			'beforeunload',
			beforeUnloadEvent => {
				theIndexedDb.closeDb ( theTravelNotesData.UUID );
				if ( theConfig.travelNotes.haveBeforeUnloadWarning ) {
					beforeUnloadEvent.returnValue = 'x';
					return 'x';
				}
			}
		);
	}
}

export default EventListenersLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */