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
	- v1.6.0:
		- created
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...

-------------------------------------------------------------------------------------------------------------------------------
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is used to encrypt an decrypt data with a password
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DataEncryptor {

	/**
	Salt to be used for encoding and decoding operations.
	@type {String}
	*/

	#salt;

	/* eslint-disable no-magic-numbers */

	/**
	Call the importKey() method of the SubtleCrypto interface
	@param {Uint8Array} pswd The password to use, encode with TextEncoder.encode ( )
	@return {Promise} a Promise that fulfills with the imported key as a CryptoKey object
	*/

	#importKey ( pswd ) {
		return window.crypto.subtle.importKey (
			'raw',
			pswd,
			{ name : 'PBKDF2' },
			false,
			[ 'deriveKey' ]
		);
	}

	/**
	Call the deriveKey() method of the SubtleCrypto interface
	@param {CryptoKey} masterKey the CryptoKey returned by the onOk handler of the Promise returned by #importKey
	@param {String} salt The salt to use
	@return {Promise} a Promise which will be fulfilled with a CryptoKey object representing the secret key derived
	from the master key
	*/

	#deriveKey ( masterKey, salt ) {
		return window.crypto.subtle.deriveKey (
			{
				name : 'PBKDF2',
				salt : new window.TextEncoder ( ).encode ( salt ),
				iterations : 1000000,
				hash : 'SHA-256'
			},
			masterKey,
			{
				name : 'AES-GCM',
				length : 256
			},
			false,
			[ 'encrypt', 'decrypt' ]
		);
	}

	/**
	Call the decrypt() method of the SubtleCrypto interface
	@param {CryptoKey} decryptKey The key to use for decryption
	@param {Uint8Array} data The data to decode
	@return {Promise} a Promise which will be fulfilled with the decrypted data as a Uint8Array.
	Use TextDecoder.decode ( ) to transform to string
	*/

	#decrypt ( decryptKey, data ) {
		return window.crypto.subtle.decrypt (
			{
				name : 'AES-GCM',
				iv : new Uint8Array ( data.slice ( 0, 16 ) )
			},
			decryptKey,
			new Uint8Array ( data.slice ( 16 ) )
		);
	}

	/**
	Call the encrypt() method of the SubtleCrypto interface
	@param {CryptoKey} encryptKey The key to use for encryption
	@param {Uint8Array} ivBytes A Uint8Array with random values used for encoding
	@param {Uint8Array} data the data to encode transformed to a Uint8Array with TextEncoder.encode ( )
	@return {Promise} a Promise which will be fulfilled with the encrypted data as a Uint8Array
	*/

	#encrypt ( encryptKey, ivBytes, data ) {
		return window.crypto.subtle.encrypt (
			{
				name : 'AES-GCM',
				iv : ivBytes
			},
			encryptKey,
			data
		);
	}

	/**
	The constructor
	@param {String} salt Salt to be used for encoding and decoding operations. If none, a default value is provided.
	*/

	constructor ( salt ) {
		this.#salt = salt || 'Tire la chevillette la bobinette cherra. Le Petit Chaperon rouge tira la chevillette.';
		Object.freeze ( this );
	}

	/* eslint-disable max-params */

	/**
	This method encrypt data with a password
	@param {Uint8Array} data The data to encrypt. See TextEncoder ( ) to transform string to Uint8Array
	@param {function} onOk A function to execute when the encryption succeeds
	@param {function} onError A function to execute when the encryption fails
	@param {Promise} pswdPromise A Promise that fullfil with a password. Typically a dialog...
	*/

	encryptData ( data, onOk, onError, pswdPromise ) {
		let ivBytes = window.crypto.getRandomValues ( new Uint8Array ( 16 ) );
		pswdPromise
			.then ( pswd => this.#importKey ( pswd ) )
			.then ( deriveKey => this.#deriveKey ( deriveKey, this.#salt ) )
			.then ( encryptKey => this.#encrypt ( encryptKey, ivBytes, data ) )
			.then (
				cipherText => {
					onOk (
						new Blob (
							[ ivBytes, new Uint8Array ( cipherText ) ],
							{ type : 'application/octet-stream' }
						)
					);
				}
			)
			.catch ( onError );
	}

	/**
	This method decrypt data with a password
	@param {Uint8Array} data The data to decrypt. See TextDecoder ( ) to transform Uint8Array to string
	@param {function} onOk A function to execute when the decryption succeeds
	@param {function} onError A function to execute when the decryption fails
	@param {Promise} pswdPromise A Promise that fullfil with a password. Typically a dialog...
	*/

	decryptData ( data, onOk, onError, pswdPromise ) {
		pswdPromise
			.then ( pswd => this.#importKey ( pswd ) )
			.then ( deriveKey => this.#deriveKey ( deriveKey, this.#salt ) )
			.then ( decryptKey => this.#decrypt ( decryptKey, data ) )
			.then ( onOk )
			.catch ( onError );
	}
	/* eslint-enable max-params */
	/* eslint-enable no-magic-numbers */
}

export default DataEncryptor;

/* --- End of file --------------------------------------------------------------------------------------------------------- */