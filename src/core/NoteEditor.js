/*
Copyright - 2017 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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

import theTranslator from './uiLib/Translator.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import NoteDialog from '../dialogs/notesDialog/NoteDialog.js';
import Note from '../data/Note.js';
import theDataSearchEngine from '../data/DataSearchEngine.js';
import theEventDispatcher from './lib/EventDispatcher.js';
import theGeometry from './lib/Geometry.js';
import theConfig from '../data/Config.js';
import WaitUI from '../uis/waitUI/WaitUI.js';
import theErrorsUI from '../uis/errorsUI/ErrorsUI.js';
import theNoteDialogToolbarData from '../dialogs/notesDialog/toolbar/NoteDialogToolbarData.js';
import GeoCoder from './lib/GeoCoder.js';

import { DISTANCE, INVALID_OBJ_ID } from '../main/Constants.js';
import Zoomer from './Zoomer.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class contains all the needed methods fot Notes creation or modifications
See theNoteEditor for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteEditor {

	/**
	The currently created or edited note
	@type {Note}
	*/

	#note = null;

	/**
	The route to witch the created or edited note is linked
	@type {Route}
	*/

	#route = null;

	/**
	A flag indicating when the note is created or edited
	@type {Boolean}
	*/

	#isNewNote = true;

	/**
	A flag indicating when the note dialog is show when creating a search note
	Must be set to null at the startup because theConfig is perhaps not initialized
	@type {Boolean}
	*/

	#showSearchNoteDialog = null;

	/**
	This method add or update a note to theTravelNotesData and to the map
	*/

	#addNote ( ) {
		if ( this.#isNewNote ) {
			if ( this.#route ) {
				this.#route.notes.add ( this.#note );
				this.#note.chainedDistance = this.#route.chainedDistance;
				this.#route.notes.sort (
					( first, second ) => first.distance - second.distance
				);
			}
			else {
				theTravelNotesData.travel.notes.add ( this.#note );
				theEventDispatcher.dispatch ( 'updatetravelnotes' );
			}
		}
		else if ( ! this.#route ) {

			theEventDispatcher.dispatch ( 'updatetravelnotes' );
		}

		theEventDispatcher.dispatch (
			'noteupdated',
			{
				removedNoteObjId : this.#note.objId,
				addedNoteObjId : this.#note.objId
			}
		);
		theEventDispatcher.dispatch ( 'updateroadbook' );
	}

	/**
	This method show the Note dialog and then add or update the note
	*/

	#noteDialog ( ) {
		new NoteDialog ( this.#note, this.#route )
			.show ( )
			.then ( ( ) => this.#addNote ( ) )
			.catch (
				err => {
					console.error ( err );
				}
			);
	}

	/**
	This method construct a new Note object
	@param {Array.<Number>} latLng The latitude and longitude of the note
	*/

	#newNote ( latLng ) {
		this.#isNewNote = true;
		this.#note = new Note ( );
		this.#note.latLng = latLng;
		this.#note.iconLatLng = latLng;
	}

	/**
	This method add a note for a searh result from osm.
	@param {OsmElement} osmElement an object with osm data ( see OsmSearch...)
	*/

	async #newSearchNote ( osmElement ) {

		// Icon content
		if ( osmElement.tags.rcn_ref ) {
			this.#note.iconContent =
				'<div class=\'TravelNotes-MapNote TravelNotes-MapNoteCategory-0073\'>' +
				'<svg viewBox=\'0 0 20 20\'><text x=\'10\' y=\'14\'>' +
				osmElement.tags.rcn_ref +
				'</text></svg></div>';
		}
		else {
			this.#note.iconContent = theNoteDialogToolbarData.preDefinedIconDataFromName ( osmElement.description );
		}

		// Note data from the osmElement
		this.#note.url = osmElement.tags.website || '';
		this.#note.phone = osmElement.tags.phone || '';
		this.#note.tooltipContent = osmElement.description || '';
		this.#note.popupContent = osmElement.tags.name || '';

		// Note address...
		if (
			osmElement.tags [ 'addr:street' ]
			&&
			osmElement.tags [ 'addr:city' ]
		) {

			// ...from the osmElement
			this.#note.address =
				( osmElement.tags [ 'addr:housenumber' ] ? osmElement.tags [ 'addr:housenumber' ] + ' ' : '' ) +
				osmElement.tags [ 'addr:street' ] +
				' <span class="TravelNotes-NoteHtml-Address-City">' + osmElement.tags [ 'addr:city' ] + '</span>';
		}
		else {

			// ... or searching with geoCoder
			const waitUI = new WaitUI ( );
			waitUI.createUI ( );
			waitUI.showInfo ( 'Creating address' );
			let geoCoderData = null;
			try {
				geoCoderData = await new GeoCoder ( ).getAddressAsync ( [ osmElement.lat, osmElement.lon ] );
			}
			catch ( err ) {
				console.error ( err );
			}
			waitUI.close ( );
			this.#note.address = geoCoderData.street;
			if ( '' !== geoCoderData.city ) {
				this.#note.address +=
					' <span class="TravelNotes-NoteHtml-Address-City">' + geoCoderData.city + '</span>';
			}
		}

		// dialog, when asked by the user or when the icon is empty
		if ( this.osmSearchNoteDialog || '' === this.#note.iconContent ) {
			this.#noteDialog ( );
		}
		else {
			this.#addNote ( );
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	get the status of the osmSearchNoteDialog flag
	@type {Boolean}
	*/

	get osmSearchNoteDialog ( ) {
		if ( null === this.#showSearchNoteDialog ) {

			// First time the status is asked, searching in theConfig
			this.#showSearchNoteDialog = theConfig.osmSearch.showSearchNoteDialog;
		}
		return this.#showSearchNoteDialog;
	}

	/**
	change the status of the osmSearchNoteDialog flag
	*/

	changeOsmSearchNoteDialog ( ) {
		this.#showSearchNoteDialog = ! this.osmSearchNoteDialog;
	}

	/**
	This method add a route note.
	@param {Number} routeObjId objId of the route to witch the note will be attached
	@param {Array.<Number>} latLng the lat and lng of the point selected by the user
	*/

	newRouteNote ( routeObjId, latLng ) {

		this.#route = theDataSearchEngine.getRoute ( routeObjId );

		// the nearest point and distance on the route is searched
		const latLngDistance = theGeometry.getClosestLatLngDistance ( this.#route, latLng );

		// the note is created
		this.#newNote ( latLngDistance.latLng );
		this.#note.distance = latLngDistance.distance;

		// and the dialog displayed
		this.#noteDialog ( );
	}

	/**
	This method add a route note for a searh result from osm.
	@param {OsmElement} osmElement an object with osm data ( see OsmSearch...)
	*/

	newSearchRouteNote ( osmElement ) {
		const nearestRouteData = theDataSearchEngine.getNearestRouteData ( [ osmElement.lat, osmElement.lon ] );
		if ( ! nearestRouteData.route ) {
			theErrorsUI.showError ( theTranslator.getText ( 'NoteEditor - No route was found' ) );
			return;
		}
		this.#newNote ( nearestRouteData.latLngOnRoute );
		this.#note.iconLatLng = [ osmElement.lat, osmElement.lon ];
		this.#note.distance = nearestRouteData.distanceOnRoute;
		this.#route = nearestRouteData.route;
		this.#newSearchNote ( osmElement );
	}

	/**
	This method add a travel note for a searh result from osm.
	@param {OsmElement} osmElement an object with osm data ( see OsmSearch...)
	*/

	newSearchTravelNote ( osmElement ) {
		this.#route = null;
		this.#newNote ( [ osmElement.lat, osmElement.lon ] );
		this.#newSearchNote ( osmElement );
	}

	/**
	This method add a travel note
	@param {Array.<Number>} latLng The latitude and longitude of the note
	*/

	newTravelNote ( latLng ) {
		this.#route = null;
		this.#newNote ( latLng );
		this.#noteDialog ( );
	}

	/**
	 * This method add a travel note at the lat and lon given as url parameters
	 * @param {Array.<Number>} latLng The latitude and longitude of the note
	 */

	newUrlNote ( latLng ) {
		this.#route = null;
		this.#newNote ( latLng );
		this.#note.iconContent = '<div class="TravelNotes-MapNote TravelNotes-MapNoteCategory-0074"></div>';
		this.#note.tooltipContent = 'Here';
		this.#addNote ( );
		new Zoomer ( ).zoomToLatLng ( latLng );
	}

	/**
	This method start the edition of a note
	@param {Number} noteObjId The objId of the note to be edited
	*/

	editNote ( noteObjId ) {
		this.#isNewNote = false;
		const noteAndRoute = theDataSearchEngine.getNoteAndRoute ( noteObjId );
		this.#route = noteAndRoute.route;
		this.#note = noteAndRoute.note;
		this.#noteDialog ( );
	}

	/**
	This method remove a note
	@param {Number} noteObjId The objId of the note to be removed
	*/

	removeNote ( noteObjId ) {

		// the note and the route are searched
		const noteAndRoute = theDataSearchEngine.getNoteAndRoute ( noteObjId );
		if ( noteAndRoute.route ) {

			// it's a route note
			noteAndRoute.route.notes.remove ( noteObjId );
		}
		else {

			// it's a travel note
			theTravelNotesData.travel.notes.remove ( noteObjId );
			theEventDispatcher.dispatch ( 'updatetravelnotes' );
		}
		theEventDispatcher.dispatch (
			'noteupdated',
			{
				removedNoteObjId : noteObjId,
				addedNoteObjId : INVALID_OBJ_ID
			}
		);
		theEventDispatcher.dispatch ( 'updateroadbook' );
	}

	/**
	This method hide all notes on the map. The notes are always visible in the roadbook and UI
	*/

	hideNotes ( ) {
		let notesIterator = theTravelNotesData.travel.notes.iterator;
		while ( ! notesIterator.done ) {
			theEventDispatcher.dispatch ( 'removeobject', { objId : notesIterator.value.objId } );
		}
		const routesIterator = theTravelNotesData.travel.routes.iterator;
		while ( ! routesIterator.done ) {
			notesIterator = routesIterator.value.notes.iterator;
			while ( ! notesIterator.done ) {
				theEventDispatcher.dispatch ( 'removeobject', { objId : notesIterator.value.objId } );
			}
		}
		if ( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId ) {
			notesIterator = theTravelNotesData.travel.editedRoute.notes.iterator;
			while ( ! notesIterator.done ) {
				theEventDispatcher.dispatch ( 'removeobject', { objId : notesIterator.value.objId } );
			}
		}
	}

	/**
	This method show all notes on the map.
	*/

	showNotes ( ) {
		this.hideNotes ( );
		const notesIterator = theTravelNotesData.travel.notes.iterator;
		while ( ! notesIterator.done ) {
			theEventDispatcher.dispatch (
				'noteupdated',
				{
					removedNoteObjId : INVALID_OBJ_ID,
					addedNoteObjId : notesIterator.value.objId
				}
			);
		}
		const routesIterator = theTravelNotesData.travel.routes.iterator;
		while ( ! routesIterator.done ) {
			if ( ! routesIterator.value.hidden ) {
				theEventDispatcher.dispatch (
					'routeupdated',
					{
						removedRouteObjId : routesIterator.value.objId,
						addedRouteObjId : routesIterator.value.objId
					}
				);
			}
		}
	}

	/**
	This method transform a travel note into a route note.
	The nearest point on a route is selected for the note
	@param {Number} noteObjId The objId of the note
	*/

	attachNoteToRoute ( noteObjId ) {
		const note = theDataSearchEngine.getNoteAndRoute ( noteObjId ).note;
		const nearestRouteData = theDataSearchEngine.getNearestRouteData ( note.latLng );

		if ( nearestRouteData.route ) {
			theTravelNotesData.travel.notes.remove ( noteObjId );
			note.distance = nearestRouteData.distanceOnRoute;
			note.latLng = nearestRouteData.latLngOnRoute;
			note.chainedDistance = nearestRouteData.route.chainedDistance;
			nearestRouteData.route.notes.add ( note );
			nearestRouteData.route.notes.sort (
				( first, second ) => first.distance - second.distance
			);

			theEventDispatcher.dispatch (
				'noteupdated',
				{
					removedNoteObjId : noteObjId,
					addedNoteObjId : noteObjId
				}
			);
			theEventDispatcher.dispatch ( 'updatetravelnotes' );
			theEventDispatcher.dispatch ( 'updateroadbook' );
		}
	}

	/**
	This method transform a route note into a travel note.
	@param {Number} noteObjId The objId of the note
	*/

	detachNoteFromRoute ( noteObjId ) {
		const noteAndRoute = theDataSearchEngine.getNoteAndRoute ( noteObjId );
		noteAndRoute.route.notes.remove ( noteObjId );
		noteAndRoute.note.distance = DISTANCE.invalid;
		noteAndRoute.note.chainedDistance = DISTANCE.defaultValue;
		theTravelNotesData.travel.notes.add ( noteAndRoute.note );

		theEventDispatcher.dispatch ( 'updatetravelnotes' );
		theEventDispatcher.dispatch ( 'updateroadbook' );
	}

	/**
	This method is called when a note is dropped in the TravelNotesPaneUI and then notes reordered.
	@param {Number} draggedNoteObjId The objId of the dragged note
	@param {Number} targetNoteObjId The objId of the note on witch the drop was executed
	@param {Boolean} draggedBefore when true the dragged note is moved before the target note
	when false after
	*/

	travelNoteDropped ( draggedNoteObjId, targetNoteObjId, draggedBefore ) {
		theTravelNotesData.travel.notes.moveTo ( draggedNoteObjId, targetNoteObjId, draggedBefore );
		theEventDispatcher.dispatch ( 'updatetravelnotes' );
		theEventDispatcher.dispatch ( 'updateroadbook' );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of NoteEditor class
@type {NoteEditor}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theNoteEditor = new NoteEditor ( );

export default theNoteEditor;

/* --- End of file --------------------------------------------------------------------------------------------------------- */