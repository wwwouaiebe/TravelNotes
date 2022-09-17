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

import theDataSearchEngine from '../../../data/DataSearchEngine.js';
import theTravelNotesData from '../../../data/TravelNotesData.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
drag event listener for the notes marker
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteMarkerDragEL {

	/**
	Event listener method
	@param {Event} dragEvent The event to handle
	*/

	static handleEvent ( dragEvent ) {

		// The TravelNotes note linked to the marker is searched...
		const draggedNote = theDataSearchEngine.getNoteAndRoute ( dragEvent.target.objId ).note;

		// ... then the layerGroup is searched...
		const draggedLayerGroup = theTravelNotesData.mapObjects.get ( dragEvent.target.objId );

		// ... and finally the polyline is updated with the new coordinates
		draggedLayerGroup.getLayer ( draggedLayerGroup.polylineId )
			.setLatLngs ( [ draggedNote.latLng, [ dragEvent.latlng.lat, dragEvent.latlng.lng ] ] );
	}
}

export default NoteMarkerDragEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */