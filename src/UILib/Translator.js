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
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v2.0.0:
		- Issue ♯137 : Remove html tags from json files
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210915
Tests ...
*/

import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is used to translate the messages in another language
See theTranslator for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class Translator {

	/**
	A js Map where the translations are stored, ordered by msgid
	@type {Map.<String>}
	*/

	#translations = new Map ( );

	/**
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Load the translations
	@param {JsonObject} translations The translations to load
	*/

	setTranslations ( translations ) {
		translations.forEach (
			translation => this.#translations.set (
				translation.msgid,
				theHTMLSanitizer.sanitizeToJsString ( translation.msgstr )
			)
		);
	}

	/**
	get a message translated
	@param {String} msgid The id to identify the message
	@param {?Object} params Parameters to include in the message
	@return {String} The message corresponding to the id, eventually with params added, or the
	id if the corresponding Translation was not found
	*/

	getText ( msgid, params ) {
		let translation = this.#translations.get ( msgid );
		if ( params && translation ) {
			Object.getOwnPropertyNames ( params ).forEach (
				propertyName => translation = translation.replace ( '{' + propertyName + '}', params [ propertyName ] )
			);
		}
		return translation ? translation : msgid;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of Translator class
@type {Translator}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theTranslator = new Translator ( );

export default theTranslator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */