/*
Copyright - 2017 2021 - wwwouaiebe - Contact: http//www.ouaie.be/

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
Doc reviewed 20210915
Tests ...
*/

import theTranslator from '../UILib/Translator.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theTravelEditor from '../core/TravelEditor.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import FileLoader from '../core/FileLoader.js';
import theConfig from '../data/Config.js';
import theErrorsUI from '../errorsUI/ErrorsUI.js';
import theUtilities from '../UILib/Utilities.js';

import { INVALID_OBJ_ID, ZERO } from '../main/Constants.js';

/*---------------------------------------------------------------------------------------------------------------------------*/
/**
click event listener for the SaveAs button
*/
/*---------------------------------------------------------------------------------------------------------------------------*/

class SaveAsButtonClickEL {

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
		theTravelEditor.saveAsTravel ( );
	}

}

/*---------------------------------------------------------------------------------------------------------------------------*/
/**
click event listener for the Cancel button
*/
/*---------------------------------------------------------------------------------------------------------------------------*/

class CancelButtonClickEL {

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
		clickEvent.stopPropagation ();
		theTravelEditor.newTravel ( );
		document.title =
			'Travel & Notes' +
			( '' === theTravelNotesData.travel.name ? '' : ' - ' + theTravelNotesData.travel.name );
	}
}

/*---------------------------------------------------------------------------------------------------------------------------*/
/**
click event listener for the Save button
*/
/*---------------------------------------------------------------------------------------------------------------------------*/

class SaveButtonClickEL {

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
		theTravelEditor.saveTravel ( );
	}
}

/*---------------------------------------------------------------------------------------------------------------------------*/
/**
change event listener for the input associated to the open button
*/
/*---------------------------------------------------------------------------------------------------------------------------*/

class OpenInputChangeEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		const fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			try {
				new FileLoader ( ).openLocalFile ( JSON.parse ( fileReader.result ) );
			}
			catch ( err ) {
				if ( err instanceof Error ) {
					console.error ( err );
					theErrorsUI.showError ( 'An error occurs when reading the file : ' + err.message );
				}
			}
		};
		fileReader.readAsText ( changeEvent.target.files [ ZERO ] );
	}
}

/*---------------------------------------------------------------------------------------------------------------------------*/
/**
click event listener for the open button
*/
/*---------------------------------------------------------------------------------------------------------------------------*/

class OpenButtonClickEL {

	/**
	the constructor
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
		if (
			theConfig.travelNotes.haveBeforeUnloadWarning
			&&
			(
				! window.confirm (
					theTranslator.getText ( 'TravelEditor - This page ask to close; data are perhaps not saved.' )
				)
			)
		) {
			return;
		}

		theUtilities.openFile ( new OpenInputChangeEL ( ), '.trv' );
	}
}

/*---------------------------------------------------------------------------------------------------------------------------*/
/**
change event listener for the input associated to the import button
*/
/*---------------------------------------------------------------------------------------------------------------------------*/

class ImportInputChangeEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		const fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			try {
				new FileLoader ( ).mergeLocalFile ( JSON.parse ( fileReader.result ) );
			}
			catch ( err ) {
				if ( err instanceof Error ) {
					console.error ( err );
					theErrorsUI.showError ( 'An error occurs when reading the file : ' + err.message );
				}
			}
		};

		fileReader.readAsText ( changeEvent.target.files [ ZERO ] );
	}
}

/*---------------------------------------------------------------------------------------------------------------------------*/
/**
click event listener for the import button
*/
/*---------------------------------------------------------------------------------------------------------------------------*/

class ImportButtonClickEL {

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
		if ( INVALID_OBJ_ID === theTravelNotesData.editedRouteObjId ) {
			theUtilities.openFile ( new ImportInputChangeEL ( ), '.trv' );
		}
		else {
			theErrorsUI.showError (
				theTranslator.getText ( 'TravelUI - Not possible to merge a travel when a route is edited' )
			);
		}
	}
}

/*---------------------------------------------------------------------------------------------------------------------------*/
/**
This class is the TravelToolbar part of the UI
*/
/*---------------------------------------------------------------------------------------------------------------------------*/

class TravelToolbarUI {

	/**
	The buttons container
	@type {HTMLElement}
	*/

	#buttonsDiv;

	/**
	This method creates the save travel button
	*/

	#createSaveAsTravelButton ( ) {
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-UI-Button TravelNotes-TravelUI-SaveAsButton',
				title : theTranslator.getText ( 'TravelUI - Save as travel' ),
				textContent : '💾'
			},
			this.#buttonsDiv
		)
			.addEventListener ( 'click', new SaveAsButtonClickEL ( ), false );
	}

	/**
	This method creates the cancel travel button
	*/

	#createCancelTravelButton ( ) {
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-UI-Button',
				title : theTranslator.getText ( 'TravelUI - Cancel travel' ),
				textContent : '❌'
			},
			this.#buttonsDiv
		)
			.addEventListener ( 'click', new CancelButtonClickEL ( ), false );
	}

	/**
	This method creates the save travel button
	*/

	#createSaveTravelButton ( ) {
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-UI-Button',
				title : theTranslator.getText ( 'TravelUI - Save travel' ),
				textContent : '💾'
			},
			this.#buttonsDiv
		)
			.addEventListener ( 'click', new SaveButtonClickEL ( ), false );
	}

	/**
	This method creates the open travel button
	*/

	#createOpenTravelButton ( ) {

		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-UI-Button',
				title : theTranslator.getText ( 'TravelUI - Open travel' ),
				textContent : '📂'
			},
			this.#buttonsDiv
		)
			.addEventListener ( 'click', new OpenButtonClickEL ( ), false );
	}

	/**
	This method creates the import travel button
	*/

	#createImportTravelButton ( ) {
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-UI-Button',
				title : theTranslator.getText ( 'TravelUI - Import travel' ),
				textContent : '🌏'
			},
			this.#buttonsDiv
		)
			.addEventListener ( 'click', new ImportButtonClickEL ( ), false );
	}

	/**
	This method creates the roadbook button
	*/

	#createRoadbookButton ( ) {

		theHTMLElementsFactory.create (
			'text',
			{
				value : '📋'
			},
			theHTMLElementsFactory.create (
				'a',
				{
					className : 'TravelNotes-UI-LinkButton',
					href : 'TravelNotesRoadbook.html?lng=' +
						theConfig.travelNotes.language + '&page=' +
						theTravelNotesData.UUID,
					target : '_blank'
				},
				theHTMLElementsFactory.create (
					'div',
					{
						className : 'TravelNotes-UI-Button',
						title : theTranslator.getText ( 'TravelUI - Open travel roadbook' )
					},
					this.#buttonsDiv
				)
			)
		);
	}

	/**
	the constructor
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
		this.#createSaveAsTravelButton ( );
		this.#createCancelTravelButton ( );
		this.#createSaveTravelButton ( );
		this.#createOpenTravelButton ( );
		this.#createImportTravelButton ( );
		this.#createRoadbookButton ( );
	}
}

export default TravelToolbarUI;

/*
--- End of TravelToolbarUI.js file --------------------------------------------------------------------------------------------
*/