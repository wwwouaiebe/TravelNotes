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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210915
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class contains methods for accessing the window.indexedDb.
See theIndexedDb for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class IndexedDb {

	/**
	A reference to the opened indexedDB
	@type {IDBFactory}
	*/

	#indexedDb;

	/**
	The UUID of the current travel
	@type {String}
	*/

	#UUID;

	/**
	A temp variable used to store the data to write in the indexedDb
	@type {String}
	*/

	#data;

	/**
	The version of the db to use
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #DB_VERSION ( ) { return 1; }

	/**
	Perform the open operations
	@param {function} onOk the Ok handler for the Promise
	@param {function} onError the error handler for the Promise
	*/

	#open ( onOk, onError ) {
		if ( this.#indexedDb ) {
			onOk ( );
			return;
		}
		const openRequest = window.indexedDB.open ( 'TravelNotesDb', IndexedDb.#DB_VERSION );
		openRequest.onerror = ( ) => {
			this.#indexedDb = null;
			onError ( new Error ( 'Not possible to open the db' ) );
		};
		openRequest.onsuccess = successEvent => {
			this.#indexedDb = successEvent.target.result;
			onOk ( );
		};
		openRequest.onupgradeneeded = upgradeEvent => {
			this.#indexedDb = upgradeEvent.target.result;
			this.#indexedDb.createObjectStore ( 'Travels', { keyPath : 'UUID' } );
		};
	}

	/**
	Perform the read operations
	@param {function} onOk the Ok handler for the Promise
	@param {function} onError the error handler for the Promise
	*/

	#read ( onOk, onError ) {
		if ( ! this.#indexedDb ) {
			onError ( new Error ( 'Database not opened' ) );
			return;
		}
		const transaction = this.#indexedDb.transaction ( [ 'Travels' ], 'readonly' );
		transaction.onerror = ( ) => onError ( new Error ( 'Transaction error' ) );

		const travelsObjectStore = transaction.objectStore ( 'Travels' );
		const getRequest = travelsObjectStore.get ( this.#UUID );
		getRequest.onsuccess = successEvent => onOk ( successEvent.target.result ? successEvent.target.result.data : null );
	}

	/**
	Perform the write operations
	@param {function} onOk the Ok handler for the Promise
	@param {function} onError the error handler for the Promise
	*/

	#write ( onOk, onError ) {
		if ( ! this.#indexedDb ) {
			onError ( new Error ( 'Database not opened' ) );
			return;
		}
		const transaction = this.#indexedDb.transaction ( [ 'Travels' ], 'readwrite' );
		transaction.onerror = ( ) => onError ( new Error ( 'Transaction error' ) );
		const travelsObjectStore = transaction.objectStore ( 'Travels' );
		const putRequest = travelsObjectStore.put ( { UUID : this.#UUID, data : this.#data } );
		putRequest.onsuccess = ( ) => onOk ( );
	}

	/**
	Perform the close operations
	*/

	#close ( ) {
		this.#indexedDb.close ( );
		this.#indexedDb = null;
	}

	/**
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Open the indexedDb
	@return {Promise} A Promise  that fullfil when the indexedDb is opened or reject when a problem occurs
	*/

	getOpenPromise ( ) {
		return new Promise ( ( onOk, onError ) => this.#open ( onOk, onError ) );
	}

	/**
	Read data in the indexedDb.
	@param {String} UUID An UUID used to identify the data in the indexedDb
	@return {Promise} A promise that fullfil when the data are read or reject when a problem occurs
	The success handler receive the data as parameter
	*/

	getReadPromise ( UUID ) {
		this.#UUID = UUID;
		return new Promise ( ( onOk, onError ) => this.#read ( onOk, onError ) );
	}

	/**
	Write data in the indexedDb.
	@param {String} UUID An UUID used to identify the data in the indexedDb
	@param {String} data The data to put in the indexedDb
	@return {Promise} A promise that fullfil when the data are written or reject when a problem occurs
	*/

	getWritePromise ( UUID, data ) {
		this.#UUID = UUID;
		this.#data = data;

		return new Promise ( ( onOk, onError ) => this.#write ( onOk, onError ) );
	}

	/**
	Remove the data in the indexedDb and close it
	@param {String} UUID An UUID used to identify the data in the indexedDb
	*/

	closeDb ( UUID ) {
		if ( ! this.#indexedDb ) {
			return;
		}
		if ( ! UUID ) {
			this.#close ( );
			return;
		}

		const transaction = this.#indexedDb.transaction ( [ 'Travels' ], 'readwrite' );
		transaction.onerror = ( ) => { };
		const travelsObjectStore = transaction.objectStore ( 'Travels' );

		const deleteRequest = travelsObjectStore.delete ( UUID );
		deleteRequest.onerror = ( ) => this.#close ( );
		deleteRequest.onsuccess = ( ) => this.#close ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of IndexedDb class
@type {IndexedDb}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theIndexedDb = new IndexedDb ( );

export default theIndexedDb;

/* --- End of file --------------------------------------------------------------------------------------------------------- */