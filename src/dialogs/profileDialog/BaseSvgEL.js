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

import theGeometry from '../../core/lib/Geometry.js';
import theDataSearchEngine from '../../data/DataSearchEngine.js';
import SvgProfileBuilder from '../../core/lib/SvgProfileBuilder.js';
import { ZERO, TWO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class for Svg event listeners
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseSvgEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Get the lat, lng, elevation, ascent and distance from the route origin at the mouse position on the svg
	@param {Event} mouseEvent The triggered event
	@return {LatLngElevOnRoute} An object with the lat, lng, elevation, ascent and distance from the route origin
	at the mouse position on the svg
	*/

	getlatLngElevOnRouteAtMousePosition ( mouseEvent ) {
		const route = theDataSearchEngine.getRoute ( Number.parseInt ( mouseEvent.currentTarget.dataset.tanObjId ) );
		const clientRect = mouseEvent.currentTarget.getBoundingClientRect ( );
		const routeDist =
			(
				( mouseEvent.clientX - clientRect.x -
					(
						( SvgProfileBuilder.PROFILE_MARGIN /
							( ( TWO * SvgProfileBuilder.PROFILE_MARGIN ) + SvgProfileBuilder.PROFILE_WIDTH )
						) * clientRect.width )
				) /
				(
					( SvgProfileBuilder.PROFILE_WIDTH /
						( ( TWO * SvgProfileBuilder.PROFILE_MARGIN ) + SvgProfileBuilder.PROFILE_WIDTH )
					) * clientRect.width )
			) * route.distance;
		if ( ZERO < routeDist && routeDist < route.distance ) {
			return theGeometry.getLatLngElevAtDist ( route, routeDist );
		}

		return null;
	}
}

export default BaseSvgEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */