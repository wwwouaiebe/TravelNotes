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
	- v1.0.0:
		- created
	- v1.4.0:
		- added next and previous method
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v1.8.0:
		- Issue ♯100 : Fix circular dependancies with Collection
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
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