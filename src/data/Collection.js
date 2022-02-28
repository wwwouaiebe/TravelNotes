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

import { ZERO, ONE, NEXT, PREVIOUS, TWO, NOT_FOUND } from '../main/Constants.js';

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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Class used to store objects in an iterable
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class Collection {

	/**
	The array where objects are stored
	@type {Array.<Object>}
	*/

	#array;

	/**
	The class name of objects stored in the collection
	@type {String}
	*/

	#objName;

	/**
	The class definition of objects stored in the collection
	@type {Class}
	*/

	#classCollection;

	/**
	Return the position of an object in the Collection
	@param {Number} objId The objId of the object to locate
	@return {Number} the position of the object in the Collection
	*/

	#indexOfObjId ( objId ) {
		return this.#array.findIndex (
			element => element.objId === objId
		);
	}

	/**
	Gives the previous or next object in the collection that fullfil a given condition
	@param {Number} objId The objId of the object from witch the search start
	@param {?function} condition A fonction used to compare the objects. If null, ( ) => true is used
	@param {Number} direction The direction to follow. Must be NEXT or PREVIOUS
	@return {?Object} An object or null if nothing found
	*/

	#nextOrPrevious ( objId, condition, direction ) {
		let index = this.#indexOfObjId ( objId );
		if ( NOT_FOUND === index ) {
			throw new Error ( 'invalid objId for next or previous function' );
		}
		if ( direction !== NEXT && direction !== PREVIOUS ) {
			throw new Error ( 'invalid direction' );
		}

		let otherCondition = condition;
		if ( ! otherCondition ) {
			otherCondition = ( ) => true;
		}
		index += direction;

		while ( ( NOT_FOUND < index ) && ( index < this.#array.length ) && ! otherCondition ( this.#array [ index ] ) ) {
			index += direction;
		}
		if ( NOT_FOUND === index || this.#array.length === index ) {
			return null;
		}

		return this.#array [ index ];
	}

	/**
	The constructor
	@param {class} classCollection The class of objects that have to be stored in the collection
	*/

	constructor ( classCollection ) {
		Object.freeze ( this );
		this.#array = [];
		this.#classCollection = classCollection;
		const tmpObject = new classCollection ( );
		if ( ( ! tmpObject.objType ) || ( ! tmpObject.objType.name ) ) {
			throw new Error ( 'invalid object name for collection' );
		}
		this.#objName = tmpObject.objType.name;
	}

	/**
	Add an object at the end of the collection
	@param {TravelObject} object The object to add
	*/

	add ( object ) {
		if ( ( ! object.objType ) || ( ! object.objType.name ) || ( object.objType.name !== this.#objName ) ) {
			throw new Error ( 'invalid object name for add function' );
		}
		this.#array.push ( object );
	}

	/**
	Search an object in the collection with the index
	@param {Number} index The position of the desired object in the array
	@return {?Object} The object at the position or null if not found
	*/

	at ( index ) {
		return ( index < this.#array.length && index > NOT_FOUND ) ? this.#array [ index ] : null;
	}

	/**
	Executes a function on each object of the Collection and returns the final result
	@param {function} funct The function to execute
	*/

	forEach ( funct ) {
		let result = null;
		const iterator = this.iterator;
		while ( ! iterator.done ) {
			result = funct ( iterator.value, result );
		}
		return result;
	}

	/**
	Search an object in the Collection
	@param {Number} objId The objId of the object to search
	@return {TravelObject} the object with the given objId or null when the object is not found
	*/

	getAt ( objId ) {
		const index = this.#indexOfObjId ( objId );
		return NOT_FOUND === index ? null : this.#array [ index ];
	}

	/**
	Move an object near another object in the Collection
	@param {Number} objId The objId of the object to move
	@param {Number} targetObjId The objId of the object near witch the object will be moved
	@param {Boolean} moveBefore When true, the object is moved before the target, when false after the target
	*/

	moveTo ( objId, targetObjId, moveBefore ) {
		let oldPosition = this.#indexOfObjId ( objId );
		let newPosition = this.#indexOfObjId ( targetObjId );
		if ( NOT_FOUND === oldPosition || NOT_FOUND === newPosition ) {
			throw new Error ( 'invalid objId for function  myMoveTo' );
		}
		if ( ! moveBefore ) {
			newPosition ++;
		}
		this.#array.splice ( newPosition, ZERO, this.#array [ oldPosition ] );
		if ( newPosition < oldPosition ) {
			oldPosition ++;
		}
		this.#array.splice ( oldPosition, ONE );
	}

	/**
	gives the next object in the collection that fullfil a given condition
	@param {Number} objId The objId of the object from witch the search start
	@param {?function} condition A fonction used to compare the objects. If null, ( ) => true is used
	@return {?Object} An object or null if nothing found
	*/

	next ( objId, condition ) { return this.#nextOrPrevious ( objId, condition, NEXT ); }

	/**
	gives the previous object in the collection that fullfil a given condition
	@param {Number} objId The objId of the object from witch the search start
	@param {?function} condition A fonction used to compare the objects. If null, ( ) => true is used
	@return {?Object} An object or null if nothing found
	*/

	previous ( objId, condition ) { return this.#nextOrPrevious ( objId, condition, PREVIOUS ); }

	/**
	Remove an object from the Collection
	@param {Number} objId The objId of the object to remove
	*/

	remove ( objId ) {
		const index = this.#indexOfObjId ( objId );
		if ( NOT_FOUND === index ) {
			throw new Error ( 'invalid objId for remove function' );
		}
		this.#array.splice ( index, ONE );
	}

	/**
	Remove all objects from the Collection
	@param {?boolean} exceptFirstLast When true, first and last objects are not removed
	*/

	removeAll ( exceptFirstLast ) {
		if ( exceptFirstLast ) {
			this.#array.splice ( ONE, this.#array.length - TWO );
		}
		else {
			this.#array.length = ZERO;
		}
	}

	/**
	Replace an object in the Collection with another object
	@param {Number} oldObjId the objId of the object to replace
	@param {TravelObject} newObject The new object
	*/

	replace ( oldObjId, newObject ) {
		const index = this.#indexOfObjId ( oldObjId );
		if ( NOT_FOUND === index ) {
			throw new Error ( 'invalid objId for replace function' );
		}
		if ( ( ! newObject.objType ) || ( ! newObject.objType.name ) || ( newObject.objType.name !== this.#objName ) ) {
			throw new Error ( 'invalid object name for replace function' );
		}
		this.#array [ index ] = newObject;
	}

	/**
	Reverse the objects in the collection
	*/

	reverse ( ) { this.#array.reverse ( ); }

	/**
	Sort the collection, using a function
	@param {function} compareFunction The function to use to compare objects in the Collection
	*/

	sort ( compareFunction ) { this.#array.sort ( compareFunction ); }

	/**
	Reverse an Object with the previous or next object in the Collection
	@param {Number} objId The objId of the object to swap
	@param {Boolean} swapUp When true the object is swapped with the previous one,
	when false with the next one
	*/

	swap ( objId, swapUp ) {
		const index = this.#indexOfObjId ( objId );
		if (
			( NOT_FOUND === index )
			||
			( ( ZERO === index ) && swapUp )
			||
			( ( this.#array.length - ONE === index ) && ( ! swapUp ) )
		) {
			throw new Error ( 'invalid objId for swap function' );
		}
		const swap = swapUp ? PREVIOUS : NEXT;
		const tmp = this.#array [ index ];
		this.#array [ index ] = this.#array [ index + swap ];
		this.#array [ index + swap ] = tmp;
	}

	/**
	The first object of the Collection
	@type {TravelObject}
	*/

	get first ( ) { return this.#array [ ZERO ]; }

	/**
	An iterator on the Collection. See CollectionIterator
	@type {CollectionIterator}

	*/

	get iterator ( ) {
		return new CollectionIterator ( this );
	}

	/**
	The last object of the Collection
	@type {TravelObject}
	*/

	get last ( ) { return this.#array [ this.#array.length - ONE ]; }

	/**
	The length of the Collection
	@type {Number}
	*/

	get length ( ) { return this.#array.length; }

	/**
	an Array with the objects in the collection
	@type {Array}
	*/

	get jsonObject ( ) {
		const array = [ ];
		const iterator = this.iterator;
		while ( ! iterator.done ) {
			array.push ( iterator.value.jsonObject );
		}

		return array;
	}

	set jsonObject ( something ) {
		this.#array.length = ZERO;

		if ( ! Array.isArray ( something ) ) {
			return;
		}

		something.forEach (
			arrayObject => {
				const newObject = new this.#classCollection ( );
				newObject.jsonObject = arrayObject;
				this.add ( newObject );
			}
		);
	}
}

export default Collection;

/* --- End of file --------------------------------------------------------------------------------------------------------- */