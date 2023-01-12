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
Doc reviewed ...
Tests ...
*/

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

export default HtmlStringValidationResult;

/* --- End of file --------------------------------------------------------------------------------------------------------- */