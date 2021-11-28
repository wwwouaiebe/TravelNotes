
import Travel from '../data/Travel.js';
import Route from '../data/Route.js';
import ItineraryPoint from '../data/ItineraryPoint.js';
import Maneuver from '../data/Maneuver.js';
import WayPoint from '../data/WayPoint.js';
import theSphericalTrigonometry from '../coreLib/SphericalTrigonometry.js';
import { INVALID_OBJ_ID, ZERO, ONE, DISTANCE } from '../main/Constants.js';

class GpxParser {

	#gpxDocument;

	#travel;

	#route;

	#parseTrkPtNode ( trkPtNode ) {
		let itineraryPoint = new ItineraryPoint ( );
		itineraryPoint.lat = Number.parseFloat ( trkPtNode.getAttributeNS ( null, 'lat' ) );
		itineraryPoint.lng = Number.parseFloat ( trkPtNode.getAttributeNS ( null, 'lon' ) );
		const childs = trkPtNode.childNodes;
		for ( let nodeCounter = ZERO; nodeCounter < childs.length; nodeCounter ++ ) {
			switch ( childs [ nodeCounter ].nodeName ) {
			case 'ele' :
				itineraryPoint.elev = Number.parseFloat ( childs [ nodeCounter ].textContent );
				break;
			default :
				break;
			}
		}
		this.#route.itinerary.itineraryPoints.add ( itineraryPoint );
	}

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
		this.#travel.routes.add ( this.#route );
	}

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
	}

	#parseWptNodes ( wptNodes ) {
		for ( let wptNodeCounter = 0; wptNodeCounter < wptNodes.length; wptNodeCounter ++ ) {
			this.#parseWptNode ( wptNodes [ wptNodeCounter ] );
		}
	}

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
						maneuverIterator.done;
						maneuverIterator.value.distance = DISTANCE.defaultValue;
					}
					maneuverIterator.done;

				}
			}
		}
	}

	constructor ( ) {
		Object.freeze ( this );
	}

	parse ( gpxString ) {
		this.#gpxDocument = new DOMParser ( ).parseFromString ( gpxString, 'text/xml' );
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

		this.#travel.routes.forEach (
			route => this.#computeRouteDistances ( route )
		);

		return this.#travel;
	}
}

export default GpxParser;