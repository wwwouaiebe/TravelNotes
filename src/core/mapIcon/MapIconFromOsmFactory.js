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

import theConfig from '../../data/Config.js';
import theSphericalTrigonometry from '../../core/lib/SphericalTrigonometry.js';
import SvgBuilder from './SvgBuilder.js';
import OverpassAPIDataLoader from '../../core/lib/OverpassAPIDataLoader.js';
import StreetFinder from './StreetFinder.js';
import ArrowAndTooltipFinder from './ArrowAndTooltipFinder.js';
import TranslationRotationFinder from './TranslationRotationFinder.js';
import NoteDataForMapIcon from './NoteDataForMapIcon.js';
import ComputeDataForMapIcon from './ComputeDataForMapIcon.js';

import { ICON_POSITION, ICON_DIMENSIONS, LAT_LNG, INVALID_OBJ_ID, ZERO, ONE } from '../../main/Constants.js';

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