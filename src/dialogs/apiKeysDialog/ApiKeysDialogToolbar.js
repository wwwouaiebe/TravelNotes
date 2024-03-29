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

import theTranslator from '../../core/uiLib/Translator.js';
import theConfig from '../../data/Config.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import RestoreFromUnsecureFileButtonClickEL from './RestoreFromUnsecureFileButtonClickEL.js';
import ReloadFromServerButtonClickEL from './ReloadFromServerButtonClickEL.js';
import RestoreFromSecureFileButtonClickEL from './RestoreFromSecureFileButtonClickEL.js';
import SaveToSecureFileButtonClickEL from './SaveToSecureFileButtonClickEL.js';
import SaveToUnsecureFileButtonClickEL from './SaveToUnsecureFileButtonClickEL.js';
import NewApiKeyButtonClickEL from './NewApiKeyButtonClickEL.js';

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
			this.#toolbarHTMLElement
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
			this.#toolbarHTMLElement
		);
		this.#saveToSecureFileButtonClickEL =
			new SaveToSecureFileButtonClickEL ( this.#apiKeysDialog );
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
			this.#toolbarHTMLElement
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
			this.#toolbarHTMLElement
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
			this.#toolbarHTMLElement
		);
		this.#saveToUnsecureFileButtonClickEL =
			new SaveToUnsecureFileButtonClickEL ( this.#apiKeysDialog );
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
			this.#toolbarHTMLElement
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
			this.#reloadKeysFromServerButton.removeEventListener (
				'click',
				this.#reloadFromServerButtonClickEL,
				false
			);
			this.#reloadFromServerButtonClickEL.destructor ( );
			this.#reloadFromServerButtonClickEL = null;
		}

		if ( this.#saveKeysToSecureFileButton ) {
			this.#saveKeysToSecureFileButton.removeEventListener (
				'click',
				this.#saveToSecureFileButtonClickEL,
				false
			);
			this.#saveToSecureFileButtonClickEL.destructor ( );
			this.#saveToSecureFileButtonClickEL = null;
		}

		if ( this.#restoreKeysFromSecureFileButton ) {
			this.#restoreKeysFromSecureFileButton.removeEventListener (
				'click',
				this.#restoreFromSecureFileButtonClickEL,
				false
			);
			this.#restoreFromSecureFileButtonClickEL.destructor ( );
			this.#restoreFromSecureFileButtonClickEL = null;
		}

		if ( this.#newApiKeyButton ) {
			this.#newApiKeyButton.removeEventListener (
				'click',
				this.#newApiKeyButtonClickEL,
				false
			);
			this.#newApiKeyButtonClickEL.destructor ( );
			this.#newApiKeyButtonClickEL = null;
		}

		if ( this.#saveKeysToUnsecureFileButton ) {
			this.#saveKeysToUnsecureFileButton.removeEventListener (
				'click',
				this.#saveToUnsecureFileButtonClickEL,
				false
			);
			this.#saveToUnsecureFileButtonClickEL.destructor ( );
			this.#saveToUnsecureFileButtonClickEL = null;
		}

		if ( this.#restoreKeysFromUnsecureFileButton ) {
			this.#restoreKeysFromUnsecureFileButton.removeEventListener (
				'click',
				this.#restoreFromUnsecureFileButtonClickEL,
				false
			);
			this.#restoreFromUnsecureFileButtonClickEL.destructor ( );
			this.#restoreFromUnsecureFileButtonClickEL = null;
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