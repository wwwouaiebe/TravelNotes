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

import theDataSearchEngine from '../data/DataSearchEngine.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import NoteContextMenu from '../contextMenus/NoteContextMenu.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
contextmenu event listener for the notes marker
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteMarkerContextMenuEL {

	/**
	Event listener method
	@param {Event} contextMenuEvent The event to handle
	*/

	static handleEvent ( contextMenuEvent ) {
		new NoteContextMenu ( contextMenuEvent ).show ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragend event listener for the notes marker
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteMarkerDragEndEL {

	/**
	Event listener method
	@param {Event} dragEndEvent The event to handle
	*/

	static handleEvent ( dragEndEvent ) {

		// The TravelNotes note linked to the marker is searched...
		const draggedNote = theDataSearchEngine.getNoteAndRoute ( dragEndEvent.target.objId ).note;

		// ... new coordinates are saved in the TravelNotes note...
		draggedNote.iconLatLng = [ dragEndEvent.target.getLatLng ( ).lat, dragEndEvent.target.getLatLng ( ).lng ];

		// ... then the layerGroup is searched...
		const draggedLayerGroup = theTravelNotesData.mapObjects.get ( dragEndEvent.target.objId );

		// ... and finally the polyline is updated with the new coordinates
		draggedLayerGroup.getLayer (
			draggedLayerGroup.polylineId
		)
			.setLatLngs (
				[ draggedNote.latLng, draggedNote.iconLatLng ]
			);
	}
}

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

export {
	NoteMarkerContextMenuEL,
	NoteMarkerDragEndEL,
	NoteMarkerDragEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */