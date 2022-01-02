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

import { ZERO, TWO, LAT_LNG, HTTP_STATUS_OK, OSM_COUNTRY_ADMIN_LEVEL } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
An object to store the options for the OverpassAPIDataLoader
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OverpassAPIDataLoaderOptions {

	/**
	A flag indicating that the OSM places have to be searched
	@type {Boolean}
	*/

	searchPlaces = true;

	/**
	A flag indicating that the OSM ways have to be searched
	@type {Boolean}
	*/

	searchWays = true;

	/**
	A flag indicating that the OSM relations have to be searched
	@type {Boolean}
	*/

	searchRelations = true;

	/**
	A flag indicating that the geometry for ways and relations have to be searched
	@type {Boolean}
	*/

	setGeometry = true;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is used to search osm data with the OverpassAPI
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OverpassAPIDataLoader {

	/**
	The options for the OverpassAPIDataLoader
	@type {OverpassAPIDataLoaderOptions}
	*/

	#options;

	/**
	A map with the osm nodes found by the API, ordered by id
	@type {Map.>OsmElement}
	*/

	#nodes;

	/**
	A map with the osm ways found by the API, ordered by id
	@type {Map.>OsmElement}
	*/

	#ways;

	/**
	A map with the osm relations found by the API, ordered by id
	@type {Map.>OsmElement}
	*/

	#relations;

	/**
	A list with the administrative names found by the API
	@type {Array.<String>}
	*/

	#adminNames;

	/**
	The Admin level at witch the cities are placed in OSM (Is country dependant...)
	@type {Number}
	*/

	#osmCityAdminLevel;

	/**
	an Object with hamlet, village, city and town properties.
	Each properties are objects with name, distance and maxDistance properties.
	@type {Object}
	*/

	#places;

	/**
	A reference to the latitude and longitude used in the queries
	@type {Array.<Number>}
	*/

	#latLng;

	/**
	A hamlet, village, city or town name found in the OSM data
	@type {?String}
	*/

	#place;

	/**
	The city name found in the OSM data
	@type {?String}
	*/

	#city;

	/**
	A flag indicating the success or failure of the request
	@type {Boolean}
	*/

	#statusOk;

	/**
	This method add the geometry to the osm elements
	*/

	#setGeometry ( ) {
		this.#ways.forEach (
			way => {
				way.geometry = [ [ ] ];
				way.lat = LAT_LNG.defaultValue;
				way.lon = LAT_LNG.defaultValue;
				let nodesCounter = ZERO;
				way.nodes.forEach (
					nodeId => {
						const node = this.#nodes.get ( nodeId );
						way.geometry [ ZERO ].push ( [ node.lat, node.lon ] );
						way.lat += node.lat;
						way.lon += node.lon;
						nodesCounter ++;
					}
				);
				if ( ZERO !== nodesCounter ) {
					way.lat /= nodesCounter;
					way.lon /= nodesCounter;
				}
			}
		);
		this.#relations.forEach (
			relation => {
				relation.geometry = [ [ ] ];
				relation.lat = LAT_LNG.defaultValue;
				relation.lon = LAT_LNG.defaultValue;
				let membersCounter = ZERO;
				relation.members.forEach (
					member => {
						if ( 'way' === member.type ) {
							const way = this.#ways.get ( member.ref );
							relation.geometry.push ( way.geometry [ ZERO ] );
							relation.lat += way.lat;
							relation.lon += way.lon;
							membersCounter ++;
						}
					}
				);
				if ( ZERO !== membersCounter ) {
					relation.lat /= membersCounter;
					relation.lon /= membersCounter;
				}
			}
		);
	}

	/**
	this method parse the osm elements received from the OverpassAPI
	@param {Array.<Object>} osmElements The osm elements received in the request.
	*/

	#parseData ( osmElements ) {
		osmElements.forEach (
			osmElement => {
				switch ( osmElement.type ) {
				case 'node' :
					this.#nodes.set ( osmElement.id, osmElement );
					if (
						osmElement?.tags?.place &&
						this.#options.searchPlaces &&
						this.#places [ osmElement.tags.place ] &&
						osmElement?.tags?.name
					) {
						const nodeDistance = theSphericalTrigonometry.pointsDistance (
							this.#latLng,
							[ osmElement.lat, osmElement.lon ]
						);
						const place = this.#places [ osmElement.tags.place ];
						if ( place.maxDistance > nodeDistance && place.distance > nodeDistance ) {
							place.distance = nodeDistance;
							place.name = osmElement.tags.name;
						}
					}
					break;
				case 'way' :
					if ( this.#options.searchWays ) {
						this.#ways.set ( osmElement.id, osmElement );
					}
					break;
				case 'relation' :
					if ( this.#options.searchRelations ) {
						this.#relations.set ( osmElement.id, osmElement );
					}
					break;
				case 'area' :
					if ( this.#options.searchPlaces ) {
						let elementName = osmElement.tags.name;
						if (
							'*' !== theConfig.nominatim.language &&
							osmElement.tags [ 'name:' + theConfig.nominatim.language ]
						) {
							elementName = osmElement.tags [ 'name:' + theConfig.nominatim.language ];
						}
						this.#adminNames [ Number.parseInt ( osmElement.tags.admin_level ) ] = elementName;
						if ( OSM_COUNTRY_ADMIN_LEVEL === osmElement.tags.admin_level ) {
							this.#osmCityAdminLevel =
								theConfig.geoCoder.osmCityAdminLevel [ osmElement.tags [ 'ISO3166-1' ] ]
								||
								this.#osmCityAdminLevel;
						}
					}
					break;
				default :
					break;
				}
			}
		);

		if ( this.#options.setGeometry ) {
			this.#setGeometry ( );
		}

		if ( this.#options.searchPlaces ) {
			this.#setPlaceAndCity ( );
		}

	}

	/**
	this method search the city and place name from the osm elements
	*/

	#setPlaceAndCity ( ) {
		let adminHamlet = null;

		for ( let namesCounter = TWO; namesCounter < this.#adminNames.length; namesCounter ++ ) {
			if ( 'undefined' !== typeof ( this.#adminNames [ namesCounter ] ) ) {
				if ( this.#osmCityAdminLevel >= namesCounter ) {
					this.#city = this.#adminNames [ namesCounter ];
				}
				else {
					adminHamlet = this.#adminNames [ namesCounter ];
				}
			}
		}
		let placeDistance = Number.MAX_VALUE;

		Object.values ( this.#places ).forEach (
			place => {
				if ( place.distance < placeDistance ) {
					placeDistance = place.distance;
					this.#place = place.name;
				}
			}
		);

		this.#place = adminHamlet || this.#place;
		if ( this.#place === this.#city ) {
			this.#place = null;
		}
	}

	/**
	This method parse the responses from the OverpassAPI
	@param {Array.<Object>} results the results received from fetch
	*/

	async #parseSearchResults ( results ) {
		for ( let counter = ZERO; counter < results.length; counter ++ ) {
			if (
				'fulfilled' === results[ counter ].status
				&&
				HTTP_STATUS_OK === results[ counter ].value.status
				&&
				results[ counter ].value.ok
			) {
				const response = await results[ counter ].value.json ( );
				this.#parseData ( response.elements );
			}
			else {
				this.#statusOk = false;
				console.error ( 'An error occurs when calling theOverpassAPI: ' );
				console.error ( results[ counter ] );
			}
		}
	}

	/**
	The constructor
	@param {OverpassAPIDataLoaderOptions} options An object with the options to set
	*/

	constructor ( options ) {
		Object.freeze ( this );
		this.#options = new OverpassAPIDataLoaderOptions ( );
		if ( options ) {
			for ( const [ key, value ] of Object.entries ( options ) ) {
				if ( this.#options [ key ] ) {
					this.#options [ key ] = value;
				}
			}
		}
		this.#nodes = new Map ( );
		this.#ways = new Map ( );
		this.#relations = new Map ( );
	}

	/**
	This method launch the queries in the OverpassAPI and parse the received data
	@param {Array.<String>} queries An array of queries to be executed in the OverpassAPI
	@param {Array.<Number>} latLng The latitude and longitude used in the queries
	*/

	async loadData ( queries, latLng ) {
		this.#latLng = latLng;
		this.#statusOk = true;
		this.#adminNames = [];
		this.#osmCityAdminLevel = theConfig.geoCoder.osmCityAdminLevel.DEFAULT;// myOsmCityAdminLevel
		this.#places = Object.freeze (
			{
				hamlet : Object.seal (
					{
						name : null,
						distance : Number.MAX_VALUE,
						maxDistance : theConfig.geoCoder.distances.hamlet
					}
				),
				village : Object.seal (
					{
						name : null,
						distance : Number.MAX_VALUE,
						maxDistance : theConfig.geoCoder.distances.village
					}
				),
				city : Object.seal (
					{
						name : null,
						distance : Number.MAX_VALUE,
						maxDistance : theConfig.geoCoder.distances.city
					}
				),
				town : Object.seal (
					{
						name : null,
						distance : Number.MAX_VALUE,
						maxDistance : theConfig.geoCoder.distances.town
					}
				)
			}
		);

		this.#place = null;
		this.#city = null;

		this.#nodes.clear ( );
		this.#ways.clear ( );
		this.#relations.clear ( );

		const promises = [];
		queries.forEach ( query => {
			promises.push (
				fetch ( theConfig.overpassApi.url +
						'?data=[out:json][timeout:' + theConfig.overpassApi.timeOut + '];' +
						query )
			);
		}
		);

		await Promise.allSettled ( promises ).then ( results => this.#parseSearchResults ( results ) );
	}

	/**
	A map with the osm nodes
	@type {Map}
	*/

	get nodes ( ) { return this.#nodes; }

	/**
	A map with the osm ways
	@type {Map}
	*/

	get ways ( ) { return this.#ways; }

	/**
	A map with the osm relations
	@type {Map}
	*/

	get relations ( ) { return this.#relations; }

	/**
	The osm place ( hamlet or village )
	@type {String}
	*/

	get place ( ) { return this.#place; }

	/**
	The osm city
	@type {String}
	*/

	get city ( ) { return this.#city; }

	/**
	The osm country
	@type {String}
	*/

	get country ( ) { return this.#adminNames [ OSM_COUNTRY_ADMIN_LEVEL ]; }

	/**
	The final status
	@type {Boolean}
	*/

	get statusOk ( ) { return this.#statusOk; }
}

export default OverpassAPIDataLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */