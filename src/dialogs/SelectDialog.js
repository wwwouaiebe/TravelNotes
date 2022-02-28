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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import BaseDialog from '../dialogBase/BaseDialog.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import { ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container to store the The text to be displayed as option HTMLElement and an objId linked to this text
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SelectOptionData {

	/**
	The text to be displayed as option HTMLElement
	@type {String}
	*/

	#text;

	/**
	An objId
	@type {Number}
	*/

	#objId;

	/**
	The constructor
	@param {String} text The text to be displayed as option HTMLElement
	@param {Number} objId An objId
	*/

	constructor ( text, objId ) {
		Object.freeze ( this );
		this.#text = text;
		this.#objId = objId;
	}

	/**
	The text to be displayed as option HTMLElement
	@type {String}
	*/

	get text ( ) { return this.#text; }

	/**
	An objId
	@type {Number}
	*/

	get objId ( ) { return this.#objId; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Simple dialog with a text and a select element
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SelectDialog extends BaseDialog {

	/**
	The selector
	@type {HTMLElement}
	*/

	#selectHtmlElement;

	/**
	the selector container
	@type {HTMLElement}
	*/

	get #selectDiv ( ) {
		const selectDiv = theHTMLElementsFactory.create ( 'div' );
		this.#selectHtmlElement = theHTMLElementsFactory.create ( 'select', null, selectDiv );
		this.options.selectOptionsData.forEach (
			optionData => theHTMLElementsFactory.create (
				'option',
				{
					text : optionData.text
				},
				this.#selectHtmlElement
			)
		);
		this.#selectHtmlElement.selectedIndex = ZERO;
		return selectDiv;
	}

	/**
	The constructor
	@param {DialogOptions|Object} options An Object with the needed options. See DialogOptions class.
	*/

	constructor ( options ) {
		super ( options );
	}

	/**
	Get the title of the dialog. Can be overloaded in the derived classes
	@type {String}
	*/

	get title ( ) { return this.options.title || ''; }

	/**
	Get an array with the HTMLElements that have to be added in the content of the dialog.
	Can be overloaded in the derived classes
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [
			theHTMLElementsFactory.create (
				'div',
				{
					textContent : this.options.text || ''
				}
			),
			this.#selectDiv
		];
	}

	/**
	Overload of the BaseDialog.onOk ( ) method.
	*/

	onOk ( ) {
		super.onOk ( this.options.selectOptionsData [ this.#selectHtmlElement.selectedIndex ].objId );
	}

}

export { SelectOptionData, SelectDialog };

/* --- End of file --------------------------------------------------------------------------------------------------------- */