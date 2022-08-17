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
	- v4.0.0:
		- created
Doc reviewed ...
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Simple container for toolbar buttons content
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ToolbarItem {

	/**
	The text displayed on the toolbar button
	@type {String}
	*/

	#textContent;

	/**
	The tooltip text of the toolbar button
	@type {String}
	*/

	#title;

	/**
	The action to be performed when the user click on the button. Can be a function or a link
	@type {function|String}
	*/

	#action;

	/**
	The constructor
	@param {String} textContent The text displayed on the toolbar button
	@param {String} title The tooltip text of the toolbar button
	@param {function|String} action The action to be performed when the user click on the button. Can be a function or a link
	*/

	constructor ( textContent, title, action ) {
		this.#textContent = textContent;
		this.#title = title;
		this.#action = action;
	}

	/**
	The text displayed on the toolbar button
	@type {String}
	*/

	get textContent ( ) {
		return 'function' === typeof ( this.#textContent ) ? this.#textContent ( ) : this.#textContent;
	}

	/**
	The tooltip text of the toolbar button
	@type {String}
	*/

	get title ( ) { return this.#title; }

	/**
	The action to be performed when the user click on the button. Can be a function or a link
	@type {function|String}
	*/

	get action ( ) { return this.#action; }

	/**
	Test if the button is a link
	@return {boolean} true when the button is a link
	*/

	isLink ( ) { return 'string' === typeof ( this.#action ); }

	/**
	Test if the button is a command
	@return {boolean} true when the button is a command
	*/

	isCommand ( ) { return 'function' === typeof ( this.#action ); }
}

export default ToolbarItem;

/* --- End of file --------------------------------------------------------------------------------------------------------- */