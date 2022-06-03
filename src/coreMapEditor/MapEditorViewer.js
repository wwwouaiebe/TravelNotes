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
	- v1.6.0:
		- created from MapEditor
	- v1.8.0:
		- Issue ♯97 : Improve adding a new waypoint to a route
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v2.0.0:
		- Issue ♯142 : Transform the layer object to a class as specified in the layersToolbarUI.js
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v3.2.0:
		- Issue ♯4 : Line type and line width for routes are not adapted on the print views
Doc reviewed 20210914
Tests ...
*/

import theConfig from '../data/Config.js';
import theDataSearchEngine from '../data/DataSearchEngine.js';
import theGeometry from '../coreLib/Geometry.js';
import theUtilities from '../UILib/Utilities.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theRouteHTMLViewsFactory from '../viewsFactories/RouteHTMLViewsFactory.js';
import theNoteHTMLViewsFactory from '../viewsFactories/NoteHTMLViewsFactory.js';
import { RouteMouseOverOrMoveEL } from '../coreMapEditor/RouteEventListeners.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';

import { GEOLOCATION_STATUS, ROUTE_EDITION_STATUS, ZERO, TWO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container with all the Leaflet objects for a note created by the MapEditorViewer.addNote ( )
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteLeafletObjects {

	/**
	The marker of the note (= a L.Marker object)
	@type {LeafletObject}
	*/

	#marker;

	/**
	The polyline of the note (= a L.Polyline object)
	@type {LeafletObject}
	*/

	#polyline;

	/**
	The bullet of the note (= a L.Marker object)
	@type {LeafletObject}
	*/

	#bullet;

	/**
	The constructor
	@param {LeafletObject} marker The marker of the note
	@param {LeafletObject} polyline The polyline of the note
	@param {LeafletObject} bullet The bullet of the note
	*/

	constructor ( marker, polyline, bullet ) {
		Object.freeze ( this );
		this.#marker = marker;
		this.#polyline = polyline;
		this.#bullet = bullet;
	}

	/**
	The marker of the note (= a L.Marker object)
	@type {LeafletObject}
	*/

	get marker ( ) { return this.#marker; }

	/**
	The polyline of the note (= a L.Polyline object)
	@type {LeafletObject}
	*/

	get polyline ( ) { return this.#polyline; }

	/**
	The bullet of the note (= a L.Marker object)
	@type {LeafletObject}
	*/

	get bullet ( ) { return this.#bullet; }

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class performs all the readonly updates on the map

Ssee theMapEditor for read/write updates on the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapEditorViewer {

	/**
	A reference to the L.tileLayer  object that contains the current map
	@type {LeafletObject}
	*/

	#currentLayer;

	/**
	A reference to the L.circleMarker object used for the geolocation
	@type {LeafletObject}
	*/

	#geolocationCircle;

	/**
	Simple constant for the max possible zoom
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #DEFAULT_MAX_ZOOM ( ) { return 18; }

	/**
	Simple constant for the min possible zoom
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #DEFAULT_MIN_ZOOM ( ) { return 0; }

	/**
	Simple constant for the z-index css value for notes
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #NOTE_Z_INDEX_OFFSET ( ) { return 100; }

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#currentLayer = null;
		this.#geolocationCircle = null;
	}

	/**
	Add a Leaflet object to the map
	@param {Number} objId The objId to use
	@param {LeafletObject} leafletObject The Leaflet object to add
	*/

	addToMap ( objId, leafletObject ) {
		leafletObject.objId = objId;
		leafletObject.addTo ( theTravelNotesData.map );
		theTravelNotesData.mapObjects.set ( objId, leafletObject );
	}

	/**
	This method add a route on the map
	This method is called by the 'routeupdated' event listener of the viewer
	and by the MapEditor.updateRoute( ) method
	@param {Number} routeObjId The objId of the route to add
	@return {Route} the added Route
	*/

	addRoute ( routeObjId ) {
		const route = theDataSearchEngine.getRoute ( routeObjId );

		// an array of points is created
		const latLng = [];
		const itineraryPointsIterator = route.itinerary.itineraryPoints.iterator;
		while ( ! itineraryPointsIterator.done ) {
			latLng.push ( itineraryPointsIterator.value.latLng );
		}

		// the leaflet polyline is created and added to the map
		const polyline = window.L.polyline (
			latLng,
			{
				color : route.color,
				weight : route.width,
				dashArray : route.dashString
			}
		);
		this.addToMap ( route.objId, polyline );

		// tooltip and popup are created
		if ( ROUTE_EDITION_STATUS.notEdited === route.editionStatus ) {
			polyline.bindTooltip (
				route.computedName,
				{ sticky : true, direction : 'right' }
			);
			window.L.DomEvent.on ( polyline, 'mouseover', RouteMouseOverOrMoveEL.handleEvent );
			window.L.DomEvent.on ( polyline, 'mousemove', RouteMouseOverOrMoveEL.handleEvent );
		}

		polyline.bindPopup (
			layer => theHTMLSanitizer.clone (
				theRouteHTMLViewsFactory.getRouteHeaderHTML (
					'TravelNotes-Map-',
					theDataSearchEngine.getRoute ( layer.objId )
				)
			)
		);

		// left click event
		window.L.DomEvent.on ( polyline, 'click', clickEvent => clickEvent.target.openPopup ( clickEvent.latlng ) );

		// notes are added
		const notesIterator = route.notes.iterator;
		while ( ! notesIterator.done ) {
			this.addNote ( notesIterator.value.objId );
		}

		return route;
	}

	/**
	This method add a note on the map
	This method is called by the 'noteupdated' event listener of the viewer
	and indirectly by the MapEditor.updateNote( ) method
	@param {Number} noteObjId The objId of the note to add
	@return {NoteLeafletObjects} An object with a reference to the Leaflet objects of the note
	*/

	addNote ( noteObjId ) {
		const note = theDataSearchEngine.getNoteAndRoute ( noteObjId ).note;

		// first a marker is created at the note position. This marker is empty and transparent, so
		// not visible on the map but the marker can be dragged
		const bullet = window.L.marker (
			note.latLng,
			{
				icon : window.L.divIcon (
					{
						iconSize : [ theConfig.note.grip.size, theConfig.note.grip.size ],
						iconAnchor : [ theConfig.note.grip.size / TWO, theConfig.note.grip.size / TWO ],
						html : '<div></div>',
						className : 'TravelNotes-Map-Note-Bullet'
					}
				),
				opacity : theConfig.note.grip.opacity,
				draggable : ! theTravelNotesData.travel.readOnly
			}
		);
		bullet.objId = note.objId;

		// a second marker is now created. The icon created by the user is used for this marker
		const marker = window.L.marker (
			note.iconLatLng,
			{
				zIndexOffset : MapEditorViewer.#NOTE_Z_INDEX_OFFSET,
				icon : window.L.divIcon (
					{
						iconSize : [ note.iconWidth, note.iconHeight ],
						iconAnchor : [ note.iconWidth / TWO, note.iconHeight / TWO ],
						popupAnchor : [ ZERO, -note.iconHeight / TWO ],
						html : note.iconContent,
						className : 'TravelNotes-Map-AllNotes '
					}
				),
				draggable : ! theTravelNotesData.travel.readOnly
			}
		);
		marker.objId = note.objId;

		// a popup is binded to the the marker...
		marker.bindPopup (
			layer => theHTMLSanitizer.clone (
				theNoteHTMLViewsFactory.getNoteTextHTML (
					'TravelNotes-Map-',
					theDataSearchEngine.getNoteAndRoute ( layer.objId )
				)
			)
		);

		// ... and also a tooltip
		if ( ZERO !== note.tooltipContent.length ) {
			marker.bindTooltip (
				layer => theDataSearchEngine.getNoteAndRoute ( layer.objId ).note.tooltipContent
			);
			marker.getTooltip ( ).options.offset [ ZERO ] = note.iconWidth / TWO;
		}

		// Finally a polyline is created between the 2 markers
		const polyline = window.L.polyline ( [ note.latLng, note.iconLatLng ], theConfig.note.polyline );
		polyline.objId = note.objId;

		// The 3 objects are added to a layerGroup
		const layerGroup = window.L.layerGroup ( [ marker, polyline, bullet ] );
		layerGroup.markerId = window.L.Util.stamp ( marker );
		layerGroup.polylineId = window.L.Util.stamp ( polyline );
		layerGroup.bulletId = window.L.Util.stamp ( bullet );

		// and the layerGroup added to the leaflet map and JavaScript map
		this.addToMap ( note.objId, layerGroup );

		if ( theConfig.note.haveBackground ) {
			document.querySelectorAll ( '.TravelNotes-MapNote,.TravelNotes-SvgIcon' ).forEach (
				noteIcon => noteIcon.classList.add ( 'TravelNotes-Map-Note-Background' )
			);
		}
		return new NoteLeafletObjects ( marker, polyline, bullet );
	}

	/**
	This method zoom to a point or an array of points
	@param {Array.<Number>} latLng the point
	@param {Array.<Array.<Array.<number>>>} geometry the array of points...
	*/

	zoomTo ( latLng, geometry ) {
		if ( geometry ) {
			let latLngs = [];
			geometry.forEach ( geometryPart => latLngs = latLngs.concat ( geometryPart ) );
			theTravelNotesData.map.fitBounds ( theGeometry.getLatLngBounds ( latLngs ) );
		}
		else {
			theTravelNotesData.map.setView ( latLng, theConfig.itineraryPoint.zoomFactor );
		}
	}

	/**
	This method changes the background map.
	This method is called by the 'layerchange' event listener of the viewer
	and by the MapEditor.setLayer( ) method
	@param {MapLayer} layer The layer to set
	@param {String} url The url to use for this layer (reminder: url !== layer.url !!! See MapEditor.setLayer)
	*/

	setLayer ( layer, url ) {
		const leafletLayer =
			'wmts' === layer.service.toLowerCase ( )
				?
				window.L.tileLayer ( url )
				:
				window.L.tileLayer.wms ( url, layer.wmsOptions );

		if ( this.#currentLayer ) {
			theTravelNotesData.map.removeLayer ( this.#currentLayer );
		}
		theTravelNotesData.map.addLayer ( leafletLayer );
		this.#currentLayer = leafletLayer;
		if ( ! theTravelNotesData.travel.readOnly ) {

			// strange... see Issue ♯79 ... zoom is not correct on read only file
			// when the background map have bounds...
			if ( theTravelNotesData.map.getZoom ( ) < ( layer.minZoom || MapEditorViewer.#DEFAULT_MIN_ZOOM ) ) {
				theTravelNotesData.map.setZoom ( layer.minZoom || MapEditorViewer.#DEFAULT_MIN_ZOOM );
			}
			theTravelNotesData.map.setMinZoom ( layer.minZoom || MapEditorViewer.#DEFAULT_MIN_ZOOM );
			if ( theTravelNotesData.map.getZoom ( ) > ( layer.maxZoom || MapEditorViewer.#DEFAULT_MAX_ZOOM ) ) {
				theTravelNotesData.map.setZoom ( layer.maxZoom || MapEditorViewer.#DEFAULT_MAX_ZOOM );
			}
			theTravelNotesData.map.setMaxZoom ( layer.maxZoom || MapEditorViewer.#DEFAULT_MAX_ZOOM );
			if ( layer.bounds ) {
				if (
					! theTravelNotesData.map.getBounds ( ).intersects ( layer.bounds )
					||
					theTravelNotesData.map.getBounds ( ).contains ( layer.bounds )
				) {
					theTravelNotesData.map.setMaxBounds ( null );
					theTravelNotesData.map.fitBounds ( layer.bounds );
					theTravelNotesData.map.setZoom ( layer.minZoom || MapEditorViewer.#DEFAULT_MIN_ZOOM );
				}
				theTravelNotesData.map.setMaxBounds ( layer.bounds );
			}
			else {
				theTravelNotesData.map.setMaxBounds ( null );
			}
		}
		theTravelNotesData.map.fire ( 'baselayerchange', leafletLayer );
	}

	/**
	This method is called when the geolocation status is changed
	@param {GEOLOCATION_STATUS} geoLocationStatus The geolocation status
	*/

	onGeolocationStatusChanged ( geoLocationStatus ) {
		if ( GEOLOCATION_STATUS.active === geoLocationStatus ) {
			return;
		}
		if ( this.#geolocationCircle ) {
			theTravelNotesData.map.removeLayer ( this.#geolocationCircle );
			this.#geolocationCircle = null;
		}
	}

	/**
	This method is called when the geolocation position is changed
	@param {GeolocationPosition} position a JS GeolocationPosition object
	*/

	onGeolocationPositionChanged ( position ) {
		let zoomToPosition = theConfig.geoLocation.zoomToPosition;
		if ( this.#geolocationCircle ) {
			theTravelNotesData.map.removeLayer ( this.#geolocationCircle );
			zoomToPosition = false;
		}

		let tooltip =
			'Position (+/- ' + position.coords.accuracy.toFixed ( ZERO ) + ' m) : <br/>'
			+ theUtilities.formatLatLngDMS ( [ position.coords.latitude, position.coords.longitude ] )
			+ '<br/>'
			+ theUtilities.formatLatLng ( [ position.coords.latitude, position.coords.longitude ] )
			+ '<br/>';
		if ( position.coords.altitude ) {
			tooltip += '<br/> Altitude (+/- ' + position.coords.altitudeAccuracy.toFixed ( ZERO ) + ' m) :<br/>'
			+ position.coords.altitude.toFixed ( ZERO ) + ' m';
		}

		if ( ZERO === theConfig.geoLocation.marker.radius ) {
			this.#geolocationCircle = window.L.circle (
				window.L.latLng ( position.coords.latitude, position.coords.longitude ),
				theConfig.geoLocation.marker
			)
				.setRadius ( position.coords.accuracy.toFixed ( ZERO ) );
		}
		else {
			this.#geolocationCircle = window.L.circleMarker (
				window.L.latLng ( position.coords.latitude, position.coords.longitude ),
				theConfig.geoLocation.marker
			);
		}
		this.#geolocationCircle
			.bindTooltip ( tooltip )
			.bindPopup ( tooltip )
			.addTo ( theTravelNotesData.map );
		this.#geolocationCircle.openPopup ( );
		if ( zoomToPosition ) {
			theTravelNotesData.map.setView (
				window.L.latLng ( position.coords.latitude, position.coords.longitude ),
				theConfig.geoLocation.zoomFactor
			);
		}
	}

}

export default MapEditorViewer;

/* --- End of file --------------------------------------------------------------------------------------------------------- */