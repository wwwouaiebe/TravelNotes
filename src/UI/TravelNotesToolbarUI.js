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
	- v1.6.0:
		- created
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v2.0.0:
		- Issue ♯135 : Remove innerHTML from code
		- Issue ♯138 : Protect the app - control html entries done by user.
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210915
Tests ...
*/

import theTranslator from '../UILib/Translator.js';
import theConfig from '../data/Config.js';
import theAPIKeysManager from '../core/APIKeysManager.js';
import theGeoLocator from '../core/GeoLocator.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import { GEOLOCATION_STATUS } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click on ApiKeys button event listeners
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ApiKeysButtonClickEL {

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
		theAPIKeysManager.setKeysFromDialog ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
GeoLocator button event listeners
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class GeoLocatorButtonClickEL {

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
		theGeoLocator.switch ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
GeoLocator button event listeners
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PinButtonClickEL {

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
		clickEvent.target.textContent = '📌' === clickEvent.target.textContent ? '❌' : '📌';
		theEventDispatcher.dispatch ( 'uipinned' );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the Toolbar on top of the UI
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelNotesToolbarUI {

	/**
	The geolocation button
	@type {HTMLElement}
	*/

	#geoLocationButton;

	/**
	The buttons container
	@type {HTMLElement}
	*/

	#buttonsDiv;

	/**
	This method creates the home button
	*/

	#createHomeButton ( ) {
		theHTMLElementsFactory.create (
			'text',
			{
				value : '🏠'
			},
			theHTMLElementsFactory.create (
				'a',
				{
					className : 'TravelNotes-UI-LinkButton',
					href : window.location.origin,
					target : '_blank'
				},
				theHTMLElementsFactory.create (
					'div',
					{
						className : 'TravelNotes-UI-Button',
						title : 'Home'
					},
					this.#buttonsDiv
				)
			)
		);
	}

	/**
	This method creates the help button
	*/

	#createHelpButton ( ) {
		theHTMLElementsFactory.create (
			'text',
			{
				value : '?'
			},
			theHTMLElementsFactory.create (
				'a',
				{
					className : 'TravelNotes-UI-LinkButton',
					href : 'https://wwwouaiebe.github.io/TravelNotes/userGuides/README.html\u0023' +
						theConfig.travelNotes.language,
					target : '_blank'
				},
				theHTMLElementsFactory.create (
					'div',
					{
						className : 'TravelNotes-UI-Button',
						title : 'Help'
					},
					this.#buttonsDiv
				)
			)
		);
	}

	/**
	This method creates the contact button
	*/

	#createContactButton ( ) {
		theHTMLElementsFactory.create (
			'text',
			{
				value : '@'
			},
			theHTMLElementsFactory.create (
				'a',
				{
					className : 'TravelNotes-UI-LinkButton',
					href : ( theConfig.travelNotesToolbarUI.contactMail.url || window.location.origin ),
					target : '_blank'
				},
				theHTMLElementsFactory.create (
					'div',
					{
						className : 'TravelNotes-UI-Button',
						title : 'Contact'
					},
					this.#buttonsDiv
				)
			)
		);
	}

	/**
	This method creates the show APIKeys dialog button
	*/

	#createApiKeysButton ( ) {
		if ( theConfig.APIKeysDialog.showButton ) {
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-UI-Button',
					title : theTranslator.getText ( 'TravelNotesToolbarUI - API keys' ),
					textContent : '🔑'
				},
				this.#buttonsDiv
			)
				.addEventListener ( 'click', new ApiKeysButtonClickEL ( ), false );
		}
	}

	/**
	This method creates the geo location button
	*/

	#createGeoLocationButton ( ) {

		// Don't test the https protocol. On some mobile devices with an integreted GPS
		// the geolocation is working also on http protocol
		if ( GEOLOCATION_STATUS.disabled < theGeoLocator.status ) {
			this.#geoLocationButton = theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-UI-Button',
					title : theTranslator.getText ( 'TravelNotesToolbarUI - Geo location' ),
					textContent : '🌐'
				},
				this.#buttonsDiv
			);
			this.#geoLocationButton.addEventListener ( 'click', new GeoLocatorButtonClickEL ( ), false );
		}
	}

	/**
	This method creates the pin UI button
	*/

	#createPinButton ( ) {
		const pinButton = theHTMLElementsFactory.create (
			'div',
			{
				textContent : theConfig.travelEditor.startMinimized ? '📌' : '❌',
				className : 'TravelNotes-UI-Button TravelNotes-UI-FlexRow-RightButton'
			},
			this.#buttonsDiv
		);
		pinButton.addEventListener ( 'click', new PinButtonClickEL ( ), false );
	}

	/**
	The constructor
	@param {HTMLElement} uiMainDiv The HTMLElement in witch the toolbar must be created
	*/

	constructor ( uiMainDiv ) {

		Object.freeze ( this );

		// Container creation
		this.#buttonsDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-UI-FlexRowDiv'
			},
			uiMainDiv
		);

		// Buttons creation
		this.#createHomeButton ( );
		this.#createHelpButton ( );
		this.#createContactButton ( );
		this.#createApiKeysButton ( );
		this.#createGeoLocationButton ( );
		this.#createPinButton ( );
	}

	/**
	Adapt the geo location button to the geo location status
	@param {GEOLOCATION_STATUS} geoLocationStatus The new status of the geo location
	*/

	geoLocationStatusChanged ( geoLocationStatus ) {
		switch ( geoLocationStatus ) {
		case GEOLOCATION_STATUS.inactive :
			this.#geoLocationButton.classList.remove ( 'TravelNotes-TravelNotesToolbarUI-GeoLocationButton-Striked' );
			break;
		case GEOLOCATION_STATUS.active :
			this.#geoLocationButton.classList.add ( 'TravelNotes-TravelNotesToolbarUI-GeoLocationButton-Striked' );
			break;
		default :
			if ( this.#geoLocationButton ) {
				this.#geoLocationButton.parentNode.removeChild ( this.#geoLocationButton );
				this.#geoLocationButton = null;
			}
			break;
		}
	}
}

export default TravelNotesToolbarUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */