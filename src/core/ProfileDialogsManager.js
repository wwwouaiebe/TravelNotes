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

import theConfig from '../data/Config.js';
import ProfileDialog from '../dialogs/profileDialog/ProfileDialog.js';
import ProfileSmoothingIron from './lib/ProfileSmoothingIron.js';
import theDataSearchEngine from '../data/DataSearchEngine.js';
import { ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class provides methods to manage the profile dialogs
see theProfileDialogsManager for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ProfileDialogsManager {

	/**
	A map with all the profile dialogs currently displayed
	@type {Map.<ProfileDialog>}
	*/

	#profileDialogs = new Map ( );

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	This method creates the profile for a Route after a call to a provider
	and manages the dialog profile
	@param {Route} route The Route for witch a profile is created
	*/

	createProfile ( route ) {
		const profileDialog = this.#profileDialogs.get ( route.objId );

		if ( route.itinerary.hasProfile ) {
			if ( theConfig.route.elev.smooth ) {
				new ProfileSmoothingIron ( ).smooth ( route );
			}
			let ascent = ZERO;
			let descent = ZERO;
			let previousElev = route.itinerary.itineraryPoints.first.elev;
			route.itinerary.itineraryPoints.forEach (
				itineraryPoint => {
					let deltaElev = itineraryPoint.elev - previousElev;
					if ( ZERO > deltaElev ) {
						descent -= deltaElev;
					}
					else {
						ascent += deltaElev;
					}
					previousElev = itineraryPoint.elev;
				}
			);
			route.itinerary.ascent = ascent;
			route.itinerary.descent = descent;
			if ( profileDialog ) {
				profileDialog.setContent ( route );
			}
		}
		else if ( profileDialog ) {
			profileDialog.onCancel ( );
		}
	}

	/**
	Update the route name in a profile dialog. Called when the updateprofilename event is send
	@param {Number} routeObjId The obj id of the route to update
	*/

	updateProfileName ( routeObjId ) {
		const profileDialog = this.#profileDialogs.get ( routeObjId );
		if ( profileDialog ) {
			const route = theDataSearchEngine.getRoute ( routeObjId );
			if ( route ) {
				profileDialog.setContentName ( route );
			}
		}
	}

	/**
	This method updates the profile dialog for a Route
	@param {Number} oldRouteObjId The objId of the Route that is in the profile dialog
	@param {Route} newRoute The  Route for witch the profile dialog is updated
	*/

	updateProfile ( oldRouteObjId, newRoute ) {
		const profileDialog = this.#profileDialogs.get ( oldRouteObjId );
		if ( profileDialog ) {
			this.#profileDialogs.delete ( oldRouteObjId );
			if ( newRoute && newRoute.itinerary.hasProfile ) {
				profileDialog.setContent ( newRoute );
				this.#profileDialogs.set ( newRoute.objId, profileDialog );
			}
			else {
				profileDialog.onCancel ( );
			}
		}
	}

	/**
	This method close the profile dialog of a route
	@param {Number} objId The objId of the Route that is in the profile dialog to close
	*/

	deleteProfile ( objId ) {
		const profileDialog = this.#profileDialogs.get ( objId );
		if ( profileDialog ) {
			profileDialog.onCancel ( );
		}
	}

	/**
	This method close the all the profile dialogs
	*/

	deleteAllProfiles ( ) {
		this.#profileDialogs.forEach ( profileDialog => profileDialog.onCancel ( ) );
	}

	/**
	This method creates the profile dialog for a Route
	@param {Number} routeObjId The Route objId for witch a profile dialog is created
	*/

	showProfile ( routeObjId ) {
		const route = theDataSearchEngine.getRoute ( routeObjId );
		let profileDialog = this.#profileDialogs.get ( routeObjId );
		if ( ! profileDialog ) {
			profileDialog = new ProfileDialog ( );
			profileDialog.setContent ( route );
			profileDialog.show ( );
			this.#profileDialogs.set ( routeObjId, profileDialog );
		}
	}

	/**
	This method is called when a profile dialog is closed
	@param {Number} objId The Route objId for witch a profile dialog is created
	*/

	onProfileClosed ( objId ) {
		this.#profileDialogs.delete ( objId );
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of ProfileDialogsManager class
@type {ProfileDialogsManager}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theProfileDialogsManager = new ProfileDialogsManager ( );

export default theProfileDialogsManager;

/* --- End of file --------------------------------------------------------------------------------------------------------- */