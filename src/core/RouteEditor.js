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
import theApiKeysManager from './ApiKeysManager.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theErrorsUI from '../uis/errorsUI/ErrorsUI.js';
import theDataSearchEngine from '../data/DataSearchEngine.js';
import Route from '../data/Route.js';
import GpxFactory from './lib/GpxFactory.js';
import RoutePropertiesDialog from '../dialogs/routePropertiesDialog/RoutePropertiesDialog.js';
import PrintRouteMapDialog from '../dialogs/printRouteMapDialog/PrintRouteMapDialog.js';
import theEventDispatcher from './lib/EventDispatcher.js';
import theProfileDialogsManager from './ProfileDialogsManager.js';
import RoutePrinter from '../printRoute/RoutePrinter.js';

import { ROUTE_EDITION_STATUS, DISTANCE, INVALID_OBJ_ID } from '../main/Constants.js';
import TempWayPointMarkerMouseOutEL from './mapEditor/TempWayPointMarkerEL/TempWayPointMarkerMouseOutEL.js';
import thePluginsManager from './PluginsManager.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class contains methods fot Routes creation or modifications
See theRouteEditor for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RouteEditor {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	This method add a route to the Travel and, if no other route is beind edited,
	start the edition of this new route
	*/

	addRoute ( ) {
		const route = new Route ( );
		theTravelNotesData.travel.routes.add ( route );
		this.chainRoutes ( );
		if ( ROUTE_EDITION_STATUS.editedChanged === theTravelNotesData.travel.editedRoute.editionStatus ) {
			theEventDispatcher.dispatch ( 'updatetravelproperties' );
			theEventDispatcher.dispatch ( 'updateroadbook' );
		}
		else {
			this.editRoute ( route.objId );
		}
	}

	/**
	This method start the edition of a route
	@param {Number} routeObjId The objId of the route to edit.
	*/

	editRoute ( routeObjId ) {

		// We verify that the provider  for this route is available
		const initialRoute = theDataSearchEngine.getRoute ( routeObjId );
		const providerName = initialRoute.itinerary.provider;
		const provider = thePluginsManager.providers.get ( providerName.toLowerCase ( ) );
		if (
			providerName
			&&
			( '' !== providerName )
			&&
			(
				( ! provider )
				||
				( provider.providerKeyNeeded && ! theApiKeysManager.hasKey ( providerName ) )
			)
		) {
			theErrorsUI.showError (
				theTranslator.getText (
					'RouteEditor - Not possible to edit a route created with this provider',
					{ provider : providerName }
				)
			);
			return;
		}

		if ( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId ) {

			// the current edited route is not changed (we have verified in the RouteContextMenu ). Cleaning the editors
			this.cancelEdition ( );
		}

		// Provider and transit mode are changed in the itinerary editor
		if ( providerName && '' !== providerName ) {
			theEventDispatcher.dispatch ( 'setprovider', { provider : providerName } );
		}
		const transitMode = initialRoute.itinerary.transitMode;
		if ( transitMode && '' !== transitMode ) {
			theEventDispatcher.dispatch ( 'settransitmode', { transitMode : transitMode } );
		}

		// The edited route is pushed in the editors
		theTravelNotesData.travel.editedRoute = new Route ( );
		initialRoute.editionStatus = ROUTE_EDITION_STATUS.editedNoChange;

		// Route is cloned, so we can have a cancel button in the editor
		theTravelNotesData.travel.editedRoute.jsonObject = initialRoute.jsonObject;
		theTravelNotesData.editedRouteObjId = initialRoute.objId;
		theTravelNotesData.travel.editedRoute.hidden = false;
		initialRoute.hidden = false;
		theProfileDialogsManager.updateProfile (
			theTravelNotesData.editedRouteObjId,
			theTravelNotesData.travel.editedRoute
		);
		this.chainRoutes ( );
		theEventDispatcher.dispatch (
			'routeupdated',
			{
				removedRouteObjId : initialRoute.objId,
				addedRouteObjId : theTravelNotesData.travel.editedRoute.objId
			}
		);

		theEventDispatcher.dispatch ( 'updateroadbook' );
		theEventDispatcher.dispatch ( 'updatetravelproperties' );
	}

	/**
	This method removes a route from the travel
	@param {Number} routeObjId The objId of the Route to remove.
	*/

	removeRoute ( routeObjId ) {
		let routeToDeleteObjId = routeObjId;
		if (
			(
				routeToDeleteObjId === theTravelNotesData.editedRouteObjId
				||
				routeToDeleteObjId === theTravelNotesData.travel.editedRoute.objId
			)
		) {
			routeToDeleteObjId = theTravelNotesData.editedRouteObjId;
			this.cancelEdition ( );
		}

		theEventDispatcher.dispatch (
			'routeupdated',
			{
				removedRouteObjId : routeToDeleteObjId,
				addedRouteObjId : INVALID_OBJ_ID
			}
		);

		theTravelNotesData.travel.routes.remove ( routeToDeleteObjId );
		theProfileDialogsManager.deleteProfile ( routeToDeleteObjId );
		this.chainRoutes ( );

		theEventDispatcher.dispatch ( 'updateroadbook' );
		theEventDispatcher.dispatch ( 'updatetravelproperties' );
	}

	/**
	This method save the route to a gpx file
	@param {Number} routeObjId The objId of the Route to save.
	*/

	saveGpx ( routeObjId ) {
		new GpxFactory ( ).routeToGpx ( routeObjId );
	}

	/**
	This method recompute the distances for all the chained routes and their notes
	*/

	chainRoutes ( ) {
		const routesIterator = theTravelNotesData.travel.routes.iterator;
		let chainedDistance = DISTANCE.defaultValue;
		while ( ! routesIterator.done ) {
			if ( routesIterator.value.chain ) {
				routesIterator.value.chainedDistance = chainedDistance;
				chainedDistance += routesIterator.value.distance;
			}
			else {
				routesIterator.value.chainedDistance = DISTANCE.defaultValue;
			}
			const notesIterator = routesIterator.value.notes.iterator;
			while ( ! notesIterator.done ) {
				notesIterator.value.chainedDistance = routesIterator.value.chainedDistance;
			}
			if ( routesIterator.value.objId === theTravelNotesData.editedRouteObjId ) {
				theTravelNotesData.travel.editedRoute.chainedDistance =
					theTravelNotesData.travel.editedRoute.chain
						?
						routesIterator.value.chainedDistance
						:
						DISTANCE.defaultValue;
				const editedRouteNotesIterator = theTravelNotesData.travel.editedRoute.notes.iterator;
				while ( ! editedRouteNotesIterator.done ) {
					editedRouteNotesIterator.value.chainedDistance = theTravelNotesData.travel.editedRoute.chainedDistance;
				}
			}
		}
	}

	/**
	This method save the edited route
	*/

	saveEdition ( ) {

		// the edited route is cloned
		const clonedRoute = new Route ( );
		clonedRoute.jsonObject = theTravelNotesData.travel.editedRoute.jsonObject;

		// and the initial route replaced with the clone
		theTravelNotesData.travel.routes.replace ( theTravelNotesData.editedRouteObjId, clonedRoute );
		theTravelNotesData.editedRouteObjId = clonedRoute.objId;

		// cleaning editor
		this.cancelEdition ( );
	}

	/**
	This method cancel the route edition
	*/

	cancelEdition ( ) {

		// Removing temp way point if any mainly for touch devices)
		TempWayPointMarkerMouseOutEL.handleEvent ( );

		// !!! order is important!!!
		const editedRoute = theDataSearchEngine.getRoute ( theTravelNotesData.editedRouteObjId );
		editedRoute.editionStatus = ROUTE_EDITION_STATUS.notEdited;

		theProfileDialogsManager.updateProfile (
			theTravelNotesData.travel.editedRoute.objId,
			editedRoute
		);

		theEventDispatcher.dispatch (
			'routeupdated',
			{
				removedRouteObjId : theTravelNotesData.travel.editedRoute.objId,
				addedRouteObjId : theTravelNotesData.editedRouteObjId
			}
		);

		theTravelNotesData.editedRouteObjId = INVALID_OBJ_ID;
		theTravelNotesData.travel.editedRoute = new Route ( );
		this.chainRoutes ( );

		theEventDispatcher.dispatch ( 'updateroadbook' );
		theEventDispatcher.dispatch ( 'updatetravelproperties' );
	}

	/**
	This method show the RoutePropertiesDialog
	@param {Number} routeObjId The objId of the Route for witch the properties must be edited
	*/

	routeProperties ( routeObjId ) {
		const route = theDataSearchEngine.getRoute ( routeObjId );
		new RoutePropertiesDialog ( route )
			.show ( )
			.then (
				( ) => {
					this.chainRoutes ( );
					if ( route.haveValidWayPoints ( ) ) {
						theEventDispatcher.dispatch (
							'routepropertiesupdated',
							{
								routeObjId : route.objId
							}
						);
					}
					theEventDispatcher.dispatch ( 'updateroadbook' );
					theEventDispatcher.dispatch ( 'updatetravelproperties' );
					theEventDispatcher.dispatch ( 'updateprofilename', { routeObjId : routeObjId } );
				}
			)
			.catch (
				err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
				}
			);
	}

	/**
	This method show the PrintRouteMapDialog and then print the maps
	@param {Number} routeObjId The objId of the Route for witch the maps must be printed
	*/

	printRouteMap ( routeObjId ) {
		new PrintRouteMapDialog ( )
			.show ( )
			.then ( printRouteMapOptions => new RoutePrinter ( ).print ( printRouteMapOptions, routeObjId ) )
			.catch (
				err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
				}
			);
	}

	/**
	This method show a route on the map
	@param {Number} routeObjId The objId of the Route to show
	*/

	showRoute ( routeObjId ) {
		theDataSearchEngine.getRoute ( routeObjId ).hidden = false;
		theEventDispatcher.dispatch (
			'routeupdated',
			{
				removedRouteObjId : INVALID_OBJ_ID,
				addedRouteObjId : routeObjId
			}
		);
		theEventDispatcher.dispatch ( 'updatetravelproperties' );
	}

	/**
	This method hide a route on the map
	@param {Number} routeObjId The objId of the Route to show
	*/

	hideRoute ( routeObjId ) {
		theDataSearchEngine.getRoute ( routeObjId ).hidden = true;
		theEventDispatcher.dispatch (
			'routeupdated',
			{
				removedRouteObjId : routeObjId,
				addedRouteObjId : INVALID_OBJ_ID
			}
		);
		theEventDispatcher.dispatch ( 'updatetravelproperties' );
	}

	/**
	This method shows all the routes on the map
	*/

	showRoutes ( ) {
		const routesIterator = theTravelNotesData.travel.routes.iterator;
		while ( ! routesIterator.done ) {
			if ( routesIterator.value.hidden ) {
				routesIterator.value.hidden = false;
				theEventDispatcher.dispatch (
					'routeupdated',
					{
						removedRouteObjId : INVALID_OBJ_ID,
						addedRouteObjId : routesIterator.value.objId
					}
				);
			}
		}
		theEventDispatcher.dispatch ( 'updatetravelproperties' );
	}

	/**
	This method hide all the routes on the map
	*/

	hideRoutes ( ) {
		const routesIterator = theTravelNotesData.travel.routes.iterator;
		while ( ! routesIterator.done ) {
			if (
				! routesIterator.value.hidden
				&&
				routesIterator.value.objId !== theTravelNotesData.editedRouteObjId
			) {
				routesIterator.value.hidden = true;
				theEventDispatcher.dispatch (
					'routeupdated',
					{
						removedRouteObjId : routesIterator.value.objId,
						addedRouteObjId : INVALID_OBJ_ID
					}
				);
			}
		}
		theEventDispatcher.dispatch ( 'updatetravelproperties' );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of RouteEditor class
@type {RouteEditor}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theRouteEditor = new RouteEditor ( );

export default theRouteEditor;

/* --- End of file --------------------------------------------------------------------------------------------------------- */