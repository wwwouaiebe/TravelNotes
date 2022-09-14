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

import MouseAndTouchBaseEL from '../../mouseAndTouchEL/MouseAndTouchBaseEL.js';
import theTravelNotesData from '../../data/TravelNotesData.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Event listener for the MouseUI
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MouseUIEL extends MouseAndTouchBaseEL {

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
		this.eventTypes = [ 'click' ];
	}

	/**
	Click event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleClickEvent ( clickEvent ) {
		const zoomIncrement = Number.parseInt ( clickEvent.target.dataset.tanZoomIncrement );
		theTravelNotesData.map.setZoom ( theTravelNotesData.map.getZoom ( ) + zoomIncrement );
	}
}

export default MouseUIEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */