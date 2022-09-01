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
		- created
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
		- Issue ♯68 : Review all existing promises.
	- v2.0.0:
		- Issue ♯135 : Remove innerHTML from code
		- Issue ♯136 : Remove html entities from js string
		- Issue ♯138 : Protect the app - control html entries done by user.
		- Issue ♯145 : Merge svg icon and knoopunt icon
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import theConfig from '../data/Config.js';
import theSphericalTrigonometry from '../coreLib/SphericalTrigonometry.js';
import SvgBuilder from '../coreMapIcon/SvgBuilder.js';
import OverpassAPIDataLoader from '../coreLib/OverpassAPIDataLoader.js';
import StreetFinder from '../coreMapIcon/StreetFinder.js';
import ArrowAndTooltipFinder from '../coreMapIcon/ArrowAndTooltipFinder.js';
import TranslationRotationFinder from '../coreMapIcon/TranslationRotationFinder.js';

import { ICON_POSITION, ICON_DIMENSIONS, LAT_LNG, INVALID_OBJ_ID, ZERO, ONE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
An object with data used to build the Note
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDataForMapIcon {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}

	/**
	The icon content ( = the outerHTML of the SVG with streets itinerary and rcnRef number )
	@type {String}
	*/

	iconContent = '';

	/**
	The tooltip ( = the direction to follow + indications on roundabout, rcnRef and start point or end point )
	@type {String}
	*/

	tooltipContent = '';

	/**
	The address ( = streets names at the note position and city and hamlet )
	@type {String}
	*/

	address = '';

	/**
	The lat and lng of the note
	@type {Array.<Number>}
	*/

	latLng = [ LAT_LNG.defaultValue, LAT_LNG.defaultValue ];
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
An object with data shared between the differents objects that are building the note ( TranslationRotationFinder,
ArrowAndTooltipFinder, StreetFinder and SvgBuilder )
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ComputeDataForMapIcon {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}

	/**
	The objId of the nearest itinerary point
	@type {Number}
	*/

	nearestItineraryPointObjId = INVALID_OBJ_ID;

	/**
	the route for witch the note will be created
	@type {Route}
	*/

	route = null;

	/**
	The position on the Route. Must be a property of the ICON_POSITION enum
	@type {Number}
	*/

	positionOnRoute = ICON_POSITION.onRoute;

	/**
	The direction to follow ( = the angle of the outgoing street after the rotation of the svg icon )
	@type {String}
	*/

	direction = null;

	/**
	The arrow to display in the address
	@type {String}
	*/

	directionArrow = ' ';

	/**
	The rcnRef number for bike ( when a bike network exists near the note position )
	@type {String}
	*/

	rcnRef = '';

	/**
	The rotation of the svg icon needed to have the incoming street oriented from the bottom of the icon
	@type {Number}
	*/

	rotation = ZERO;

	/**
	The translation needed to have the note position at the center of the svg icon ( = the translation in
	pixel from the map origin.)
	@type {Array.<Number>}
	*/

	translation = [ ZERO, ZERO ];
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is used to create  an svg icon for a route note
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapIconFromOsmFactory {

	/**
	The NoteDataForMapIcon object needed to buid the note
	@type {NoteDataForMapIcon}
	*/

	#noteData;

	/**
	The ComputeData object needed to buid the note
	@type {ComputeDataForMapIcon}
	*/

	#computeData;

	/**
	An OverpassAPIDataLoader object used to search the osm data
	@type {OverpassAPIDataLoader}
	*/

	#overpassAPIDataLoader;

	/**
	The distance used to search cities and hamlet in osm
	@type {Number}
	*/

	#queryDistance;

	/**
	A guard to avoid to mutch requests at the same time
	@type {Boolean}
	*/

	#requestStarted;

	/**
	A constant used for searching the OSM data
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #SEARCH_AROUND_FACTOR ( ) { return 1.5; }

	/**
	This method search the nearest itinerary point from the point given by the user
	*/

	#searchNearestItineraryPoint ( ) {

		let nearestItineraryPoint = null;

		// Searching the nearest itinerary point
		let minDistance = Number.MAX_VALUE;

		// Iteration on the points...
		this.#computeData.route.itinerary.itineraryPoints.forEach (
			itineraryPoint => {
				const itineraryPointDistance =
					theSphericalTrigonometry.pointsDistance ( this.#noteData.latLng, itineraryPoint.latLng );
				if ( minDistance > itineraryPointDistance ) {
					minDistance = itineraryPointDistance;
					nearestItineraryPoint = itineraryPoint;
				}
			}
		);

		// The coordinates of the nearest point are used as position of the SVG
		this.#noteData.latLng = nearestItineraryPoint.latLng;
		this.#computeData.nearestItineraryPointObjId = nearestItineraryPoint.objId;
	}

	/**
	Search and build all the needed data
	*/

	#buildIconAndAdress ( ) {

		// calling the different objects used to build the note ...
		new TranslationRotationFinder ( ).findData ( this.#computeData, this.#noteData );
		new ArrowAndTooltipFinder ( ).findData ( this.#computeData, this.#noteData );
		new StreetFinder ( ).findData ( this.#computeData, this.#noteData, this.#overpassAPIDataLoader );
		new SvgBuilder ( ).buildSvg ( this.#computeData, this.#noteData, this.#overpassAPIDataLoader	);

		this.#requestStarted = false;

		// returning the results
		return this.#noteData;
	}

	/**
	Start the buid of the note data
	*/

	async #exeGetIconAndAdress ( ) {
		if ( this.#requestStarted ) {

			// Return when another request is already running
			return null;
		}

		this.#requestStarted = true;

		// ComputeData and NoteData initialization
		// !!! ComputeData.route contains already the route
		// !!! NoteData.latLng contains already the note position
		this.#computeData.nearestItineraryPointObjId = INVALID_OBJ_ID;
		this.#computeData.positionOnRoute = ICON_POSITION.onRoute;
		this.#computeData.direction = null;
		this.#computeData.directionArrow = ' ';
		this.#computeData.translation = [ ZERO, ZERO ];
		this.#computeData.rotation = ZERO;
		this.#computeData.rcnRef = '';

		this.#noteData.iconContent = '';
		this.#noteData.tooltipContent = '';
		this.#noteData.address = '';

		// Moving the the nearest itinerary point
		this.#searchNearestItineraryPoint ( );

		// Starting the query to osm. Searching highways, administrative boundaries and places around the note
		/*
		Sample of query:
			way[highway](around:300,50.489312,5.501035)->.a;(.a >;.a;)->.a;.a out;
			is_in(50.644242,5.572354)->.e;area.e[admin_level][boundary="administrative"];out;
			node(around:1500,50.644242,5.572354)[place];out;
		*/

		const queryLatLng =
			this.#noteData.latLng [ ZERO ].toFixed ( LAT_LNG.fixed ) +
			',' +
			this.#noteData.latLng [ ONE ].toFixed ( LAT_LNG.fixed );

		const queries = [
			'way[highway](around:' +
			( ICON_DIMENSIONS.svgViewboxDim * MapIconFromOsmFactory.#SEARCH_AROUND_FACTOR ).toFixed ( ZERO ) +
			',' + queryLatLng + ')->.a;(.a >;.a;)->.a;.a out;' +
			'is_in(' + queryLatLng + ')->.e;area.e[admin_level][boundary="administrative"];out;' +
			'node(around:' + this.#queryDistance + ',' + queryLatLng + ')[place];out;'
		];

		await this.#overpassAPIDataLoader.loadData ( queries, this.#noteData.latLng );
		if ( this.#overpassAPIDataLoader.statusOk ) {
			return this.#buildIconAndAdress ( );
		}
		return null;
	}

	/**
	The method used to buid the icon with a Promise
	@param {function} onOk The onOk handler of the Promise
	@param {function} onError The onError handler of the Promise
	*/

	async #exeGetIconAndAdressWithPromise ( onOk, onError ) {
		const result = await this.#exeGetIconAndAdress ( );

		if ( result ) {
			onOk ( result );
		}
		else {
			onError ( 'An error occurs...' );
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#noteData = new NoteDataForMapIcon ( );
		this.#computeData = new ComputeDataForMapIcon ( );
		this.#overpassAPIDataLoader = new OverpassAPIDataLoader ( { searchRelations : false, setGeometry : false } );
		this.#queryDistance = Math.max (
			theConfig.geoCoder.distances.hamlet,
			theConfig.geoCoder.distances.village,
			theConfig.geoCoder.distances.city,
			theConfig.geoCoder.distances.town
		);
		this.#requestStarted = false;
	}

	/**
	get the svg and the data needed for creating the icon, using an async function
	@param {Array.<Number>} iconLatLng The latitude and longitude of the icon
	@param {!Route} route The route to witch the icon will be attached.
	@return {?NoteDataForMapIcon} An object with the note data
	*/

	async getIconAndAdressAsync ( iconLatLng, route ) {
		this.#noteData.latLng = iconLatLng;
		this.#computeData.route = route;

		return this.#exeGetIconAndAdress ( );
	}

	/**
	get the svg and the data needed for creating the icon, using a promise
	@param {MapIconData} mapIconData An object with the latLng of the note and a reference to the
	Route for witch the icon is build
	@return {Promise} A Promise fullfilled with the svg data
	*/

	getIconAndAdressWithPromise ( mapIconData ) {
		this.#noteData.latLng = mapIconData.latLng;
		this.#computeData.route = mapIconData.route;

		return new Promise ( ( onOk, onError ) => this.#exeGetIconAndAdressWithPromise ( onOk, onError ) );
	}

}

export default MapIconFromOsmFactory;

/* --- End of file --------------------------------------------------------------------------------------------------------- */