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

import { ZERO, ONE, NOT_FOUND } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
iterator for Collection class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class CollectionIterator {

	/**
	The collection used by the iterator
	@type {Collection}
	*/

	#collection = null;

	/**
	The current index
	@type {Number}
	*/

	#index = NOT_FOUND;

	/**
	The constructor
	@param {Collection} collection The collection for witch the iterator is used
	*/

	constructor ( collection ) {
		Object.freeze ( this );
		this.#collection = collection;
	}

	/**
	The object pointed by the iterator
	@type {TravelObject}
	*/

	get value ( ) { return this.#index < this.#collection.length ? this.#collection.at ( this.#index ) : null; }

	/**
	The object before the object pointed by the iterator or null if iterator is on the first object
	@type {TravelObject}
	*/

	get previous ( ) { return ZERO >= this.#index ? null : this.#collection.at ( this.#index - ONE ); }

	/**
	The object after the object pointed by the iterator or null if iterator is on the last object
	@type {TravelObject}
	*/

	get next ( ) { return this.#index < this.#collection.length - ONE ? this.#collection.at ( this.#index + ONE ) : null; }

	/**
	Move the iterator to the next object and return true when the end of the Collection is reached
	@type {Boolean}
	*/

	get done ( ) { return ++ this.#index >= this.#collection.length; }

	/**
	returns true when the iterator is on the first object
	@type {Boolean}
	*/

	get first ( ) { return ZERO === this.#index; }

	/**
	returns true when the iterator is on the last object
	@type {Boolean}
	*/

	get last ( ) { return this.#index >= this.#collection.length - ONE; }

	/**
	returns The position of the iterator in the Collection
	@type {Number}
	*/

	get index ( ) { return this.#index; }
}

export default CollectionIterator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */