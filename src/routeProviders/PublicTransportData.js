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
Doc reviewed 20210915
*/

import theSphericalTrigonometry from '../coreLib/SphericalTrigonometry.js';

import { ZERO, INVALID_OBJ_ID, ONE, TWO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
coming soon...
@ignore
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PublicTransportData {

	#newId;
	#selectedRelationId;
	#waysMap;
	#nodesMap;
	#stopsMap;
	#nodes3WaysCounter;

	/**
	The constructor
	*/

	constructor ( selectedRelationId ) {
		Object.freeze ( this );
		this.#newId = INVALID_OBJ_ID;
		this.#selectedRelationId = selectedRelationId;
		this.#waysMap = new Map ( );
		this.#nodesMap = new Map ( );
		this.#stopsMap = new Map ( );
		this.#nodes3WaysCounter = ZERO;
	}

	get nodes3WaysCounter ( ) { return this.#nodes3WaysCounter; }
	set nodes3WaysCounter ( nodes3WaysCounter ) { this.#nodes3WaysCounter = nodes3WaysCounter; }

	get waysMap ( ) { return this.#waysMap; }
	get nodesMap ( ) { return this.#nodesMap; }
	get stopsMap ( ) { return this.#stopsMap; }
	get newId ( ) { return this.#newId --; }

	/**
	*/

	firstOf ( array ) {
		return array [ ZERO ];
	}

	/**
	*/

	lastOf ( array ) {
		return array [ array.length - ONE ];
	}

	/**
	*/

	removeFrom ( array, value ) {
		array.splice ( array.indexOf ( value ), ONE );
	}

	/**
	*/

	#reverseWay ( way ) {

		const oldStartNode = this.#nodesMap.get ( this.firstOf ( way.nodesIds ) );
		const oldEndNode = this.#nodesMap.get ( this.lastOf ( way.nodesIds ) );

		this.removeFrom ( oldStartNode.startingWaysIds, way.id );
		oldStartNode.endingWaysIds.push ( way.id );

		this.removeFrom ( oldEndNode.endingWaysIds, way.id );
		oldEndNode.startingWaysIds.push ( way.id );

		way.nodesIds.reverse ( );

	}

	/**
	*/

	mergeWays ( waysId1, waysId2 ) {

		const way1 = this.#waysMap.get ( waysId1 );
		const way2 = this.#waysMap.get ( waysId2 );

		// reversing some ways, so :
		// - the 2 ways have the same direction
		// - the starting node of the merged way is the starting node of way1
		// - the ending node of the merged way is the ending node of way2
		// - the removed node is the ending node of way1

		if ( this.lastOf ( way1.nodesIds ) === this.lastOf ( way2.nodesIds ) ) {
			this.#reverseWay ( way2 );
		}
		else if ( this.firstOf ( way1.nodesIds ) === this.firstOf ( way2.nodesIds ) ) {
			this.#reverseWay ( way1 );
		}
		else if ( this.firstOf ( way1.nodesIds ) === this.lastOf ( way2.nodesIds ) ) {
			this.#reverseWay ( way1 );
			this.#reverseWay ( way2 );

		}

		// removing the node at the merging node and all the starting or ending ways of the node
		const mergedNode = this.#nodesMap.get ( way1.nodesIds.pop ( ) );
		mergedNode.startingWaysIds = [];
		mergedNode.endingWaysIds = [];

		// and then merging the 2 ways
		way1.nodesIds = way1.nodesIds.concat ( way2.nodesIds );
		way1.distance += way2.distance;

		// and changing the ending ways in the last node
		const endNode = this.#nodesMap.get ( this.lastOf ( way1.nodesIds ) );
		this.removeFrom ( endNode.endingWaysIds, way2.id );
		endNode.endingWaysIds.push ( way1.id );

		// finally we remove the second way from the ways map
		this.#waysMap.delete ( way2.id );

		return way1.id;
	}

	/**
	*/

	#cloneNode ( nodeId ) {

		const node = this.#nodesMap.get ( nodeId );

		const clonedNode = {
			id : this.newId,
			lat : node.lat,
			lon : node.lon,
			type : 'node',
			startingWaysIds : [],
			endingWaysIds : [],
			isNode3Ways : node.isNode3Ways
		};

		this.#nodesMap.set ( clonedNode.id, clonedNode );

		return clonedNode.id;
	}

	/**
	*/

	cloneWay ( wayId ) {

		const way = this.#waysMap.get ( wayId );

		const clonedWay = {
			id : this.newId,
			type : 'way',
			nodesIds : [],
			distance : way.distance
		};

		way.nodesIds.forEach ( nodeId => clonedWay.nodesIds.push ( this.#cloneNode ( nodeId ) ) );

		this.#nodesMap.get ( this.firstOf ( clonedWay.nodesIds ) ).startingWaysIds.push ( clonedWay.id );
		this.#nodesMap.get ( this.lastOf ( clonedWay.nodesIds ) ).endingWaysIds.push ( clonedWay.id );

		this.#waysMap.set ( clonedWay.id, clonedWay );

		return clonedWay.id;
	}

	/**
	*/

	createMaps ( elements ) {

		this.#waysMap.clear ( );
		this.#nodesMap.clear ( );
		this.#stopsMap.clear ( );

		// Elements are pushed in 2 maps: 1 for nodes and 1 for ways
		elements.forEach (
			element => {
				switch ( element.type ) {
				case 'way' :

					// replacing the nodes property with the nodesId property to
					// avoid confusion between nodes and nodesId. the element.nodes contains nodesIds!!
					element.nodesIds = element.nodes;
					delete element.nodes;
					if ( TWO <= element.nodesIds.length ) {
						element.distance = ZERO;
						this.#waysMap.set ( element.id, element );
					}
					break;
				case 'node' :
					element.startingWaysIds = [];
					element.endingWaysIds = [];
					element.isNode3Ways = false;
					this.#nodesMap.set ( element.id, element );
					break;
				case 'relation' :
					element.members.forEach (
						member => {

							// extracting all nodes with role 'stop'
							if ( 'node' === member.type && member.role && 'stop' === member.role ) {
								this.#stopsMap.set ( member.ref, member.ref );
							}
						}
					);
					break;
				default :
					break;
				}
			}
		);

		// The stop map contain only the nodeId
		// we replace the nodeId with the node when possible
		this.#stopsMap.forEach (
			nodeId => {
				const node = this.#nodesMap.get ( nodeId );
				if ( node ) {
					this.#stopsMap.set ( nodeId, node );
				}
				else {
					window.TaN.showInfo (
						'the relation ' +
						this.#selectedRelationId +
						' have nodes not positionned on the railway ( node ' +
						nodeId +
						').' );
					this.#stopsMap.delete ( nodeId );
				}
			}
		);

		// Starting and ending ways are added to each node and length computed
		this.#waysMap.forEach (
			way => {
				this.#nodesMap.get ( this.firstOf ( way.nodesIds ) ).startingWaysIds.push ( way.id );
				this.#nodesMap.get ( this.lastOf ( way.nodesIds ) ).endingWaysIds.push ( way.id );
				let previousNode = null;
				way.nodesIds.forEach (
					nodeId => {
						const node = this.#nodesMap.get ( nodeId );
						if ( previousNode ) {
							way.distance += theSphericalTrigonometry.pointsDistance (
								[ node.lat, node.lon ], [ previousNode.lat, previousNode.lon ]
							);
						}
						previousNode = node;
					}
				);
			}
		);
	}
}

export default PublicTransportData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */