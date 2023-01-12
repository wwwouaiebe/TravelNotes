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

import WaitUI from '../uis/waitUI/WaitUI.js';
import MapIconFromOsmFactory from './mapIcon/MapIconFromOsmFactory.js';
import Note from '../data/Note.js';
import theGeometry from './lib/Geometry.js';
import theEventDispatcher from './lib/EventDispatcher.js';
import theErrorsUI from '../uis/errorsUI/ErrorsUI.js';
import theConfig from '../data/Config.js';
import theTranslator from './uiLib/Translator.js';
import TwoButtonsDialog from '../dialogs/twoButtonsDialog/TwoButtonsDialog.js';
import theDataSearchEngine from '../data/DataSearchEngine.js';

import { ZERO, ONE, INVALID_OBJ_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class add all maneuvers notes to a route
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class AllManeuverNotesBuilder {

	/** The route for witch the maneuvers note are created
	@type {Route}
	*/

	#route = null;

	/**
	the number of maneuvers
	@type {Number}
	*/

	#maneuversLength = ZERO;

	/**
	This method creates a new route note with data from osm
	@param {Object} noteData The data needed for building the note
	*/

	#newNoteFromOsmData ( noteData ) {
		const note = new Note ( );
		for ( const property in noteData ) {
			note [ property ] = noteData [ property ];
		}

		note.iconLatLng = note.latLng;
		note.distance = theGeometry.getClosestLatLngDistance ( this.#route, note.latLng ).distance;
		note.chainedDistance = this.#route.chainedDistance;
		this.#route.notes.add ( note );
		theEventDispatcher.dispatch (
			'noteupdated',
			{
				removedNoteObjId : INVALID_OBJ_ID,
				addedNoteObjId : note.objId
			}
		);
	}

	/**
	This method add a note with data from osm for each maneuver of a route.
	*/

	async #addAllManeuverNotes ( ) {
		const waitUI = new WaitUI ( );
		waitUI.createUI ( );
		const mapIconFromOsmFactory = new MapIconFromOsmFactory ( );
		const maneuverIterator = this.#route.itinerary.maneuvers.iterator;
		while ( ! maneuverIterator.done ) {
			waitUI.showInfo (
				theTranslator.getText (
					'AllManeuverNotesBuilder - Creating note',
					{ noteNumber : maneuverIterator.index + ONE, notesLength : this.#maneuversLength }
				)
			);

			const latLng = this.#route.itinerary.itineraryPoints.getAt ( maneuverIterator.value.itineraryPointObjId ).latLng;
			const noteData = await mapIconFromOsmFactory.getIconAndAdressAsync ( latLng, this.#route );
			if ( noteData ) {
				this.#newNoteFromOsmData ( noteData );
			}
			else {
				console.error ( 'An error occurs when creating the svg icon ' + maneuverIterator.index );
			}
		}
		this.#route.notes.sort ( ( first, second ) => first.distance - second.distance );
		theEventDispatcher.dispatch ( 'updateroadbook' );
		waitUI.close ( );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	This method add a note with data from osm for each maneuver of a route
	A confirmation message is showed before starting.
	@param {Number} routeObjId The Route objId
	*/

	addAllManeuverNotes ( routeObjId ) {

		this.#route = theDataSearchEngine.getRoute ( routeObjId );
		this.#maneuversLength = this.#route.itinerary.maneuvers.length;

		if ( theConfig.note.maxManeuversNotes < this.#maneuversLength ) {
			theErrorsUI.showError (
				theTranslator.getText (
					'AllManeuverNotesBuilder - max maneuvers notes reached {maneuversLength}{maxManeuversNotes}',
					{ maneuversLength : this.#maneuversLength, maxManeuversNotes : theConfig.note.maxManeuversNotes } )
			);
			return;
		}

		new TwoButtonsDialog (
			{
				title : theTranslator.getText ( 'AllManeuverNotesBuilder - Add a note for each maneuver' ),
				text : theTranslator.getText (
					'AllManeuverNotesBuilder - Add a note for each maneuver. Are you sure?',
					{ noteLength : this.#maneuversLength }
				),
				secondButtonText : '❌'
			}
		)
			.show ( )
			.then ( ( ) => this.#addAllManeuverNotes ( ) )
			.catch (
				err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
				}
			);
	}
}

export default AllManeuverNotesBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */