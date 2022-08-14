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
	- v1.7.0:
		- created
	- v1.8.0:
		- Issue ♯98 : Elevation is not modified in the itinerary pane
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests 20210903
*/

import theConfig from '../data/Config.js';
import ProfileWindow from '../dialogProfileWindow/ProfileWindow.js';
import ProfileSmoothingIron from '../coreLib/ProfileSmoothingIron.js';
import theDataSearchEngine from '../data/DataSearchEngine.js';
import { ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class provides methods to manage the profile windows
see theProfileWindowsManager for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ProfileWindowsManager {

	/**
	A map with all the profile windows currently displayed
	@type {Map.<ProfileWindow>}
	*/

	#profileWindows = new Map ( );

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	This method creates the profile for a Route after a call to a provider
	and manages the window profile
	@param {Route} route The Route for witch a profile is created
	*/

	createProfile ( route ) {
		const profileWindow = this.#profileWindows.get ( route.objId );

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
			if ( profileWindow ) {
				profileWindow.update ( route );
			}
		}
		else if ( profileWindow ) {
			profileWindow.close ( );
		}
	}

	/**
	This method updates the profile window for a Route
	@param {Number} oldRouteObjId The objId of the Route that is in the profile window
	@param {Route} newRoute The  Route for witch the profile window is updated
	*/

	updateProfile ( oldRouteObjId, newRoute ) {
		const profileWindow = this.#profileWindows.get ( oldRouteObjId );
		if ( profileWindow ) {
			this.#profileWindows.delete ( oldRouteObjId );
			if ( newRoute && newRoute.itinerary.hasProfile ) {
				profileWindow.update ( newRoute );
				this.#profileWindows.set ( newRoute.objId, profileWindow );
			}
			else {
				profileWindow.close ( );
			}
		}
	}

	/**
	This method close the profile window of a route
	@param {Number} objId The objId of the Route that is in the profile window to close
	*/

	deleteProfile ( objId ) {
		const profileWindow = this.#profileWindows.get ( objId );
		if ( profileWindow ) {
			profileWindow.close ( );
		}
	}

	/**
	This method close the all the profile windows
	*/

	deleteAllProfiles ( ) {
		this.#profileWindows.forEach ( profileWindow => profileWindow.close ( ) );
	}

	/**
	This method creates the profile window for a Route
	@param {Number} routeObjId The Route objId for witch a profile window is created
	*/

	showProfile ( routeObjId ) {
		let profileWindow = this.#profileWindows.get ( routeObjId );
		if ( ! profileWindow ) {
			profileWindow = new ProfileWindow ( );
		}
		const route = theDataSearchEngine.getRoute ( routeObjId );
		profileWindow.update ( route );
		this.#profileWindows.set ( routeObjId, profileWindow );
	}

	/**
	This method is called when a profile window is closed
	@param {Number} objId The Route objId for witch a profile window is created
	*/

	onProfileClosed ( objId ) {
		this.#profileWindows.delete ( objId );
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of ProfileWindowsManager class
@type {ProfileWindowsManager}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theProfileWindowsManager = new ProfileWindowsManager ( );

export default theProfileWindowsManager;

/* --- End of file --------------------------------------------------------------------------------------------------------- */