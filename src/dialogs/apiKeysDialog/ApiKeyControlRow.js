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
	-v 4.0.0:
		- Issue ♯48 : Review the dialogs
Doc reviewed 20220827
*/

import theTranslator from '../../core/uiLib/Translator.js';
import theConfig from '../../data/Config.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import ApiKey from '../../containers/ApiKey.js';
import ObjId from '../../data/ObjId.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 the ApiKey control row for the ApiKeysDialog. Display  HTML input elements for the providerName and the providerKey
and a button to remove the ApiKey from the dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ApiKeyControlRow {

	/**
	The root HTML element of the control
	@type {HTMLElement}
	*/

	#rowHTMLElement;

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
	The event listener for the delete button
	@type {deleteApiKeyButtonClickEL}
	*/

	#deleteApiKeyButtonClickEL;

	/**
	The delete button
	@type {HTMLElement}
	*/

	#deleteButtonHTMLElement;

	/**
	The constructor
	@param {ApiKey} apiKey The ApiKey to display in the control
	@param {DeleteApiKeyButtonClickEL} deleteApiKeyButtonClickEL The event listener to use for the delete button
	*/

	constructor ( apiKey, deleteApiKeyButtonClickEL ) {
		Object.freeze ( this );
		this.#deleteApiKeyButtonClickEL = deleteApiKeyButtonClickEL;
		this.#objId = ObjId.nextObjId;
		this.#rowHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FlexRow'
			}
		);
		this.#providerNameInput = theHTMLElementsFactory.create (
			'input',
			{
				className : 'TravelNotes-ApiKeysDialog-ApiKeyName TravelNotes-ApiKeysDialog-Input',
				value : apiKey.providerName,
				placeholder : theTranslator.getText ( 'ApiKeyControlRow - provider name' )
			},
			this.#rowHTMLElement
		);
		this.#providerKeyInput = theHTMLElementsFactory.create (
			'input',
			{
				className : 'TravelNotes-ApiKeysDialog-ApiKeyValue TravelNotes-ApiKeysDialog-Input',
				value : apiKey.providerKey,
				placeholder : theTranslator.getText ( 'ApiKeyControlRow - api key' ),
				type : theConfig.ApiKeysDialog.showApiKeys ? 'text' : 'password'
			},
			this.#rowHTMLElement
		);
		this.#deleteButtonHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className :
					'TravelNotes-BaseDialog-Button TravelNotes-ApiKeysDialog-AtRightButton',
				title : theTranslator.getText ( 'ApiKeyControlRow - delete api key' ),
				textContent : '❌',
				dataset : { ObjId : this.#objId }
			},
			this.#rowHTMLElement
		);
		this.#deleteButtonHTMLElement.addEventListener ( 'click', this.#deleteApiKeyButtonClickEL, false );
	}

	/**
	The destructor
	*/

	destructor ( ) {
		this.#deleteButtonHTMLElement.removeEventListener ( 'click', this.#deleteApiKeyButtonClickEL, false );
	}

	/**
	The ObjId of the control
	@type {Number}
	*/

	get objId ( ) { return this.#objId; }

	/**
	The root HTML element of row
	@type {Array.<HTMLElement>}
	*/

	get HTMLElement ( ) { return this.#rowHTMLElement; }

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
	The ApiKey
	@type {ApiKey}
	*/

	get apiKey ( ) {
		return new ApiKey ( this.#providerNameInput.value, this.#providerKeyInput.value );
	}
}

export default ApiKeyControlRow;

/* --- End of file --------------------------------------------------------------------------------------------------------- */