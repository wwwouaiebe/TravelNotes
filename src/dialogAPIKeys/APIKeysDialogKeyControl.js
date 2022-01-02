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

import theTranslator from '../UILib/Translator.js';
import theConfig from '../data/Config.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import { APIKey } from '../coreLib/Containers.js';
import ObjId from '../data/ObjId.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Event listener for click event on the delete key button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DeleteButtonClickEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		const dispatchedEvent = new Event ( 'apikeydeleted' );
		dispatchedEvent.data = { objId : Number.parseInt ( clickEvent.target.dataset.tanObjId ) };
		clickEvent.target.parentNode.parentNode.dispatchEvent ( dispatchedEvent );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 the APIKey control for the APIKeysDialog. Display  HTML input elements for the providerName and the providerKey
and a button to remove the APIKey from the dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class APIKeysDialogKeyControl {

	/**
	The root HTML element of the control
	@type {HTMLElement}
	*/

	#rootHTMLElement;

	/**
	The providerName HTML input element
	@type {HTMLElement}
	*/

	#providerNameInput;

	/**
	The providerKey HTML input element
	@type {HTMLElement}
	*/

	#providerKeyInput;

	/**
	A unique ObjId given to the control
	@type {Number}
	*/

	#objId;

	/**
	The constructor
	@param {APIKey} apiKey The APIKey to display in the control
	*/

	constructor ( apiKey ) {

		this.#objId = ObjId.nextObjId;

		this.#rootHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-APIKeysDialog-ApiKeyRow'
			}
		);

		this.#providerNameInput = theHTMLElementsFactory.create (
			'input',
			{
				className : 'TravelNotes-APIKeysDialog-ApiKeyName TravelNotes-APIKeysDialog-Input',
				value : apiKey.providerName,
				placeholder : theTranslator.getText ( 'APIKeysDialogKeyControl - provider name' )
			},
			this.#rootHTMLElement
		);

		this.#providerKeyInput = theHTMLElementsFactory.create (
			'input',
			{
				className : 'TravelNotes-APIKeysDialog-ApiKeyValue TravelNotes-APIKeysDialog-Input',
				value : apiKey.providerKey,
				placeholder : theTranslator.getText ( 'APIKeysDialogKeyControl - API key' ),
				type : theConfig.APIKeysDialog.showAPIKeys ? 'text' : 'password'
			},
			this.#rootHTMLElement
		);

		theHTMLElementsFactory.create (
			'div',
			{
				className :
					'TravelNotes-BaseDialog-Button TravelNotes-APIKeysDialog-AtRightButton',
				title : theTranslator.getText ( 'APIKeysDialogKeyControl - delete API key' ),
				textContent : '❌',
				dataset : { ObjId : this.#objId }
			},
			this.#rootHTMLElement
		)
			.addEventListener ( 'click', new DeleteButtonClickEL ( ), false );
		Object.freeze ( this );
	}

	/**
	The ObjId of the control
	@type {Number}
	*/

	get objId ( ) { return this.#objId; }

	/**
	An array with the root HTML element of the control
	@type {Array.<HTMLElement>}
	*/

	get HTMLElements ( ) { return [ this.#rootHTMLElement ]; }

	/**
	The providerName
	@type {String}
	*/

	get providerName ( ) { return this.#providerNameInput.value; }

	/**
	The providerKey
	@type {String}
	*/

	get providerKey ( ) { return this.#providerKeyInput.value; }

	/**
	The APIKey
	@type {APIKey}
	*/

	get apiKey ( ) {
		return new APIKey ( this.#providerNameInput.value, this.#providerKeyInput.value );
	}

}

export default APIKeysDialogKeyControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */