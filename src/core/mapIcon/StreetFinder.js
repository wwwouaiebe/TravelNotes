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
Doc reviewed 20210914
Tests ...
*/

import theConfig from '../data/Config.js';
import theSphericalTrigonometry from '../coreLib/SphericalTrigonometry.js';
import theTranslator from '../UILib/Translator.js';

import { DISTANCE, ZERO, ONE, TWO, NOT_FOUND, ICON_POSITION } from '../main/Constants.js';

/**
A simple container to store data on roundabouts
*/

class RoundaboutData {

	/**
	A boolean indicating when the roundabout is a mini roundabout
	@type {Boolean}
	*/

	isMini;

	/**
	A boolean indicating when the icon is placed at the entry of a roundabout
	@type {Boolean}
	*/

	isEntry;

	/**
	A boolean indicating when the icon is placed at the exit of a roundabout
	@type {Boolean}
	*/

	isExit;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
		this.isMini = false;
		this.isEntry = false;
		this.isExit = false;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Search:
- the rcn ref number at the icon position
- roundabout info at the icon position
- street names at the icon position
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class StreetFinder {

	/**
	A reference to the computeData object of the MapIconFromOsmFactory
	@type {ComputeDataForMapIcon}
	*/

	#computeData;

	/**
	A reference to the noteData Object of the MapIconFromOsmFactory
	@type {NoteDataForMapIcon}
	*/

	#noteData;

	/**
	A reference to the noteData overpassAPIDataLoader of the MapIconFromOsmFactory
	@type {OverpassAPIDataLoader}
	*/

	#overpassAPIDataLoader;

	/**
	The osm node of the rcnRef
	@type {Number}
	*/

	#rcnRefOsmNode;

	/**
	The osm node of the rcnRef
	@type {Number}
	*/

	#iconOsmNode;

	/**
	The osm node id of the incoming node
	@type {Number}
	*/

	#iconOsmNodeId;

	/**
	The osm node id of the incoming node
	@type {Number}
	*/

	#incomingOsmNodeId;

	/**
	The osm node id of the outgoing node
	@type {Number}
	*/

	#outgoingOsmNodeId;

	/**
	The incoming street name
	@type {String}
	*/

	#incomingStreetName;

	/**
	The outgoing street name
	@type {String}
	*/

	#outgoingStreetName;

	/**
	Roundabout data
	@type {RoundaboutData}
	*/

	#roundaboutData;

	/**
	Return the name of a way
	@param {OsmElement} way  A way found in the request result
	@return {String} the concatenation of the way.ref and way.name if any
	*/

	#getWayName ( way ) {
		return ( way.tags.name ? way.tags.name : '' ) +
			( way.tags.name && way.tags.ref ? ' ' : '' ) +
			( way.tags.ref ? '[' + way.tags.ref + ']' : '' );
	}

	/**
	This method compare the lat and lng of the parameter with the lat and lng of the route waypoints
	@param {ItineraryPoint} itineraryPoint the itineraryPoint to test
	@return {Boolean} true when the itineraryPoint is not at the same position than a WayPoint and not at the
	same position than the icon point
	*/

	#latLngCompare ( itineraryPoint ) {

		const COMPARE_PRECISION = 0.000005;

		let isWayPoint = false;
		this.#computeData.route.wayPoints.forEach (
			wayPoint => {
				if (
					( Math.abs ( itineraryPoint.lat - wayPoint.lat ) < COMPARE_PRECISION )
					&&
					( Math.abs ( itineraryPoint.lng - wayPoint.lng ) < COMPARE_PRECISION )
				) {
					isWayPoint = true;
				}
			}
		);
		return (
			! isWayPoint
			&&
			(
				this.#noteData.latLng [ ZERO ] !== itineraryPoint.lat
				||
				this.#noteData.latLng [ ONE ] !== itineraryPoint.lng
			)
		);
	}

	/**
	Searching incoming node and outgoing node ( nodes before and after the icon node on the route )
	and the rcnRef node ( bike only )
	*/

	#findOsmNodes ( ) {

		// searching the previous and next point on the itinerary
		const incomingItineraryPoint = this.#computeData.route.itinerary.itineraryPoints.previous (
			this.#computeData.nearestItineraryPointObjId,
			itineraryPoint => this.#latLngCompare ( itineraryPoint )
		);
		const outgoingItineraryPoint = this.#computeData.route.itinerary.itineraryPoints.next (
			this.#computeData.nearestItineraryPointObjId,
			itineraryPoint => this.#latLngCompare ( itineraryPoint )
		);

		// creating some var for finding the nearest points. We don't use lat lng to avoid problems with precision
		let iconNodeDistance = Number.MAX_VALUE;
		let rcnRefDistance = Number.MAX_VALUE;
		let incomingNodeDistance = Number.MAX_VALUE;
		let outgoingNodeDistance = Number.MAX_VALUE;

		let nodeDistance = DISTANCE.defaultValue;

		// searching in the nodes map of the overpassAPIDataLoader ...
		this.#overpassAPIDataLoader.nodes.forEach (
			node => {
				nodeDistance = theSphericalTrigonometry.pointsDistance (
					[ node.lat, node.lon ],
					this.#noteData.latLng
				);

				// ... a rcnRef...
				if (
					'bike' === this.#computeData.route.itinerary.transitMode
					&&
					node?.tags?.rcn_ref
					&&
					node.tags [ 'network:type' ]
					&&
					'node_network' === node.tags [ 'network:type' ]
					&&
					nodeDistance < theConfig.note.svgIcon.rcnRefDistance
					&&
					nodeDistance < rcnRefDistance
				) {
					this.#rcnRefOsmNode = node;
					rcnRefDistance = nodeDistance;
				}

				// ... the note node
				if ( nodeDistance < iconNodeDistance ) {
					this.#iconOsmNodeId = node.id;
					iconNodeDistance = nodeDistance;
				}

				// ... the incoming node...
				if ( incomingItineraryPoint ) {
					nodeDistance =
						theSphericalTrigonometry.pointsDistance ( [ node.lat, node.lon ], incomingItineraryPoint.latLng );
					if ( nodeDistance < incomingNodeDistance ) {
						this.#incomingOsmNodeId = node.id;
						incomingNodeDistance = nodeDistance;
					}
				}

				// ... and the outgoing node
				if ( outgoingItineraryPoint ) {
					nodeDistance =
						theSphericalTrigonometry.pointsDistance ( [ node.lat, node.lon ], outgoingItineraryPoint.latLng );
					if ( nodeDistance < outgoingNodeDistance ) {
						this.#outgoingOsmNodeId = node.id;
						outgoingNodeDistance = nodeDistance;
					}
				}
			}
		);

		this.#iconOsmNode = this.#overpassAPIDataLoader.nodes.get ( this.#iconOsmNodeId );
	}

	/**
	Searching a mini roundabout at the icon node
	*/

	#findMiniRoundabout ( ) {
		this.#roundaboutData.isMini = 'mini_roundabout' === this?.#iconOsmNode?.tags?.highway;
	}

	/**
	Adding the rcnRef number to the tooltip and the computeData
	*/

	#addRcnRefNumber ( ) {
		if ( this.#rcnRefOsmNode ) {
			this.#computeData.rcnRef = this.#rcnRefOsmNode.tags.rcn_ref;
			this.#noteData.tooltipContent +=
				theTranslator.getText ( 'StreetFinder - rcnRef', { rcnRef : this.#computeData.rcnRef } );
		}
	}

	/**
	Searching  passing streets names, incoming and outgoing streets names, roundabout entry and exit
	*/

	#findStreets ( ) {
		this.#overpassAPIDataLoader.ways.forEach (
			way => {
				if ( ! way.nodes.includes ( this.#iconOsmNodeId ) ) {
					return;
				}

				const wayName = this.#getWayName ( way );
				const haveName = '' !== wayName;

				const isIncomingStreet = way.nodes.includes ( this.#incomingOsmNodeId );
				const isOutgoingStreet = way.nodes.includes ( this.#outgoingOsmNodeId );

				// the same way can enter multiple times in the intersection!
				let streetOcurrences = way.nodes.filter ( nodeId => nodeId === this.#iconOsmNodeId ).length * TWO;

				// the icon is at the begining of the street
				if ( way.nodes [ ZERO ] === this.#iconOsmNodeId ) {
					streetOcurrences --;
				}

				// the icon is at end of the street
				if ( way.nodes [ way.nodes.length - ONE ] === this.#iconOsmNodeId ) {
					streetOcurrences --;
				}

				// it's the incoming street ...saving name  and eventually the roundabout exit
				if ( isIncomingStreet ) {
					this.#incomingStreetName = haveName ? wayName : '???';
					streetOcurrences --;
					if ( 'roundabout' === way?.tags?.junction ) {
						this.#roundaboutData.isExit = true;
					}
				}
				if ( ZERO === streetOcurrences ) {
					return;
				}

				// it's the outgoing street ...saving name  and eventually the roundabout exit
				if ( isOutgoingStreet ) {
					this.#outgoingStreetName = haveName ? wayName : '???';
					streetOcurrences --;
					if ( 'roundabout' === way?.tags?.junction ) {
						this.#roundaboutData.isEntry = true;
					}
				}
				if ( ZERO === streetOcurrences || ! haveName ) {
					return;
				}

				// It's a passing street ... saving name...
				while ( ZERO !== streetOcurrences ) {
					this.#noteData.address =
						'' === this.#noteData.address ? wayName : this.#noteData.address + ' ⪥  ' + wayName; // ⪥  = ><
					streetOcurrences --;
				}
			}
		);
	}

	/**
	Adding city and hamlet to the address
	*/

	#addCity ( ) {
		if ( '' !== this.#overpassAPIDataLoader.city ) {
			this.#noteData.address +=
				' <span class="TravelNotes-NoteHtml-Address-City">' + this.#overpassAPIDataLoader.city + '</span>';
		}
		if ( this.#overpassAPIDataLoader.place && this.#overpassAPIDataLoader.place !== this.#overpassAPIDataLoader.city ) {
			this.#noteData.address += ' (' + this.#overpassAPIDataLoader.place + ')';
		}
	}

	/**
	Adding street name
	*/

	#addAddress ( ) {

		if ( ICON_POSITION.atStart === this.#computeData.positionOnRoute ) {

			// It's the start point adding a green circle to the outgoing street
			this.#noteData.address = '🟢 ' + this.#outgoingStreetName;
			this.#addCity ( );
		}
		else if ( ICON_POSITION.atEnd === this.#computeData.positionOnRoute ) {

			this.#addCity ( );

			// It's the end point adding a red circle to the incoming street
			this.#noteData.address = this.#incomingStreetName;
			this.#addCity ( );
			this.#noteData.address += ' 🔴 ';
		}
		else {

			// Adiing the incoming and outgoing streets and direction arrow
			this.#noteData.address =
				this.#incomingStreetName +
				( '' === this.#noteData.address ? '' : ' ⪥  ' + this.#noteData.address ) + // ⪥ = ><
				' ' + this.#computeData.directionArrow + ' ' +
				this.#outgoingStreetName;
			this.#addCity ( );
		}
	}

	/**
	Adding roundabout info
	*/

	#addRoundaboutInfo ( ) {
		if ( this.#roundaboutData.isEntry && ! this.#roundaboutData.isExit ) {
			this.#noteData.tooltipContent += theTranslator.getText ( 'StreetFinder - entry roundabout' );
		}
		else if ( ! this.#roundaboutData.isEntry && this.#roundaboutData.isExit ) {
			this.#noteData.tooltipContent += theTranslator.getText ( 'StreetFinder - exit roundabout' );
		}
		else if ( this.#roundaboutData.isEntry && this.#roundaboutData.isExit ) {
			this.#noteData.tooltipContent +=
				theTranslator.getText ( 'StreetFinder - continue roundabout' ); // strange but correct
		}
		if ( this.#roundaboutData.isMini ) {
			this.#noteData.tooltipContent +=
				theTranslator.getText ( 'StreetFinder - at the small roundabout on the ground' );
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Find street info: street names, city, roundabout info, rcnRef info ...
	@param {ComputeDataForMapIcon} computeData The object with the data needed for the computations
	@param {NoteDataForMapIcon} noteData The object with the nota data
	@param {OverpassAPIDataLoader} overpassAPIDataLoader The OverpassAPIDataLoader object containing the data found in OSM
	*/

	findData ( computeData, noteData, overpassAPIDataLoader ) {

		this.#computeData = computeData;
		this.#noteData = noteData;
		this.#overpassAPIDataLoader = overpassAPIDataLoader;

		this.#iconOsmNodeId = NOT_FOUND;
		this.#incomingOsmNodeId = NOT_FOUND;
		this.#outgoingOsmNodeId = NOT_FOUND;
		this.#incomingStreetName = '';
		this.#outgoingStreetName = '';
		this.#roundaboutData = new RoundaboutData ( );

		this.#findOsmNodes ( );
		this.#findMiniRoundabout ( );
		this.#addRcnRefNumber ( );
		this.#findStreets ( );
		this.#addAddress ( );
		this.#addRoundaboutInfo ( );
	}
}

export default StreetFinder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */