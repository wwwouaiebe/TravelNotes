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
	- v 4.0.0:
		- Issue ♯48 : Review the dialogs
Doc reviewed 20210914
Tests ...
*/

import theTranslator from '../UILib/Translator.js';
import theConfig from '../data/Config.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import RestoreFromUnsecureFileButtonClickEL from '../apiKeysDialog/RestoreFromUnsecureFileButtonClickEL.js';
import ReloadFromServerButtonClickEL from '../apiKeysDialog/ReloadFromServerButtonClickEL.js';
import RestoreFromSecureFileButtonClickEL from '../apiKeysDialog/RestoreFromSecureFileButtonClickEL.js';
import SaveToSecureFileButtonClickEL from '../apiKeysDialog/SaveToSecureFileButtonClickEL.js';
import SaveToUnsecureFileButtonClickEL from '../apiKeysDialog/SaveToUnsecureFileButtonClickEL.js';

import NewApiKeyButtonClickEL from '../apiKeysDialog/NewApiKeyButtonClickEL.js';

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
	Store the status of the ApiKeys file
	@type {Boolean}
	*/

	#haveApiKeysFile;

	/**
	The root HTML element of the control
	@type {HTMLElement}
	*/

	#rootHTMLElement;

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
	Event listener for the reload from server button
	@type {ReloadFromServerButtonClickEL}
	*/

	#reloadFromServerButtonClickEL;

	/**
	Event listener for the save to secure file button
	@type {SaveToSecureFileButtonClickEL}
	*/

	#saveToSecureFileButtonClickEL;

	/**
	Event listener for the restore from secure file button
	@type {RestoreFromSecureFileButtonClickEL}
	*/

	#restoreFromSecureFileButtonClickEL;

	/**
	Event listener for the new api key button
	@type {NewApiKeyButtonClickEL}
	*/

	#newApiKeyButtonClickEL;

	/**
	Event listener for the save to unsecure file button
	@type {SaveToUnsecureFileButtonClickEL}
	*/

	#saveToUnsecureFileButtonClickEL;

	/**
	Event listener for the restore from unsecure file button
	@type {RestoreFromUnsecureFileButtonClickEL}
	*/

	#restoreFromUnsecureFileButtonClickEL;

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
			this.#rootHTMLElement
		);
		this.#reloadFromServerButtonClickEL =
			new ReloadFromServerButtonClickEL ( this.#apiKeysDialog );
		this.#reloadKeysFromServerButton.addEventListener (
			'click',
			this.#reloadFromServerButtonClickEL,
			false
		);
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
			this.#rootHTMLElement
		);
		this.#saveToSecureFileButtonClickEL =
			new SaveToSecureFileButtonClickEL ( this.#apiKeysDialog, this.#apiKeysControl );
		this.#saveKeysToSecureFileButton.addEventListener (
			'click',
			this.#saveToSecureFileButtonClickEL,
			false
		);
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
			this.#rootHTMLElement
		);
		this.#restoreFromSecureFileButtonClickEL =
			new RestoreFromSecureFileButtonClickEL ( this.#apiKeysDialog );
		this.#restoreKeysFromSecureFileButton.addEventListener (
			'click',
			this.#restoreFromSecureFileButtonClickEL,
			false
		);
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
			this.#rootHTMLElement
		);
		this.#newApiKeyButtonClickEL =
			new NewApiKeyButtonClickEL ( this.#apiKeysControl );
		this.#newApiKeyButton.addEventListener (
			'click',
			this.#newApiKeyButtonClickEL,
			false
		);
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
			this.#rootHTMLElement
		);
		this.#saveToUnsecureFileButtonClickEL =
			new SaveToUnsecureFileButtonClickEL ( this.#apiKeysDialog, this.#apiKeysControl );
		this.#saveKeysToUnsecureFileButton.addEventListener (
			'click',
			this.#saveToUnsecureFileButtonClickEL,
			false
		);
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
			this.#rootHTMLElement
		);
		this.#restoreFromUnsecureFileButtonClickEL =
			new RestoreFromUnsecureFileButtonClickEL ( this.#apiKeysDialog );
		this.#restoreKeysFromUnsecureFileButton.addEventListener (
			'click',
			this.#restoreFromUnsecureFileButtonClickEL,
			false
		);
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
	@param {ApiKeysDialog} ApiKeysDialog A reference to the dialog
	@param {Map} apiKeysControl A reference to the apiKeysControl object
	@param {Boolean} haveApiKeysFile  A boolean indicating when the ApiKeys file was found on the server
	*/

	constructor ( apiKeysDialog, apiKeysControl, haveApiKeysFile ) {
		this.#apiKeysDialog = apiKeysDialog;
		this.#apiKeysControl = apiKeysControl;
		this.#haveApiKeysFile = haveApiKeysFile;
		this.#rootHTMLElement = theHTMLElementsFactory.create (
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
			this.#reloadKeysFromServerButton.removeEventListener (
				'click',
				this.#reloadFromServerButtonClickEL,
				false
			);
		}
		this.#reloadFromServerButtonClickEL = null;

		if ( this.#saveKeysToSecureFileButton ) {
			this.#saveKeysToSecureFileButton.removeEventListener (
				'click',
				this.#saveToSecureFileButtonClickEL,
				false
			);
		}
		this.#saveToSecureFileButtonClickEL = null;

		if ( this.#restoreKeysFromSecureFileButton ) {
			this.#restoreKeysFromSecureFileButton.removeEventListener (
				'click',
				this.#restoreFromSecureFileButtonClickEL,
				false
			);
		}
		this.#restoreFromSecureFileButtonClickEL = null;

		if ( this.#newApiKeyButton ) {
			this.#newApiKeyButton.removeEventListener (
				'click',
				this.#newApiKeyButtonClickEL,
				false
			);
		}
		this.#newApiKeyButtonClickEL = null;

		if ( this.#saveKeysToUnsecureFileButton ) {
			this.#saveKeysToUnsecureFileButton.removeEventListener (
				'click',
				this.#saveToUnsecureFileButtonClickEL,
				false
			);
		}
		this.#saveToUnsecureFileButtonClickEL = null;

		if ( this.#restoreKeysFromUnsecureFileButton ) {
			this.#restoreKeysFromUnsecureFileButton.removeEventListener (
				'click',
				this.#restoreFromUnsecureFileButtonClickEL,
				false
			);
		}
		this.#restoreFromUnsecureFileButtonClickEL = null;
	}

	/**
	The rootHTMLElement of the toolbar
	@type {HTMLElement}
	*/

	get rootHTMLElement ( ) {
		return this.#rootHTMLElement;
	}

}

export default ApiKeysDialogToolbar;

/* --- End of file --------------------------------------------------------------------------------------------------------- */