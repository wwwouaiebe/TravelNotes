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
Doc reviewed 20210915
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class used for RouteProviders
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseRouteProvider {

	/**
	The user language
	@type {String}
	*/

	#userLanguage;

	/**
	A reference to the edited route
	@type {Route}
	*/

	/* eslint-disable-next-line no-unused-private-class-members */
	#route;

	/**
	Call the provider, using the waypoints defined in the route and, on success,
	complete the route with the data from the provider
	@param {function} onOk the Promise Success handler
	@param {function} onError the Promise Error handler

	*/

	/* eslint-disable-next-line no-unused-vars */
	#getRoute ( onOk, onError ) {

		// to be implemented in the derived classes
	}

	/**
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#userLanguage = 'fr';
	}

	/**
	Call the provider, using the waypoints defined in the route and, on success,
	complete the route with the data from the provider
	@param {Route} route The route to witch the data will be added
	@return {Promise} A Promise. On success, the Route is completed with the data given by the provider.
	*/

	getPromiseRoute ( route ) {
		this.#route = route;
		return new Promise ( ( onOk, onError ) => this.#getRoute ( onOk, onError ) );
	}

	/**
	The icon used in the ProviderToolbarUI.
	Must be overloaded in the derived classes
	@type {String}
	*/

	get icon ( ) {
		return '' +
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAAAC0Ujn1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjw' +
			'v8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAArSURBVEhL7cyxDQAgAAQh91/67ektTI4BOHumGtWoRjWqUY1qVKMaP9bbBZKXgg' +
			'u6NeCUAAAAAElFTkSuQmCC';
	}

	/**
	The provider name.
	Must be overloaded in the derived classes
	@type {String}
	*/

	get name ( ) { return ''; }

	/**
	The title to display in the ProviderToolbarUI button.
	Must be overloaded in the derived classes
	@type {String}
	*/

	get title ( ) { return ''; }

	/**
	The possible transit modes for the provider.
	Must be overloaded in the derived classes.
	Must be a subarray of [ 'bike', 'pedestrian', 'car', 'train', 'line', 'circle' ]
	@type {Array.<String>}
	*/

	get transitModes ( ) { return [ ]; }

	/**
	A boolean indicating when a provider key is needed for the provider.
	Must be overloaded in the derived classes
	@type {Boolean}
	*/

	get providerKeyNeeded ( ) { return true; }

	/**
	The user language.
	@type {String}
	*/

	get userLanguage ( ) { return this.#userLanguage; }
	set userLanguage ( userLanguage ) {
		this.#userLanguage = userLanguage;
	}
}

export default BaseRouteProvider;

/* --- End of file --------------------------------------------------------------------------------------------------------- */