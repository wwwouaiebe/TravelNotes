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
Tests 20210902
*/

import theTravelNotesData from '../../../data/TravelNotesData.js';
import theDataSearchEngine from '../../../data/DataSearchEngine.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
drag event listener for the notes bullet
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteBulletDragEL {

	/**
	Event listener method
	@param {Event} dragEvent The event to handle
	*/

	static handleEvent ( dragEvent ) {
		const draggedNote = theDataSearchEngine.getNoteAndRoute ( dragEvent.target.objId ).note;
		const draggedLayerGroup = theTravelNotesData.mapObjects.get ( dragEvent.target.objId );
		draggedLayerGroup.getLayer ( draggedLayerGroup.polylineId )
			.setLatLngs ( [ [ dragEvent.latlng.lat, dragEvent.latlng.lng ], draggedNote.iconLatLng ] );
	}
}

export default NoteBulletDragEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */