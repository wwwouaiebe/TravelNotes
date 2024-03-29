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
import theDataSearchEngine from '../../data/DataSearchEngine.js';
import theGeometry from '../../core/lib/Geometry.js';
import theUtilities from '../../core/uiLib/Utilities.js';
import theTravelNotesData from '../../data/TravelNotesData.js';
import theRouteHTMLViewsFactory from '../../viewsFactories/RouteHTMLViewsFactory.js';
import theNoteHTMLViewsFactory from '../../viewsFactories/NoteHTMLViewsFactory.js';
import RouteMouseOverOrMoveEL from './RouteEL/RouteMouseOverOrMoveEL.js';
import theHTMLSanitizer from '../htmlSanitizer/HTMLSanitizer.js';
import NoteLeafletObjects from './NoteLeafletObjects.js';

import { GEOLOCATION_STATUS, ROUTE_EDITION_STATUS, NOT_FOUND, ZERO, TWO } from '../../main/Constants.js';
import theTranslator from '../../core/uiLib/Translator.js';
import theDevice from '../../core/lib/Device.js';

import {
	LeafletCircle,
	LeafletCircleMarker,
	LeafletDivIcon,
	LeafletLatLng,
	LeafletLayerGroup,
	LeafletMarker,
	LeafletPolyline,
	LeafletTileLayer,
	LeafletDomEvent,
	LeafletUtil
} from '../../leaflet/LeafletImports.js';

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
		const polyline = new LeafletPolyline (
			latLng,
			{
				color : route.color,
				weight : route.width,
				dashArray : route.dashString
			}
		);
		this.addToMap ( route.objId, polyline );

		// popup is created
		if ( ! theDevice.isTouch ) {
			polyline.bindPopup (
				layer => theHTMLSanitizer.clone (
					theRouteHTMLViewsFactory.getRouteHeaderHTML (
						'TravelNotes-Map-',
						theDataSearchEngine.getRoute ( layer.objId )
					)
				)
			);
			LeafletDomEvent.on ( polyline, 'click', clickEvent => clickEvent.target.openPopup ( clickEvent.latlng ) );
		}

		// tooltip is created
		if ( ROUTE_EDITION_STATUS.notEdited === route.editionStatus ) {
			polyline.bindTooltip (
				route.computedName,
				{ sticky : true, direction : 'right' }
			);
			if ( ! theDevice.isTouch ) {
				LeafletDomEvent.on ( polyline, 'mouseover', RouteMouseOverOrMoveEL.handleEvent );
				LeafletDomEvent.on ( polyline, 'mousemove', RouteMouseOverOrMoveEL.handleEvent );
			}
		}

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
		const bullet = new LeafletMarker (
			note.latLng,
			{
				icon : new LeafletDivIcon (
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
		const marker = new LeafletMarker (
			note.iconLatLng,
			{
				zIndexOffset : MapEditorViewer.#NOTE_Z_INDEX_OFFSET,
				icon : new LeafletDivIcon (
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
		const polyline = new LeafletPolyline ( [ note.latLng, note.iconLatLng ], theConfig.note.polyline );
		polyline.objId = note.objId;

		// The 3 objects are added to a layerGroup
		const layerGroup = new LeafletLayerGroup ( [ marker, polyline, bullet ] );
		layerGroup.markerId = LeafletUtil.stamp ( marker );
		layerGroup.polylineId = LeafletUtil.stamp ( polyline );
		layerGroup.bulletId = LeafletUtil.stamp ( bullet );

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
				new LeafletTileLayer ( url )
				:
				new ( LeafletTileLayer.WMS ) ( url, layer.wmsOptions );

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
	Click on the geo location circle event listener
	@param {Event} clickEvent The event to handle
	*/

	#onGeoLocationPositionClick ( clickEvent ) {
		const copiedMessage = theTranslator.getText ( 'MapEditorViewer -Copied to clipboard' );
		const tooltipContent = clickEvent.target.getTooltip ( ).getContent ( );
		if ( NOT_FOUND === tooltipContent.indexOf ( copiedMessage ) ) {
			navigator.clipboard.writeText (	tooltipContent.replaceAll ( '<br/>', '\n' )	)
				.then (
					( ) => {
						clickEvent.target.getTooltip ( ).setContent (
							tooltipContent + '<br/><br/>' +
							theTranslator.getText ( 'MapEditorViewer -Copied to clipboard' )
						);
					}
				)
				.catch ( ( ) => console.error ( 'Failed to copy to clipboard ' ) );
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
			tooltip += '<br/> Altitude  :<br/>'
			+ position.coords.altitude.toFixed ( ZERO ) + ' m';
			if ( position.coords.altitudeAccuracy ) {
				tooltip += '(+/- ' + position.coords.altitudeAccuracy.toFixed ( ZERO ) + ' m)';
			}
		}

		if ( ZERO === theConfig.geoLocation.marker.radius ) {
			this.#geolocationCircle = new LeafletCircle (
				new LeafletLatLng ( position.coords.latitude, position.coords.longitude ),
				theConfig.geoLocation.marker
			);
			this.#geolocationCircle.setRadius ( position.coords.accuracy.toFixed ( ZERO ) );
		}
		else {
			this.#geolocationCircle = new LeafletCircleMarker (
				new LeafletLatLng ( position.coords.latitude, position.coords.longitude ),
				theConfig.geoLocation.marker
			);
		}
		this.#geolocationCircle
			.bindTooltip ( tooltip )
			.addTo ( theTravelNotesData.map );
		if ( ! theConfig.geoLocation.watch ) {
			this.#geolocationCircle
				.bindPopup ( tooltip )
				.openPopup ( );
		}
		this.#geolocationCircle.on (
			'click',
			clickEvent => { this.#onGeoLocationPositionClick ( clickEvent ); }
		);
		if ( zoomToPosition ) {
			theTravelNotesData.map.setView (
				new LeafletLatLng ( position.coords.latitude, position.coords.longitude ),
				theConfig.geoLocation.zoomFactor
			);
		}
	}

}

export default MapEditorViewer;

/* --- End of file --------------------------------------------------------------------------------------------------------- */