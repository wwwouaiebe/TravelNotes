/*
Copyright - 2017 2022 - wwwouaiebe - Contact: http//www.ouaie.be/

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
	- v3.2.0:
		- Issue #7 : How to open a gpx file
Doc reviewed 20211129
Tests ...
*/

import Travel from '../data/Travel.js';
import Route from '../data/Route.js';
import ItineraryPoint from '../data/ItineraryPoint.js';
import Maneuver from '../data/Maneuver.js';
import WayPoint from '../data/WayPoint.js';
import Note from '../data/Note.js';
import theSphericalTrigonometry from '../coreLib/SphericalTrigonometry.js';
import theGeometry from '../coreLib/Geometry.js';
import theTranslator from '../UILib/Translator.js';
import { INVALID_OBJ_ID, ZERO, ONE, DISTANCE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Parser to transform a gpx file into a Travel object
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class GpxParser {

	/**
	The gpx document
	@type {XMLDocument}
	*/

	#gpxDocument;

	/**
	The destination Travel
	@type {Travel}
	*/

	#travel;

	/**
	The currently loaded Route
	@type {Route}
	*/

	#route;

	/**
	A boolean set to true when the gpx file comes from a node network
	@type {Boolean}
	*/

	#isNodeNetwork;

	/**
	Parse a trkpt xml node
	@param {Node} trkPtNode A Node with a trkpt tag
	*/

	#parseTrkPtNode ( trkPtNode ) {
		let itineraryPoint = new ItineraryPoint ( );
		itineraryPoint.lat = Number.parseFloat ( trkPtNode.getAttributeNS ( null, 'lat' ) );
		itineraryPoint.lng = Number.parseFloat ( trkPtNode.getAttributeNS ( null, 'lon' ) );
		const childs = trkPtNode.childNodes;
		for ( let nodeCounter = ZERO; nodeCounter < childs.length; nodeCounter ++ ) {
			switch ( childs [ nodeCounter ].nodeName ) {
			case 'ele' :
				itineraryPoint.elev = Number.parseFloat ( childs [ nodeCounter ].textContent );
				if ( ZERO !== itineraryPoint.elev ) {
					this.#route.itinerary.hasProfile = true;
				}
				break;
			default :
				break;
			}
		}
		this.#route.itinerary.itineraryPoints.add ( itineraryPoint );
	}

	/**
	Parse a trkseg xml node
	@param {Node} trkSegNode A Node with a trkseg tag
	*/

	#parseTrkSegNode ( trkSegNode ) {
		const childs = trkSegNode.childNodes;
		for ( let nodeCounter = ZERO; nodeCounter < childs.length; nodeCounter ++ ) {
			switch ( childs [ nodeCounter ].nodeName ) {
			case 'trkpt' :
				this.#parseTrkPtNode ( childs [ nodeCounter ] );
				break;
			default :
				break;
			}
		}
	}

	/**
	Compute the ascent and descent of the currently parsed Route
	*/

	#computeAscentAndDescent ( ) {
		let ascent = ZERO;
		let descent = ZERO;
		let itineraryPointsIterator = this.#route.itinerary.itineraryPoints.iterator;
		itineraryPointsIterator.done;
		while ( ! itineraryPointsIterator.done ) {
			let deltaElev = itineraryPointsIterator.value.elev - itineraryPointsIterator.previous.elev;
			if ( ZERO > deltaElev ) {
				descent -= deltaElev;
			}
			else {
				ascent += deltaElev;
			}
		}
		this.#route.itinerary.ascent = ascent;
		this.#route.itinerary.descent = descent;
	}

	/**
	Parse a trk xml node
	@param {Node} trkNode A Node with a trk tag
	*/

	#parseTrkNode ( trkNode ) {
		this.#route = new Route ( );
		const childs = trkNode.childNodes;
		for ( let nodeCounter = ZERO; nodeCounter < childs.length; nodeCounter ++ ) {
			switch ( childs [ nodeCounter ].nodeName ) {
			case 'name' :
				this.#route.name = childs [ nodeCounter ].textContent;
				break;
			case 'trkseg' :
				this.#parseTrkSegNode ( childs [ nodeCounter ] );
				break;
			default :
				break;
			}
		}
		if ( this.#route.itinerary.hasProfile ) {
			this.#computeAscentAndDescent ( );
		}
		this.#travel.routes.add ( this.#route );
	}

	/**
	Search the nearest ItineraryPoint objId of the currently parsed route from a given point
	@param {Array.<Number>} latLng The lat and lng of the given point
	*/

	#nearestItineraryPointObjId ( latLng ) {
		let distance = Number.MAX_VALUE;
		let itineraryPointObjId = INVALID_OBJ_ID;
		this.#route.itinerary.itineraryPoints.forEach (
			itineraryPoint => {
				const pointDistance = theSphericalTrigonometry.pointsDistance ( latLng, itineraryPoint.latLng );
				if ( pointDistance < distance ) {
					distance = pointDistance;
					itineraryPointObjId = itineraryPoint.objId;
				}
			}
		);
		return itineraryPointObjId;
	}

	/**
	Parse a rtept xml node
	@param {Node} rtePtNode A Node with a rtept tag
	*/

	#parseRtePtNode ( rtePtNode ) {
		const maneuver = new Maneuver ( );
		maneuver.iconName = 'kUndefined';
		const maneuverLat = Number.parseFloat ( rtePtNode.getAttributeNS ( null, 'lat' ) );
		const maneuverLng = Number.parseFloat ( rtePtNode.getAttributeNS ( null, 'lon' ) );
		maneuver.itineraryPointObjId = this.#nearestItineraryPointObjId ( [ maneuverLat, maneuverLng ] );
		const childs = rtePtNode.childNodes;
		for ( let nodeCounter = ZERO; nodeCounter < childs.length; nodeCounter ++ ) {
			switch ( childs [ nodeCounter ].nodeName ) {
			case 'desc' :
				maneuver.instruction = childs [ nodeCounter ].textContent;
				break;
			default :
				break;
			}
		}
		this.#route.itinerary.maneuvers.add ( maneuver );
	}

	/**
	Parse a rte xml node
	@param {Node} rteNode A Node with a rte tag
	*/

	#parseRteNode ( rteNode ) {
		const childs = rteNode.childNodes;
		for ( let nodeCounter = ZERO; nodeCounter < childs.length; nodeCounter ++ ) {
			switch ( childs [ nodeCounter ].nodeName ) {
			case 'name' :
				this.#route.name = childs [ nodeCounter ].textContent;
				break;
			case 'rtept' :
				this.#parseRtePtNode ( childs [ nodeCounter ] );
				break;
			default :
				break;
			}
		}
	}

	/**
	Add a note at the same position than a way node (only for node networks gpx files)
	@param {WayPoint} wayPoint The wayPoint for witch a Note must be created
	*/

	#addWptNote ( wayPoint ) {
		const note = new Note ( );
		note.latLng = wayPoint.latLng;
		note.iconLatLng = wayPoint.latLng;
		const names = wayPoint.name.split ( '+' );
		note.iconContent =
			'<div class="TravelNotes-MapNote TravelNotes-MapNoteCategory-0073">' +
			'<svg viewBox="0 0 20 20"><text x="10" y="14">' +
			names [ ZERO ] + '</text></svg></div>';

		note.tooltipContent = theTranslator.getText ( 'GpxParser - Network node' ) + names [ ZERO ];
		if ( names [ ONE ] ) {
			note.tooltipContent += theTranslator.getText ( 'GpxParser - Go to network node' ) + names [ ONE ];
		}

		note.distance = theGeometry.getClosestLatLngDistance ( this.#route, note.latLng ).distance;
		this.#route.notes.add ( note );
	}

	/**
	Parse a wpt xml node
	@param {Node} wptNode A Node with a wpt tag
	*/

	#parseWptNode ( wptNode ) {
		let wayPoint = new WayPoint ( );
		wayPoint.lat = Number.parseFloat ( wptNode.getAttributeNS ( null, 'lat' ) );
		wayPoint.lng = Number.parseFloat ( wptNode.getAttributeNS ( null, 'lon' ) );

		const childs = wptNode.childNodes;
		for ( let nodeCounter = ZERO; nodeCounter < childs.length; nodeCounter ++ ) {
			switch ( childs [ nodeCounter ].nodeName ) {
			case 'name' :
				wayPoint.name = childs [ nodeCounter ].textContent;
				break;
			default :
				break;
			}
		}
		this.#route.wayPoints.add ( wayPoint );
		if ( this.#isNodeNetwork ) {
			this.#addWptNote ( wayPoint );
		}
	}

	/**
	Parse a NodeList of wpt xml node
	@param {NodeList} wptNodes A NodeList of Nodes with a wpt tag
	*/

	#parseWptNodes ( wptNodes ) {
		for ( let wptNodeCounter = 0; wptNodeCounter < wptNodes.length; wptNodeCounter ++ ) {
			this.#parseWptNode ( wptNodes [ wptNodeCounter ] );
		}
	}

	/**
	Add a starting and an ending waypoint on each route of the parsed Travel
	*/

	#createWayPoints ( ) {
		this.#travel.routes.forEach (
			route => {
				route.wayPoints.remove ( route.wayPoints.first.objId );
				route.wayPoints.remove ( route.wayPoints.last.objId );
				const startWayPoint = new WayPoint ( );
				startWayPoint.latLng = route.itinerary.itineraryPoints.first.latLng;
				route.wayPoints.add ( startWayPoint );
				const endWayPoint = new WayPoint ( );
				endWayPoint.latLng = route.itinerary.itineraryPoints.last.latLng;
				route.wayPoints.add ( endWayPoint );
			}
		);
	}

	/**
	This method compute the route, itineraryPoints and maneuvers distances
	@param {Route} route The route for witch the distances are computed
	*/

	#computeRouteDistances ( route ) {

		// Computing the distance between itineraryPoints
		const itineraryPointsIterator = route.itinerary.itineraryPoints.iterator;
		const maneuverIterator = route.itinerary.maneuvers.iterator;

		itineraryPointsIterator.done;
		let maneuverDone = maneuverIterator.done;

		if ( ! maneuverDone ) {
			maneuverIterator.value.distance = DISTANCE.defaultValue;
			maneuverDone = maneuverIterator.done;
		}
		route.distance = DISTANCE.defaultValue;
		route.duration = DISTANCE.defaultValue;

		while ( ! itineraryPointsIterator.done ) {
			itineraryPointsIterator.previous.distance = theSphericalTrigonometry.pointsDistance (
				itineraryPointsIterator.previous.latLng,
				itineraryPointsIterator.value.latLng
			);
			route.distance += itineraryPointsIterator.previous.distance;
			if ( ! maneuverDone ) {
				maneuverIterator.previous.distance += itineraryPointsIterator.previous.distance;
				if ( maneuverIterator.value.itineraryPointObjId === itineraryPointsIterator.value.objId ) {
					route.duration += maneuverIterator.previous.duration;
					maneuverIterator.value.distance = DISTANCE.defaultValue;
					if (
						maneuverIterator.next
						&&
						maneuverIterator.value.itineraryPointObjId === maneuverIterator.next.itineraryPointObjId
					) {

						// 2 maneuvers on the same itineraryPoint. We skip the first maneuver
						maneuverDone = maneuverIterator.done;
						maneuverIterator.value.distance = DISTANCE.defaultValue;
					}
					maneuverDone = maneuverIterator.done;

				}
			}
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Parse a gpx string and load the data found in the gpx in a Travel Object
	@param {String} gpxString The string to parse
	@return {Travel} A travel cpmpleted with Routes and Notes found in the gpx string
	*/

	parse ( gpxString ) {
		this.#gpxDocument = new DOMParser ( ).parseFromString ( gpxString, 'text/xml' );

		this.#isNodeNetwork =
			Boolean (
				this.#gpxDocument.querySelector ( 'gpx' )
					.getAttributeNS ( null, 'creator' )
					.match ( /fietsnet|knooppuntnet/g )
			);
		this.#travel = new Travel ( );
		this.#travel.routes.remove ( this.#travel.routes.first.objId );
		const trkNodes = this.#gpxDocument.querySelectorAll ( 'trk' );
		for ( let trkNodeCounter = 0; trkNodeCounter < trkNodes.length; trkNodeCounter ++ ) {
			this.#parseTrkNode ( trkNodes [ trkNodeCounter ] );
		}
		const rteNodes = this.#gpxDocument.querySelectorAll ( 'rte' );

		if (
			ONE === rteNodes.length
			&&
			ONE === this.#travel.routes.length
		) {
			this.#parseRteNode ( rteNodes [ ZERO ] );
		}

		this.#travel.routes.forEach (
			route => this.#computeRouteDistances ( route )
		);

		const wptNodes = this.#gpxDocument.querySelectorAll ( 'wpt' );

		if (
			ZERO < wptNodes.length
			&&
			ONE === this.#travel.routes.length
		) {
			this.#route.wayPoints.remove ( this.#route.wayPoints.first.objId );
			this.#route.wayPoints.remove ( this.#route.wayPoints.last.objId );
			this.#parseWptNodes ( wptNodes );
		}
		else {
			this.#createWayPoints ( );
		}

		return this.#travel;
	}
}

export default GpxParser;

/* --- End of file --------------------------------------------------------------------------------------------------------- */