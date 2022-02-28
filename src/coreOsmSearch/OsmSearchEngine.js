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
	- v1.13.0:
		- Issue ♯125 : Outphase osmSearch and add it to TravelNotes
	- v2.0.0:
		- Issue ♯138 : Protect the app - control html entries done by user.
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v3.2.0:
		- Issue ♯9 : String.substr ( ) is deprecated... Replace...
Doc reviewed 20210914
Tests ...
*/

import theEventDispatcher from '../coreLib/EventDispatcher.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theConfig from '../data/Config.js';
import OverpassAPIDataLoader from '../coreLib/OverpassAPIDataLoader.js';
import theOsmSearchDictionary from '../coreOsmSearch/OsmSearchDictionary.js';
import theGeometry from '../coreLib/Geometry.js';

import { ZERO, ONE, LAT_LNG } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class search the osm data

See theOsmSearchEngine for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmSearchEngine	{

	/**
	A flag to avoid to start a new search when a search is already ongoing
	@type {Boolean}
	*/

	#searchStarted;

	/**
	A list of DictionaryItem objects used to filter the results received from Osm
	@type {Array.<DictionaryItem>}
	*/

	#filterItems;

	/**
	A leaflet LatLngBounds object with the previous search limits
	@type {LeafletObject}
	*/

	#previousSearchBounds;

	/**
	A constant with the half dimension in meter of the search area
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #SEARCH_DIMENSION ( ) { return 5000; }

	/**
	Compare the tags of the osmElement with the tags of the filterTags
	@param {OsmElement} osmElement the osmElement to compare
	@param {Array.<Object>} filterTags The filter tags to use Seee DictionaryItem.filterTagsArray
	@return {Boolean} true when all the tags present in the filterTags are present in the osmElement with the same value
	*/

	#filterOsmElement ( osmElement, filterTags ) {
		let isValidOsmElement = true;
		filterTags.forEach (
			filterTag => {
				const [ key, value ] = Object.entries ( filterTag ) [ ZERO ];
				isValidOsmElement =
					isValidOsmElement &&
					osmElement.tags [ key ] &&
					( ! value || osmElement.tags [ key ] === value );

			}
		);

		return isValidOsmElement;
	}

	/**
	Filter the osmElement with the list of selected DictionaryItems and add the osmElement to the map of pointsOfInterest
	if the osmElement pass the filter. Add also a description, a latitude and longitude to the osmElement
	@param {OsmElement} osmElement the object to analyse
	@param {Map} pointsOfInterest A map with all the retained osmElements
	*/

	#addPointOfInterest ( osmElement, pointsOfInterest ) {
		this.#filterItems.forEach (
			filterItem => {
				filterItem.filterTagsArray.forEach (
					filterTags => {
						if ( this.#filterOsmElement ( osmElement, filterTags ) ) {
							osmElement.description = filterItem.name;
							pointsOfInterest.set ( osmElement.id, osmElement );
						}
					}
				);
			}
		);
	}

	/**
	Build an array of queries for calls to OSM.
	@return {Array.<String>} An array of string to use with OverpassAPIDataLoader
	*/

	#getSearchQueries ( ) {
		const searchQueries = [];
		const keysMap = new Map ( );

		this.#filterItems.forEach (
			filterItem => {
				filterItem.filterTagsArray.forEach (
					filterTags => {

						const [ key, value ] = Object.entries ( filterTags [ ZERO ] ) [ ZERO ];
						let valuesElements = keysMap.get ( key );
						if ( ! valuesElements ) {
							valuesElements = { values : new Map ( ), elements : new Map ( ) };
							keysMap.set ( key, valuesElements );
						}
						valuesElements.values.set ( value, value );
						filterItem.elementTypes.forEach (
							elementType => {
								valuesElements.elements.set ( elementType, elementType );
							}
						);
					}
				);
			}
		);

		const searchBounds = this.#computeSearchBounds ( );
		this.#previousSearchBounds = searchBounds;
		const searchBoundingBoxString = '(' +
			searchBounds.getSouthWest ( ).lat.toFixed ( LAT_LNG.fixed ) +
			',' +
			searchBounds.getSouthWest ( ).lng.toFixed ( LAT_LNG.fixed ) +
			',' +
			searchBounds.getNorthEast ( ).lat.toFixed ( LAT_LNG.fixed ) +
			',' +
			searchBounds.getNorthEast ( ).lng.toFixed ( LAT_LNG.fixed ) +
			')';

		keysMap.forEach (
			( valuesElements, key ) => {
				let queryTag = '"' + key + '"';
				if ( ONE === valuesElements.values.size ) {
					const value = valuesElements.values.values ( ).next ( ).value;
					if ( value ) {
						queryTag += '="' + value + '"';
					}
				}
				else if ( ONE < valuesElements.values.size ) {
					queryTag += '~"';
					valuesElements.values.forEach (
						value => {
							queryTag += value + '|';
						}
					);
					queryTag = queryTag.substring ( ZERO, queryTag.length - ONE ) + '"';
				}

				// This modification due to slow response from https://lz4.overpass-api.de/api/interpreter
				// Some overpass API servers don't know nwr...

				if ( theConfig.overpassApi.useNwr ) {
					const queryElement =
						ONE === valuesElements.elements.size ? valuesElements.elements.values ( ).next ( ).value : 'nwr';

					searchQueries.push (
						queryElement + '[' + queryTag + ']' + searchBoundingBoxString + ';' +
						( 'node' === queryElement ? '' : '(._;>;);' ) + 'out;'
					);
				}
				else {
					let queryElements = [];
					if ( ONE === valuesElements.elements.size ) {
						queryElements .push ( valuesElements.elements.values ( ).next ( ).value );
					}
					else {
						queryElements = [ 'node', 'way', 'rel' ];
					}
					queryElements.forEach (
						queryElement => {
							searchQueries.push (
								queryElement + '[' + queryTag + ']' + searchBoundingBoxString + ';' +
								( 'node' === queryElement ? '' : '(._;>;);' ) + 'out;'
							);
						}
					);
				}
			}
		);

		return searchQueries;
	}

	/**
	Search all selected items on the tree dictionary and for each selected item, add it to a list of selected items
	and add the first tag to the root tags map.
	@param {DictionaryItem} item The item from witch the search start. Recursive function. The first
	call start with this.#dictionary
	*/

	#searchFilterItems ( item ) {
		if ( item.isSelected && ( ZERO < item.filterTagsArray.length ) ) {
			this.#filterItems.push ( item );
		}
		item.items.forEach ( nextItem => this.#searchFilterItems ( nextItem ) );
	}

	/**
	Compute the search bounds
	*/

	#computeSearchBounds ( ) {
		const mapCenter = theTravelNotesData.map.getCenter ( );
		const searchBounds = theTravelNotesData.map.getBounds ( );
		const maxBounds = theGeometry.getSquareBoundingBox (
			[ mapCenter.lat, mapCenter.lng ],
			OsmSearchEngine.#SEARCH_DIMENSION
		);
		searchBounds.getSouthWest ( ).lat =
			Math.max ( searchBounds.getSouthWest ( ).lat, maxBounds.getSouthWest ( ).lat );
		searchBounds.getSouthWest ( ).lng =
			Math.max ( searchBounds.getSouthWest ( ).lng, maxBounds.getSouthWest ( ).lng );
		searchBounds.getNorthEast ( ).lat =
			Math.min ( searchBounds.getNorthEast ( ).lat, maxBounds.getNorthEast ( ).lat );
		searchBounds.getNorthEast ( ).lng =
			Math.min ( searchBounds.getNorthEast ( ).lng, maxBounds.getNorthEast ( ).lng );

		return searchBounds;
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#searchStarted = false;
		this.#filterItems = [];
		this.#previousSearchBounds = null;
	}

	/**
	Start a search into osm for the items selected in the dictionary
	*/

	async search ( ) {
		if ( this.#searchStarted ) {
			return;
		}
		this.#searchStarted = true;
		this.#filterItems = [];
		this.#searchFilterItems ( theOsmSearchDictionary.dictionary );
		const dataLoader = new OverpassAPIDataLoader ( { searchPlaces : false } );
		await dataLoader.loadData ( this.#getSearchQueries ( ) );
		const pointsOfInterest = new Map ( );

		[ dataLoader.nodes, dataLoader.ways, dataLoader.relations ]. forEach (
			elementsMap => {
				elementsMap.forEach (
					osmElement => {
						if ( osmElement.tags ) {
							this.#addPointOfInterest ( osmElement, pointsOfInterest );
						}
					}
				);
			}
		);
		theTravelNotesData.searchData.length = ZERO;
		Array.from ( pointsOfInterest.values ( ) ).sort (
			( obj1, obj2 ) => obj1.description > obj2.description
		)
			.forEach ( poi => theTravelNotesData.searchData.push ( poi ) );
		this.#searchStarted = false;
		theEventDispatcher.dispatch ( 'showsearch' );
	}

	/**
	A leaflet LatLngBounds object with the current search limits
	@type {LeafletObject}
	*/

	get searchBounds ( ) { return this.#computeSearchBounds ( ); }

	/**
	A leaflet LatLngBounds object with the previous search limits
	@type {LeafletObject}
	*/

	get previousSearchBounds ( ) { return this.#previousSearchBounds; }

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of OsmSearchEngine class
@type {OsmSearchEngine}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theOsmSearchEngine = new OsmSearchEngine ( );

export default theOsmSearchEngine;

/* --- End of file --------------------------------------------------------------------------------------------------------- */