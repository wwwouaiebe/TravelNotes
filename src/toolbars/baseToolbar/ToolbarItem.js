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
	@param {String|function} textContent The text displayed on the toolbar button
	@param {String} title The tooltip text of the toolbar button
	@param {function|String} action The action to be performed when the user click on the button. Can be a function or a link
	*/

	constructor ( textContent, title, action ) {
		this.#textContent = textContent;
		this.#textContent = 'function' === typeof ( textContent ) ? textContent ( ) : textContent;
		this.#title = title;
		this.#action = action;
	}

	/**
	The text displayed on the toolbar button
	@type {String}
	*/

	get textContent ( ) { return this.#textContent; }

	/**
	The tooltip text of the toolbar button
	@type {String}
	*/

	get title ( ) { return this.#title; }

	/**
	Execute the action registered for the item
	*/

	doAction ( ) {
		switch ( typeof ( this.#action ) ) {
		case 'string' :
			{
				const linkElement = document.createElement ( 'a' );
				linkElement.href = this.#action;
				linkElement.target = '_blank';
				linkElement.click ( );
			}
			break;
		case 'function' :
			this.#action ( );
			break;
		default :
			break;
		}
	}
}

export default ToolbarItem;

/* --- End of file --------------------------------------------------------------------------------------------------------- */