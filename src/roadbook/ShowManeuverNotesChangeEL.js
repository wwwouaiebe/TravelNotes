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
		- Issue ♯9 : String.substr ( ) is deprecated... Replace...
	- v3.4.0:
		- Issue ♯22 : Nice to have a table view for notes in the roadbook
		- Issue ♯25 : Add a print button to the roadbook page
Doc reviewed 20210915
Tests ...
*/

import theRoadbookUpdater from '../roadbook/RoadbookUpdater.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the show maneuver notes checkbox
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ShowManeuverNotesChangeEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		theRoadbookUpdater.showManeuversNotes = changeEvent.target.checked;
	}
}

export default ShowManeuverNotesChangeEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */