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

import ProfileContextMenu from '../../contextMenus/ProfileContextMenu.js';
import BaseSvgEL from './BaseSvgEL.js';
import { ZERO, ONE } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
contextmenu event listener for svg profile
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SvgContextMenuEL extends BaseSvgEL {

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
	}

	/**
	Event listener method
	@param {Event} mouseEvent The event to handle
	*/

	handleEvent ( mouseEvent ) {
		mouseEvent.preventDefault ( );
		mouseEvent.stopPropagation ( );

		const latLngElevOnRoute = this.getlatLngElevOnRouteAtMousePosition ( mouseEvent );
		if ( latLngElevOnRoute ) {
			mouseEvent.latlng = {
				lat : latLngElevOnRoute.latLng [ ZERO ],
				lng : latLngElevOnRoute.latLng [ ONE ]
			};
			new ProfileContextMenu ( mouseEvent ).show ( );
		}
	}
}

export default SvgContextMenuEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */