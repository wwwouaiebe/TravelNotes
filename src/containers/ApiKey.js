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
A simple container to store a provider name and a provider api key
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ApiKey {

	/**
	The provider name
	@type {String}
	*/

	#providerName;

	/**
	The provider api key
	@type {String}
	*/

	#providerKey;

	/**
	The constructor
	@param {String} providerName The provider name
	@param {String} providerKey The provider api key
	*/

	constructor ( providerName, providerKey ) {
		Object.freeze ( this );
		this.#providerName = 'string' === typeof ( providerName ) ? providerName : '';
		this.#providerKey = 'string' === typeof ( providerKey ) ? providerKey : '';
	}

	/**
	The provider name
	@type {String}
	*/

	get providerName ( ) { return this.#providerName; }

	/**
	The provider api key
	@type {String}
	*/

	get providerKey ( ) { return this.#providerKey; }

	/**
	An object literal with the ApiKey properties and without any methods.
	This object can be used with the JSON object
	@type {JsonObject}
	*/

	get jsonObject ( ) { return { providerName : this.providerName, providerKey : this.providerKey }; }

}

export default ApiKey;

/* --- End of file --------------------------------------------------------------------------------------------------------- */