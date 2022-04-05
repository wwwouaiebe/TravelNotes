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
	- v3.2.0:
		- Issue ♯4 : Line type and line width for routes are not adapted on the print views
	- v3.4.0:
		- Issue ♯24 : Review the print process
Doc reviewed 20210915
Tests ...
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theConfig from '../data/Config.js';
import theTranslator from '../UILib/Translator.js';
import theMapLayersCollection from '../data/MapLayersCollection.js';
import theAPIKeysManager from '../core/APIKeysManager.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';

import { ZERO, TWO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the print button
@hideconstructor
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PrintEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	*/

	handleEvent ( ) {
		window.print ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
afterprint event listener for the document and the cancel button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class AfterPrintEL {

	/**
	A reference to the printPageBuilder Object
	@type {PrintPageBuilder}
	*/

	#printPageBuilder = null;

	/**
	The constructor
	@param {PrintPageBuilder} printPageBuilder A reference to the printPageBuilder Object
	*/

	constructor ( printPageBuilder ) {
		Object.freeze ( this );
		this.#printPageBuilder = printPageBuilder;
	}

	/**
	Event listener method
	*/

	handleEvent ( ) {
		this.#printPageBuilder.onAfterPrint ( );
		this.#printPageBuilder = null;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Build the html page for print
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PrintPageBuilder {

	/**
	A reference to the PrintRouteMapOptions object containing the user choices
	@type {PrintRouteMapOptions}
	*/

	#printRouteMapOptions;

	/**
	A reference to the printed route
	@type {Route}
	*/

	#route;

	/**
	A reference to the views to print
	@type {Array.<PrintView>}
	*/

	#printViews;

	/**
	The toolbar on right top of the screen
	@type {HTMLElement}
	*/

	#printToolbar;

	/**
	The print button on the toolbar
	@type {HTMLElement}
	*/

	#printButton;

	/**
	The cancel button on the toolbar
	@type {HTMLElement}
	*/

	#cancelButton;

	/**
	A counter for the views, so we can gives a unique id to the views
	@type {Number}
	*/

	#viewsCounter;

	/**
	An array with the HTML views
	@type {Array.<HTMLElement>}
	*/

	#viewsDiv;

	/**
	A leaflet.polyline used to represent the route on the maps
	@type {LeafletObject}
	*/

	#routePolyline;

	/**
	Event listener for the print button
	@type {PrintEL}
	*/

	#printEL;

	/**
	Event listener for the cancel button and the document. Reset the document in the correct state
	@type {AfterPrintEL}
	*/

	#afterPrintEL;

	/**
	Remove the print views and restore the map and user interface after printing
	*/

	onAfterPrint ( ) {

		// removing the views
		this.#viewsDiv.forEach ( viewDiv => document.body.removeChild ( viewDiv ) );
		this.#viewsDiv.length = ZERO;

		// removing the toolbar
		this.#printButton.removeEventListener (	'click', this.#printEL, false );
		this.#cancelButton.removeEventListener ( 'click', this.#afterPrintEL, false );
		document.body.removeChild ( this.#printToolbar );

		// shwing the hidden HTMLElements
		const childrens = document.body.children;
		for ( let counter = 0; counter < childrens.length; counter ++ ) {
			childrens.item ( counter ).classList.remove ( 'TravelNotes-Hidden' );
		}

		// reset the map
		theTravelNotesData.map.invalidateSize ( false );

		// reset the document title
		document.title =
			'Travel & Notes' +
			( '' === theTravelNotesData.travel.name ? '' : ' - ' + theTravelNotesData.travel.name );

		// removing event listeners
		window.removeEventListener ( 'afterprint', this.#afterPrintEL, true );
		this.#afterPrintEL = null;
		this.#printEL = null;
	}

	/**
	Creates a leaflet layer with the same map that the main map
	*/

	#getMapLayer ( ) {
		const mapLayer = theMapLayersCollection.getMapLayer ( theTravelNotesData.travel.layerName );
		const url = theAPIKeysManager.getUrl ( mapLayer );
		const leafletLayer =
			'wmts' === mapLayer.service.toLowerCase ( )
				?
				window.L.tileLayer ( url )
				:
				window.L.tileLayer.wms ( url, mapLayer.wmsOptions );

		leafletLayer.options.attribution = theHTMLSanitizer.sanitizeToHtmlString (
			' © <a href="https://www.openstreetmap.org/copyright" target="_blank" ' +
			'title="OpenStreetMap contributors">OpenStreetMap contributors</a> ' +
			mapLayer.attribution +
			'| © <a href="https://github.com/wwwouaiebe" target="_blank" ' +
			'title="https://github.com/wwwouaiebe">Travel & Notes</a> '
		).htmlString;

		return leafletLayer;
	}

	/**
	Creates markers for notes
	*/

	#getNotesMarkers ( ) {
		const notesMarkers = [];
		this.#route.notes.forEach (
			note => {
				const icon = window.L.divIcon (
					{
						iconSize : [ note.iconWidth, note.iconHeight ],
						iconAnchor : [ note.iconWidth / TWO, note.iconHeight / TWO ],
						popupAnchor : [ ZERO, -note.iconHeight / TWO ],
						html : note.iconContent,
						className : 'TravelNotes-Map-AllNotes '
					}
				);

				const marker = window.L.marker (
					note.iconLatLng,
					{
						// eslint-disable-next-line no-magic-numbers
						zIndexOffset : 100,
						icon : icon,
						draggable : true
					}
				);
				notesMarkers.push ( marker );
			}
		);
		return notesMarkers;
	}

	/**
	Creates a print view
	@param {PrintView} printView The view to create
	*/

	#createViewOnPage ( printView ) {

		this.#viewsCounter ++;
		const viewId = 'TravelNotes-RouteViewDiv' + this.#viewsCounter;

		// viewDiv is used by leaflet. We cannot seal viewDiv with theHTMLElementsFactory
		const viewDiv = document.createElement ( 'div' );
		viewDiv.className = 'TravelNotes-routeViewDiv';
		viewDiv.id = viewId;
		document.body.appendChild ( viewDiv );
		this.#viewsDiv.push ( viewDiv );

		// setting the size given by the user in mm
		viewDiv.style.width = String ( this.#printRouteMapOptions.paperWidth ) + 'mm';
		viewDiv.style.height = String ( this.#printRouteMapOptions.paperHeight ) + 'mm';

		// creating markers for notes
		const layers = this.#printRouteMapOptions.printNotes ? this.#getNotesMarkers ( ) : [];

		// adding the leaflet map layer
		layers.push ( this.#getMapLayer ( ) );

		// adding entry point and exit point markers
		layers.push (
			window.L.circleMarker (
				[ printView.entryPoint.lat, printView.entryPoint.lng ],
				theConfig.printRouteMap.entryPointMarker
			)
		);
		layers.push (
			window.L.circleMarker (
				[ printView.exitPoint.lat, printView.exitPoint.lng ],
				theConfig.printRouteMap.exitPointMarker
			)
		);

		// adding the route
		layers.push ( this.#routePolyline );

		// creating the map
		window.L.map (
			viewId,
			{
				attributionControl : true,
				zoomControl : false,
				center : [
					( printView.bottomLeft.lat + printView.upperRight.lat ) / TWO,
					( printView.bottomLeft.lng + printView.upperRight.lng ) / TWO
				],
				zoom : this.#printRouteMapOptions.zoomFactor,
				minZoom : this.#printRouteMapOptions.zoomFactor,
				maxZoom : this.#printRouteMapOptions.zoomFactor,
				layers : layers
			}
		);
	}

	/**
	creates the toolbar with the print and cancel button
	*/

	#createToolbar ( ) {

		// toolbar
		this.#printToolbar = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-PrintToolbar'
			},
			document.body
		);

		// print button
		this.#printButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-UI-Button',
				title : theTranslator.getText ( 'PrintPageBuilder - Print' ),
				textContent : '🖨️'
			},
			this.#printToolbar
		);
		this.#printButton.addEventListener ( 'click', this.#printEL, false );

		// cancel button
		this.#cancelButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-UI-Button',
				title : theTranslator.getText ( 'PrintPageBuilder - Cancel print' ),
				textContent : '❌'
			},
			this.#printToolbar
		);
		this.#cancelButton.addEventListener (	'click', this.#afterPrintEL, false );
	}

	/**
	The constructor
	@param {Route} route A reference to the printed route
	@param {Array.PrintView>} printViews A reference to the views to print
	@param {PrintRouteMapOptions} printRouteMapOptions A reference to the PrintRouteMapOptions
	object containing the user choices
	*/

	constructor ( route, printViews, printRouteMapOptions ) {

		Object.freeze ( this );

		// Saving parameters
		this.#route = route;
		this.#printViews = printViews;
		this.#printRouteMapOptions = printRouteMapOptions;

		this.#viewsCounter = ZERO;
		this.#viewsDiv = [];

		// Event listeners creation
		this.#printEL = new PrintEL ( );
		this.#afterPrintEL = new AfterPrintEL ( this );
	}

	/**
	Hide existing HTMLElements, add the toolbar, prepare the polyline and add the views to the html page
	*/

	preparePage ( ) {
		if ( this.#printRouteMapOptions.firefoxBrowser ) {
			document.body.classList.add ( 'TravelNotes-Maps-FirefoxBrowser' );
		}
		else {
			document.body.classList.remove ( 'TravelNotes-Maps-FirefoxBrowser' );
		}

		// adding classes to the body, so all existing elements are hidden

		const childrens = document.body.children;
		for ( let counter = 0; counter < childrens.length; counter ++ ) {
			childrens.item ( counter ).classList.add ( 'TravelNotes-Hidden' );
		}

		// modify the document title with the travel name and route name
		document.title =
			'' === theTravelNotesData.travel.name
				?
				'maps'
				:
				theTravelNotesData.travel.name + ' - ' + this.#route.computedName + ' - maps';
		this.#createToolbar ( );

		// Adding afterprint event listener to the document
		window.addEventListener ( 'afterprint', this.#afterPrintEL, true );

		// creating the polyline for the route
		// why we can create the polyline only once and we have to create markers and layers for each view?
		const latLngs = [];
		const pointsIterator = this.#route.itinerary.itineraryPoints.iterator;
		while ( ! pointsIterator.done ) {
			latLngs.push ( pointsIterator.value.latLng );
		}

		this.#routePolyline = window.L.polyline (
			latLngs,
			{
				color : this.#route.color,
				weight : this.#route.width,
				dashArray : this.#route.dashString
			}
		);

		// adding views
		this.#viewsCounter = ZERO;
		this.#printViews.forEach ( printView => this.#createViewOnPage ( printView ) );
	}
}

export default PrintPageBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */