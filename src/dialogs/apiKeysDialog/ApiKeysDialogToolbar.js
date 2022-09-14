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
		- created from v3.6.0
Doc reviewed 202208
 */

import theTranslator from '../../core/uiLib/Translator.js';
import theConfig from '../../data/Config.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import RestoreFromUnsecureFileButtonEL from './RestoreFromUnsecureFileButtonEL.js';
import ReloadFromServerButtonEL from './ReloadFromServerButtonEL.js';
import RestoreFromSecureFileButtonEL from './RestoreFromSecureFileButtonEL.js';
import SaveToSecureFileButtonEL from './SaveToSecureFileButtonEL.js';
import SaveToUnsecureFileButtonEL from './SaveToUnsecureFileButtonEL.js';
import NewApiKeyButtonEL from './NewApiKeyButtonEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This is the toolbar for the ApiKeysDialog. Display 6 buttons on top of dialog.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ApiKeysDialogToolbar {

	/**
	A reference to the ApiKeysDialog Object
	@type {ApiKeysDialog}
	*/

	#apiKeysDialog;

	/**
	A reference to the api keys control
	@type {ApiKeysControl}
	*/

	#apiKeysControl;

	/**
	The root HTML element of the control
	@type {HTMLElement}
	*/

	#toolbarHTMLElement;

	/**
	The reload key from server button
	@type {HTMLElement}
	*/

	#reloadKeysFromServerButton;

	/**
	The save keys to secure file button
	@type {HTMLElement}
	*/

	#saveKeysToSecureFileButton;

	/**
	The restore keys from secure file button
	@type {HTMLElement}
	*/

	#restoreKeysFromSecureFileButton;

	/**
	The new ApiKey button
	@type {HTMLElement}
	*/

	#newApiKeyButton;

	/**
	The save keys to unsecure file button
	@type {HTMLElement}
	*/

	#saveKeysToUnsecureFileButton;

	/**
	The restore keys from unsecure file button
	@type {HTMLElement}
	*/

	#restoreKeysFromUnsecureFileButton;

	/**
	Store the status of the ApiKeys file
	@type {Boolean}
	*/

	#haveApiKeysFile;

	/**
	Event listener for the reload from server button
	@type {ReloadFromServerButtonEL}
	*/

	#reloadFromServerButtonEL;

	/**
	Event listener for the save to secure file button
	@type {SaveToSecureFileButtonEL}
	*/

	#saveToSecureFileButtonEL;

	/**
	Event listener for the restore from secure file button
	@type {RestoreFromSecureFileButtonEL}
	*/

	#restoreFromSecureFileButtonEL;

	/**
	Event listener for the new api key button
	@type {NewApiKeyButtonEL}
	*/

	#newApiKeyButtonEL;

	/**
	Event listener for the save to unsecure file button
	@type {SaveToUnsecureFileButtonEL}
	*/

	#saveToUnsecureFileButtonEL;

	/**
	Event listener for the restore from unsecure file button
	@type {RestoreFromUnsecureFileButtonEL}
	*/

	#restoreFromUnsecureFileButtonEL;

	/**
	Create the ReloadKeysFromServerFile Button
	*/

	#createReloadKeysFromServerButton ( ) {
		this.#reloadKeysFromServerButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'ApiKeysDialogToolbar - Reload from server' ),
				textContent : '🔄'
			},
			this.#toolbarHTMLElement
		);
		this.#reloadFromServerButtonEL =
			new ReloadFromServerButtonEL ( this.#apiKeysDialog );
		this.#reloadFromServerButtonEL.addEventListeners ( this.#reloadKeysFromServerButton );
	}

	/**
	Create the SaveKeysToSecureFile Button
	*/

	#createSaveKeysToSecureFileButton ( ) {
		this.#saveKeysToSecureFileButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'ApiKeysDialogToolbar - Save to file' ),
				textContent : '💾'
			},
			this.#toolbarHTMLElement
		);
		this.#saveToSecureFileButtonEL =
			new SaveToSecureFileButtonEL ( this.#apiKeysDialog );
		this.#saveToSecureFileButtonEL.addEventListeners ( this.#saveKeysToSecureFileButton );
	}

	/**
	Create the RestoreKeysFromSecureFile Button
	*/

	#createRestoreKeysFromSecureFileButton ( ) {
		this.#restoreKeysFromSecureFileButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'ApiKeysDialogToolbar - Open file' ),
				textContent : '📂'
			},
			this.#toolbarHTMLElement
		);
		this.#restoreFromSecureFileButtonEL =
			new RestoreFromSecureFileButtonEL ( this.#apiKeysDialog );
		this.#restoreFromSecureFileButtonEL.addEventListeners ( this.#restoreKeysFromSecureFileButton );
	}

	/**
	Create the AddNewApiKey Button
	*/

	#createNewApiKeyButton ( ) {
		this.#newApiKeyButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'ApiKeysDialogToolbar - new api key' ),
				textContent : '+'
			},
			this.#toolbarHTMLElement
		);
		this.#newApiKeyButtonEL = new NewApiKeyButtonEL ( this.#apiKeysControl );
		this.#newApiKeyButtonEL.addEventListeners ( this.#newApiKeyButton );
	}

	/**
	Create the SaveKeysToUnsecureFile Button
	*/

	#createSaveKeysToUnsecureFileButton ( ) {
		this.#saveKeysToUnsecureFileButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button TravelNotes-ApiKeysDialog-AtRightButton',
				title : theTranslator.getText ( 'ApiKeysDialogToolbar - Save to json file' ),
				textContent : '💾'
			},
			this.#toolbarHTMLElement
		);
		this.#saveToUnsecureFileButtonEL =
			new SaveToUnsecureFileButtonEL ( this.#apiKeysDialog );
		this.#saveToUnsecureFileButtonEL.addEventListeners ( this.#saveKeysToUnsecureFileButton );
	}

	/**
	Create the RestoreKeysFromUnsecureFile Button
	*/

	#createRestoreKeysFromUnsecureFileButton ( ) {
		this.#restoreKeysFromUnsecureFileButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'ApiKeysDialogToolbar - Open json file' ),
				textContent : '📂'
			},
			this.#toolbarHTMLElement
		);
		this.#restoreFromUnsecureFileButtonEL = new RestoreFromUnsecureFileButtonEL ( this.#apiKeysDialog );
		this.#restoreFromUnsecureFileButtonEL.addEventListeners ( this.#restoreKeysFromUnsecureFileButton );
	}

	/**
	Add the buttons to the toolbar
	*/

	#addToolbarButtons ( ) {
		if ( window?.crypto?.subtle?.importKey && window.isSecureContext ) {
			if ( this.#haveApiKeysFile ) {
				this.#createReloadKeysFromServerButton ( );
			}
			this.#createSaveKeysToSecureFileButton ( );
			this.#createRestoreKeysFromSecureFileButton ( );
		}
		this.#createNewApiKeyButton ( );
		if ( theConfig.ApiKeysDialog.haveUnsecureButtons ) {
			this.#createSaveKeysToUnsecureFileButton ( );
			this.#createRestoreKeysFromUnsecureFileButton ( );
		}
	}

	/**
	The constructor
	@param {ApiKeysDialog} apiKeysDialog A reference to the dialog
	@param {Map} apiKeysControl A reference to the apiKeysControl object
	@param {Boolean} haveApiKeysFile  A boolean indicating when the ApiKeys file was found on the server
	*/

	constructor ( apiKeysDialog, apiKeysControl, haveApiKeysFile ) {
		this.#apiKeysDialog = apiKeysDialog;
		this.#apiKeysControl = apiKeysControl;
		this.#haveApiKeysFile = haveApiKeysFile;
		this.#toolbarHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-ApiKeysDialog-ToolbarDiv'
			}
		);
		this.#addToolbarButtons ( );
		Object.freeze ( this );
	}

	/**
	Remove events listeners from the buttons
	*/

	destructor ( ) {
		if ( this.#reloadKeysFromServerButton ) {
			this.#reloadFromServerButtonEL.removeEventListeners ( this.#reloadKeysFromServerButton );
			this.#reloadFromServerButtonEL.destructor ( );
			this.#reloadFromServerButtonEL = null;
		}
		if ( this.#saveKeysToSecureFileButton ) {
			this.#saveToSecureFileButtonEL.removeEventListeners ( this.#saveKeysToSecureFileButton );
			this.#saveToSecureFileButtonEL.destructor ( );
			this.#saveToSecureFileButtonEL = null;
		}
		if ( this.#restoreKeysFromSecureFileButton ) {
			this.#restoreFromSecureFileButtonEL.removeEventListeners ( this.#restoreKeysFromSecureFileButton );
			this.#restoreFromSecureFileButtonEL.destructor ( );
			this.#restoreFromSecureFileButtonEL = null;
		}
		if ( this.#newApiKeyButton ) {
			this.#newApiKeyButtonEL.removeEventListeners ( this.#newApiKeyButton );
			this.#newApiKeyButtonEL.destructor ( );
			this.#newApiKeyButtonEL = null;
		}
		if ( this.#saveKeysToUnsecureFileButton ) {
			this.#saveToUnsecureFileButtonEL.removeEventListeners ( this.#saveKeysToUnsecureFileButton );
		}
		if ( this.#restoreKeysFromUnsecureFileButton ) {
			this.#restoreFromUnsecureFileButtonEL.removeEventListeners ( this.#restoreKeysFromUnsecureFileButton );
		}
	}

	/**
	The rootHTMLElement of the toolbar
	@type {HTMLElement}
	*/

	get toolbarHTMLElement ( ) {
		return this.#toolbarHTMLElement;
	}

}

export default ApiKeysDialogToolbar;

/* --- End of file --------------------------------------------------------------------------------------------------------- */