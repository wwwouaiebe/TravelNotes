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
import {
	RestoreFromUnsecureFileButtonClickEL,
	ReloadFromServerButtonClickEL,
	RestoreFromSecureFileButtonClickEL,
	SaveToSecureFileButtonClickEL,
	SaveToUnsecureFileButtonClickEL,
	NewAPIKeyButtonClickEL
} from '../dialogAPIKeys/APIKeysDialogEventListeners.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This is the toolbar for the APIKeysDialog. Display 6 buttons on top of dialog.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class APIKeysDialogToolbar {

	/**
	A reference to the APIKeysDialog Object
	@type {APIKeysDialog}
	*/

	#APIKeysDialog;

	/**
	A reference to the JS map where the APIKeysDialogKeyControl objects are stored
	@type {Map}
	*/

	#APIKeysControls;

	/**
	Store the status of the APIKeys file
	@type {Boolean}
	*/

	#haveAPIKeysFile;

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
	The new APIKey button
	@type {HTMLElement}
	*/

	#newAPIKeyButton;

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
	Event listener for the new API key button
	@type {NewAPIKeyButtonClickEL}
	*/

	#newAPIKeyButtonClickEL;

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
				title : theTranslator.getText ( 'APIKeysDialogToolbar - Reload from server' ),
				textContent : '🔄'
			},
			this.#rootHTMLElement
		);
		this.#reloadFromServerButtonClickEL =
			new ReloadFromServerButtonClickEL ( this.#APIKeysDialog );
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
				title : theTranslator.getText ( 'APIKeysDialogToolbar - Save to file' ),
				textContent : '💾'
			},
			this.#rootHTMLElement
		);
		this.#saveToSecureFileButtonClickEL =
			new SaveToSecureFileButtonClickEL ( this.#APIKeysDialog, this.#APIKeysControls );
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
				title : theTranslator.getText ( 'APIKeysDialogToolbar - Open file' ),
				textContent : '📂'
			},
			this.#rootHTMLElement
		);
		this.#restoreFromSecureFileButtonClickEL =
			new RestoreFromSecureFileButtonClickEL ( this.#APIKeysDialog );
		this.#restoreKeysFromSecureFileButton.addEventListener (
			'click',
			this.#restoreFromSecureFileButtonClickEL,
			false
		);
	}

	/**
	Create the AddNewAPIKey Button
	*/

	#createNewAPIKeyButton ( ) {
		this.#newAPIKeyButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'APIKeysDialogToolbar - new API key' ),
				textContent : '+'
			},
			this.#rootHTMLElement
		);
		this.#newAPIKeyButtonClickEL =
			new NewAPIKeyButtonClickEL ( this.#APIKeysDialog, this.#APIKeysControls );
		this.#newAPIKeyButton.addEventListener (
			'click',
			this.#newAPIKeyButtonClickEL,
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
				className : 'TravelNotes-BaseDialog-Button TravelNotes-APIKeysDialog-AtRightButton',
				title : theTranslator.getText ( 'APIKeysDialogToolbar - Save to json file' ),
				textContent : '💾'
			},
			this.#rootHTMLElement
		);
		this.#saveToUnsecureFileButtonClickEL =
			new SaveToUnsecureFileButtonClickEL ( this.#APIKeysDialog, this.#APIKeysControls );
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
				title : theTranslator.getText ( 'APIKeysDialogToolbar - Open json file' ),
				textContent : '📂'
			},
			this.#rootHTMLElement
		);
		this.#restoreFromUnsecureFileButtonClickEL =
			new RestoreFromUnsecureFileButtonClickEL ( this.#APIKeysDialog );
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
			if ( this.#haveAPIKeysFile ) {
				this.#createReloadKeysFromServerButton ( );
			}
			this.#createSaveKeysToSecureFileButton ( );
			this.#createRestoreKeysFromSecureFileButton ( );
		}

		this.#createNewAPIKeyButton ( );

		if ( theConfig.APIKeysDialog.haveUnsecureButtons ) {
			this.#createSaveKeysToUnsecureFileButton ( );
			this.#createRestoreKeysFromUnsecureFileButton ( );
		}
	}

	/**
	The constructor
	@param {APIKeysDialog} APIKeysDialog A reference to the dialog
	@param {Map} APIKeysControls A reference to the JS map with APIKeysControl objects
	@param {Boolean} haveAPIKeysFile  A boolean indicating when the APIKeys file was found on the server
	*/

	constructor ( APIKeysDialog, APIKeysControls, haveAPIKeysFile ) {
		this.#APIKeysDialog = APIKeysDialog;
		this.#APIKeysControls = APIKeysControls;
		this.#haveAPIKeysFile = haveAPIKeysFile;
		this.#rootHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-APIKeysDialog-ToolbarDiv'
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

		if ( this.#newAPIKeyButton ) {
			this.#newAPIKeyButton.removeEventListener (
				'click',
				this.#newAPIKeyButtonClickEL,
				false
			);
		}
		this.#newAPIKeyButtonClickEL = null;

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

export default APIKeysDialogToolbar;

/* --- End of file --------------------------------------------------------------------------------------------------------- */