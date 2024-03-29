/*
Copyright - 2020 - wwwouaiebe - Contact: http//www.ouaie.be/

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

import theErrorsUI from '../uis/errorsUI/ErrorsUI.js';
import theHTMLElementsFactory from '../core/uiLib/HTMLElementsFactory.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theDataSearchEngine from '../data/DataSearchEngine.js';
import theGeometry from '../core/lib/Geometry.js';
import theConfig from '../data/Config.js';
import theTranslator from '../core/uiLib/Translator.js';
import PrintViewsFactory from './PrintViewsFactory.js';
import ViewSize from './ViewSize.js';
import PrintPageBuilder from './PrintPageBuilder.js';

import { ZERO, TWO, LAT, LNG } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class manages the print of a route
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RoutePrinter {

	/**
	The number of tiles needed for printing a page
	@type {Number}
	*/

	#tilesPerPage = ZERO;

	/**
	The tiles dimension in pixel
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #TILE_SIZE ( ) { return 256; }

	/**
	Compute the view size in lat and lng transforming the dimension given in mm by the user.
	@param {PrintRouteMapOptions} printRouteMapOptions the print options returned by the PrintRouteMapDialog
	*/

	#computeMaxViewSize ( printRouteMapOptions ) {

		// creating a dummy HTMLElement to compute the view size
		const dummyDiv = theHTMLElementsFactory.create ( 'div', { }, document.body );
		dummyDiv.style.position = 'absolute';
		dummyDiv.style.top = '0';
		dummyDiv.style.left = '0';
		dummyDiv.style.width = String ( printRouteMapOptions.paperWidth - ( TWO * printRouteMapOptions.borderWidth ) ) + 'mm';
		dummyDiv.style.height = String ( printRouteMapOptions.paperHeight - ( TWO * printRouteMapOptions.borderWidth ) ) + 'mm';

		// transform the screen coordinates to lat and lng
		const topLeftScreen = theGeometry.screenCoordToLatLng ( ZERO, ZERO );
		const bottomRightScreen = theGeometry.screenCoordToLatLng (
			dummyDiv.clientWidth,
			dummyDiv.clientHeight
		);

		// computing the tiles needed for a page
		this.#tilesPerPage =
			Math.ceil ( dummyDiv.clientWidth / RoutePrinter.#TILE_SIZE ) *
			Math.ceil ( dummyDiv.clientHeight / RoutePrinter.#TILE_SIZE );

		document.body.removeChild ( dummyDiv );

		// computing the scale
		const scale = theTravelNotesData.map.getZoomScale (
			theTravelNotesData.map.getZoom ( ),
			printRouteMapOptions.zoomFactor
		);

		// computing the size and return.
		return new ViewSize (
			Math.abs ( topLeftScreen [ LNG ] - bottomRightScreen [ LNG ] ) * scale,
			Math.abs ( topLeftScreen [ LAT ] - bottomRightScreen [ LAT ] ) * scale
		);
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Modify the main page, creating views on the page, so the page can be printed easily
	@param {PrintRouteMapOptions} printRouteMapOptions the PrintRouteMapOptions returned by the PrintRouteMapDialog
	@param {Number} routeObjId The objId of the route to print
	*/

	print ( printRouteMapOptions, routeObjId ) {

		const route = theDataSearchEngine.getRoute ( routeObjId );
		if ( ! route ) {
			return;
		}

		// Computing the needed views
		const printViewsFactory = new PrintViewsFactory (
			route,
			this.#computeMaxViewSize ( printRouteMapOptions )
		);

		// Remain for debugging
		/*
		printViewsFactory.printViews.forEach (
			view => new LeafletRectangle ( [ view.bottomLeft, view.upperRight ] ).addTo ( theTravelNotesData.map )
		);
		console.log ( 'views :' + printViewsFactory.printViews.length );
		*/
		// Verify the tiles needed and stop the command if too mutch tiles needed

		if ( theConfig.printRouteMap.maxTiles < printViewsFactory.printViews.length * this.#tilesPerPage ) {
			theErrorsUI.showError ( theTranslator.getText ( 'RoutePrinter - The maximum of allowed pages is reached.' ) );
			return;
		}

		// Prepare the main page, for printing, hidding the map, adding the views and a print toolbar
		const printPageBuilder = new PrintPageBuilder (
			route,
			printViewsFactory.printViews,
			printRouteMapOptions
		);
		printPageBuilder.preparePage ( );
	}
}

export default RoutePrinter;

/* --- End of file --------------------------------------------------------------------------------------------------------- */