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

import theConfig from '../data/Config.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theDataSearchEngine from '../data/DataSearchEngine.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import theGeometry from '../coreLib/Geometry.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragend event listener for the notes bullet
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteBulletDragEndEL {

	/**
	Event listener method
	@param {Event} dragEndEvent The event to handle
	*/

	static handleEvent ( dragEndEvent ) {

		// the TravelNotes note and route are searched...
		const noteAndRoute = theDataSearchEngine.getNoteAndRoute ( dragEndEvent.target.objId );
		const draggedNote = noteAndRoute.note;
		const route = noteAndRoute.route;

		// ... then the layerGroup is searched...
		const draggedLayerGroup = theTravelNotesData.mapObjects.get ( dragEndEvent.target.objId );
		if ( null === route ) {

			// the note is not attached to a route, so the coordinates of the note can be directly changed
			draggedNote.latLng = [ dragEndEvent.target.getLatLng ( ).lat, dragEndEvent.target.getLatLng ( ).lng ];
			theEventDispatcher.dispatch ( 'updatetravelnotes' );
		}
		else {

			// the note is attached to the route, so we have to find the nearest point on the route
			// and the distance since the start of the route
			const latLngDistance = theGeometry.getClosestLatLngDistance (
				route,
				[ dragEndEvent.target.getLatLng ( ).lat, dragEndEvent.target.getLatLng ( ).lng ]
			);

			// coordinates and distance are changed in the note
			draggedNote.latLng = latLngDistance.latLng;
			draggedNote.distance = latLngDistance.distance;

			// notes are sorted on the distance
			route.notes.sort (
				( first, second ) => first.distance - second.distance
			);

			// the coordinates of the bullet are adapted
			draggedLayerGroup.getLayer ( draggedLayerGroup.bulletId )
				.setLatLng ( latLngDistance.latLng );
			theEventDispatcher.dispatch ( 'updateitinerary' );
		}

		// in all cases, the polyline is updated
		draggedLayerGroup.getLayer ( draggedLayerGroup.polylineId )
			.setLatLngs ( [ draggedNote.latLng, draggedNote.iconLatLng ] );

		// and the HTML page is adapted
		theEventDispatcher.dispatch ( 'roadbookupdate' );
	}
}

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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouseenter event listener for the notes bullet
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteBulletMouseEnterEL {

	/**
	Event listener method
	@param {Event} mouseEnterEvent The event to handle
	*/

	static handleEvent ( mouseEnterEvent ) {
		mouseEnterEvent.originalEvent.target.style.opacity = theConfig.note.grip.moveOpacity;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouseleave event listener for the notes bullet
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteBulletMouseLeaveEL {

	/**
	Event listener method
	@param {Event} mouseLeaveEvent The event to handle
	*/

	static handleEvent ( mouseLeaveEvent ) {
		mouseLeaveEvent.originalEvent.target.style.opacity = theConfig.note.grip.opacity;
	}
}

export {
	NoteBulletDragEndEL,
	NoteBulletDragEL,
	NoteBulletMouseEnterEL,
	NoteBulletMouseLeaveEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */