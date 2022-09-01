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
Doc reviewed ...
Tests ...
*/
/* ------------------------------------------------------------------------------------------------------------------------- */
/**
An object returned by the sanitizeToUrl function
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class UrlValidationResult {

	/**
	The validated url or an empty string if the url is invalid
	@type {String}
	*/

	#url;

	/**
	An empty string or an error description if the url is invalid
	@type {String}
	*/

	#errorsString;

	/**
	The constructor
	@param {String} url The validated url or an empty string if the url is invalid
	@param {String} errorsString An empty string or an error description if the url is invalid
	*/

	constructor ( url, errorsString ) {
		Object.freeze ( this );
		this.#url = url;
		this.#errorsString = errorsString;
	}

	/**
	The validated url or an empty string if the url is invalid
	@type {String}
	*/

	get url ( ) { return this.#url; }

	/**
	An empty string or an error description if the url is invalid
	@type {String}
	*/

	get errorsString ( ) { return this.#errorsString; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
An object returned by the sanitizeToHtmlString function
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class HtmlStringValidationResult {

	/**
	The validated string
	@type {String}
	*/

	#htmlString;

	/**
	An empty string or an error description if the url is invalid
	@type {String}
	*/

	#errorsString;

	/**
	The constructor
	@param {String} htmlString The validated string
	@param {String} errorsString An empty string or an error description if the url is invalid
	*/

	constructor ( htmlString, errorsString ) {
		Object.freeze ( this );
		this.#htmlString = htmlString;
		this.#errorsString = errorsString;
	}

	/**
	The validated string
	@type {String}
	*/

	get htmlString ( ) { return this.#htmlString; }

	/**
	An empty string or an error description if the url is invalid
	@type {String}
	*/

	get errorsString ( ) { return this.#errorsString; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
this class contains the validity map for the HTMLSanitizer
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class HTMLSanitizerData {

	/**
	The validity map
	@type {Map}
	*/

	#validityMap = new Map ( );

	/**
	The constructor
	*/

	constructor ( ) {

		Object.freeze ( this );

		/*
		WARNING :

			never put script as valid tag !!!

			never put event handler starting with on... as valid attribute !!!

		*/

		this.#validityMap.set ( 'a', [ 'href', 'target' ] );
		this.#validityMap.set ( 'div', [ ] );
		this.#validityMap.set ( 'del', [ ] );
		this.#validityMap.set ( 'em', [ ] );
		this.#validityMap.set ( 'figcaption', [ ] );
		this.#validityMap.set ( 'figure', [ ] );
		this.#validityMap.set ( 'h1', [ ] );
		this.#validityMap.set ( 'h2', [ ] );
		this.#validityMap.set ( 'h3', [ ] );
		this.#validityMap.set ( 'h4', [ ] );
		this.#validityMap.set ( 'h5', [ ] );
		this.#validityMap.set ( 'h6', [ ] );
		this.#validityMap.set ( 'hr', [ ] );
		this.#validityMap.set ( 'img', [ 'src', 'alt', 'width', 'height' ] );
		this.#validityMap.set ( 'ins', [ ] );
		this.#validityMap.set ( 'li', [ ] );
		this.#validityMap.set ( 'mark', [ ] );
		this.#validityMap.set ( 'ol', [ ] );
		this.#validityMap.set ( 'p', [ ] );
		this.#validityMap.set ( 's', [ ] );
		this.#validityMap.set ( 'small', [ ] );
		this.#validityMap.set ( 'strong', [ ] );
		this.#validityMap.set ( 'span', [ ] );
		this.#validityMap.set ( 'sub', [ ] );
		this.#validityMap.set ( 'sup', [ ] );
		this.#validityMap.set ( 'ul', [ ] );

		this.#validityMap.set ( 'svg', [ 'xmlns', 'viewBox', 'class' ] );
		this.#validityMap.set ( 'text', [ 'x', 'y', 'text-anchor' ] );
		this.#validityMap.set ( 'polyline', [ 'points', 'class', 'transform' ] );

		this.#validityMap.set ( '\u0023text', [] );
	}

	/**
	get the valid attributes for a node name
	@param {String} nodeName the name of the node for witch the valid attrbutes are asked.
	Warning: the node name must be a valid node name verified with the getValidNodeName.
	@return {Array.<String>} the valid attributes names
	*/

	getValidAttributesNames ( nodeName ) {
		return this.#validityMap.get ( nodeName ).concat ( [ 'id', 'class', 'dir', 'title' ] );
	}

	/**
	verify that a node name is a valid node name
	@param {String} nodeName The node name
	@return {String} the node name or an empty string if the given node name is invalid
	*/

	getValidNodeName ( nodeName ) {
		const validNodeName = nodeName.toLowerCase ( );
		return this.#validityMap.get ( validNodeName ) ? validNodeName : '';
	}

}

export { HTMLSanitizerData, HtmlStringValidationResult, UrlValidationResult };

/* --- End of file --------------------------------------------------------------------------------------------------------- */