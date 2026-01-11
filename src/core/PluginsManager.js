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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Plugins manager

Warning 2026-01 : due to problems with terser (terser don't recognize dynamic import) it's needed to deactivate terser in the
AppBuilder if you will add a plugin coming from and independant js file.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PluginsManager {

   	/**
	A JS map with the provider objects. Providers objects are created and added by the plugins
	@type {Map.<BaseRouteProvider>}
	*/

	#providers;

	/**
	A JS map with the provider objects. Providers objects are created and added by the plugins
	@type {Map.<BaseRouteProvider>}
	*/

	get providers ( ) { return this.#providers; }

	/**
	 * Add a provider
	 * @param {Class} providerClass the class created for the new provider. This class must be derived from BaseRouteProvider.
	 */

	addProvider ( providerClass ) {
		const provider = new providerClass ( );
		const providerName = provider.name.toLowerCase ( );
		if ( ! this.#providers.get ( providerName ) ) {
			this.#providers.set ( providerName, provider );
		}
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
		this.#providers = new Map ( );
	}
}

/**
 * The one and only ont instance of the class PluginsManager
 */

const thePluginsManager = new PluginsManager;

export default thePluginsManager;

/* --- End of file --------------------------------------------------------------------------------------------------------- */