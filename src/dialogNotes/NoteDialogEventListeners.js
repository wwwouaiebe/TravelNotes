/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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
Doc reviewed 20210901
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file NoteDialogEventListeners.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module dialogNotes
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import theTranslator from '../UILib/Translator.js';
import GeoCoder from '../coreLib/GeoCoder.js';
import theUtilities from '../UILib/Utilities.js';
import theNoteDialogToolbarData from '../dialogNotes/NoteDialogToolbarData.js';
import MapIconFromOsmFactory from '../coreMapIcon/MapIconFromOsmFactory.js';
import { ZERO } from '../main/Constants.js';

/**
@--------------------------------------------------------------------------------------------------------------------------

@class NoteDialogGeoCoderHelper
@classdesc Helper class for the address button
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class NoteDialogGeoCoderHelper {

	#noteDialog = null;

	#onAddressUpdatedByGeoCoder ( address ) {
		this.#noteDialog.hideWait ( );
		let addressString = address.street;
		if ( '' !== address.city ) {
			addressString += ' <span class="TravelNotes-NoteHtml-Address-City">' + address.city + '</span>';
		}

		this.#noteDialog.setControlsValues ( { address : addressString } );
		this.#noteDialog.updatePreview ( { address : addressString } );
	}

	/*
	constructor
	*/

	constructor ( noteDialog ) {
		Object.freeze ( this );
		this.#noteDialog = noteDialog;
	}

	setAddressWithGeoCoder ( latLng ) {
		this.#noteDialog.showWait ( );
		this.#noteDialog.hideError ( );
		new GeoCoder ( ).getAddressWithPromise ( latLng )
			.then ( address => { this.#onAddressUpdatedByGeoCoder ( address ); } )
			.catch (
				err => {
					if ( err ) {
						console.error ( err );
					}
					this.#noteDialog.hideWait ( );
					this.#noteDialog.showError (
						theTranslator.getText ( 'Notedialog - an error occurs when searching the adress' )
					);
				}
			);
	}
}

/**
@--------------------------------------------------------------------------------------------------------------------------

@class AddressButtonClickEL
@classdesc Click event listener for the AddressButtonClickEL class
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class AddressButtonClickEL {

	#noteDialog = null;
	#latLng = null;

	/*
	constructor
	*/

	constructor ( noteDialog, latLng ) {
		Object.freeze ( this );
		this.#noteDialog = noteDialog;
		this.#latLng = latLng;
	}

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		new NoteDialogGeoCoderHelper ( this.#noteDialog ).setAddressWithGeoCoder ( this.#latLng );
	}
}

/**
@--------------------------------------------------------------------------------------------------------------------------

@class AllControlsFocusEL
@classdesc Focus event listener for all controls
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class AllControlsFocusEL {

	#noteDialog = null;

	/*
	constructor
	*/

	constructor ( noteDialog ) {
		Object.freeze ( this );
		this.#noteDialog = noteDialog;
	}

	handleEvent ( focusEvent ) {
		focusEvent.stopPropagation ( );
		if ( 'url' === focusEvent.target.dataset.tanName ) {
			this.#noteDialog.focusControl = null;
		}
		else {
			this.#noteDialog.focusControl = focusEvent.target;
		}
	}
}

/**
@--------------------------------------------------------------------------------------------------------------------------

@class UrlInputBlurEL
@classdesc blur event listener for url input
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class UrlInputBlurEL {

	#noteDialog = null;

	/*
	constructor
	*/

	constructor ( noteDialog ) {
		Object.freeze ( this );
		this.#noteDialog = noteDialog;
	}

	handleEvent ( blurEvent ) {
		blurEvent.stopPropagation ( );
		if ( '' === blurEvent.target.value ) {
			this.#noteDialog.hideError ( );
			return;
		}

		const verifyResult = theHTMLSanitizer.sanitizeToUrl ( blurEvent.target.value );
		if ( '' === verifyResult.errorsString ) {
			this.#noteDialog.hideError ( );
		}
		else {
			this.#noteDialog.showError ( theTranslator.getText ( 'NoteDialog - invalidUrl' ) );
		}
	}
}

/**
@--------------------------------------------------------------------------------------------------------------------------

@class AllControlsInputEL
@classdesc input event listener for all control
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class AllControlsInputEL {

	#noteDialog = null;

	/*
	constructor
	*/

	constructor ( noteDialog ) {
		Object.freeze ( this );
		this.#noteDialog = noteDialog;
	}

	handleEvent ( inputUpdatedEvent ) {
		inputUpdatedEvent.stopPropagation ( );
		const noteData = {};
		noteData [ inputUpdatedEvent.target.dataset.tanName ] = inputUpdatedEvent.target.value;
		this.#noteDialog.updatePreview ( noteData );
	}
}

/**
@--------------------------------------------------------------------------------------------------------------------------

@class EditionButtonsClickEL
@classdesc click event listener for the edition buttons
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class EditionButtonsClickEL {

	#noteDialog = null;

	/*
	constructor
	*/

	constructor ( noteDialog ) {
		Object.freeze ( this );
		this.#noteDialog = noteDialog;
	}

	destructor ( ) {
		this.#noteDialog = null;
	}

	/**
	click event listener fot the toolbar edition buttons. Update the current control value
	*/

	handleEvent ( clickEvent ) {
		if ( ! this.#noteDialog.focusControl ) {
			return;
		}
		const button = clickEvent.currentTarget;
		let selectionStart = this.#noteDialog.focusControl.selectionStart;
		let selectionEnd = this.#noteDialog.focusControl.selectionEnd;

		this.#noteDialog.focusControl.value =
			this.#noteDialog.focusControl.value.slice ( ZERO, selectionStart ) +
			button.dataset.tanHtmlBefore +
			(
				ZERO === button.dataset.tanHtmlAfter.length
					?
					''
					:
					this.#noteDialog.focusControl.value.slice ( selectionStart, selectionEnd )
			) +
			button.dataset.tanHtmlAfter +
			this.#noteDialog.focusControl.value.slice ( selectionEnd );

		if ( selectionStart === selectionEnd || ZERO === button.dataset.tanHtmlAfter.length ) {
			selectionStart += button.dataset.tanHtmlBefore.length;
			selectionEnd = selectionStart;
		}
		else {
			selectionEnd += button.dataset.tanHtmlBefore.length + button.dataset.tanHtmlAfter.length;
		}
		this.#noteDialog.focusControl.setSelectionRange ( selectionStart, selectionEnd );
		this.#noteDialog.focusControl.focus ( );
		const noteData = {};
		noteData [ this.#noteDialog.focusControl.dataset.tanName ] = this.#noteDialog.focusControl.value;
		this.#noteDialog.updatePreview ( noteData );
	}
}

/**
@--------------------------------------------------------------------------------------------------------------------------

@class IconSelectorChangeEL
@classdesc change event listener for the icon selector
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class IconSelectorChangeEL {

	#noteDialog = null;

	/**
	Helper method for the onIconSelectChange mehod
	@private
	*/

	#updatePreviewAndControls ( noteData )	{
		this.#noteDialog.setControlsValues ( noteData );
		this.#noteDialog.updatePreview ( noteData );
	}

	/**
	Svg Map icon creation
	@private
	*/

	#onMapIcon ( ) {
		const mapIconData = this.#noteDialog.mapIconData;
		if ( ! mapIconData.route ) {
			this.#noteDialog.showError (
				theTranslator.getText ( 'Notedialog - not possible to create a SVG icon for a travel note' )
			);
			return;
		}

		this.#noteDialog.showWait ( );
		new MapIconFromOsmFactory ( ).getIconAndAdressWithPromise ( mapIconData )
			.then (
				noteData => {
					this.#noteDialog.hideWait ( );
					this.#updatePreviewAndControls ( noteData );
				}
			)
			.catch (
				err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
					this.#noteDialog.hideWait ( );
					this.#noteDialog.showError (
						theTranslator.getText ( 'Notedialog - an error occurs when creating the SVG icon' )
					);
				}
			);
	}

	/*
	constructor
	*/

	constructor ( noteDialog ) {
		Object.freeze ( this );
		this.#noteDialog = noteDialog;
	}

	destructor ( ) {
		this.#noteDialog = null;
	}

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		const preDefinedIcon = theNoteDialogToolbarData.getIconData ( changeEvent.target.selectedIndex );

		if ( 'SvgIcon' === preDefinedIcon.icon ) {
			this.#onMapIcon ( );
			return;
		}

		this.#updatePreviewAndControls (
			{
				iconContent : preDefinedIcon.icon,
				iconHeight : preDefinedIcon.height,
				iconWidth : preDefinedIcon.width,
				tooltipContent : preDefinedIcon.tooltip
			}
		);
	}
}

/**
@--------------------------------------------------------------------------------------------------------------------------

@class ToggleContentsButtonClickEL
@classdesc click event listener for the toogle button
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class ToggleContentsButtonClickEL {

	#noteDialog = null;

	/*
	constructor
	*/

	constructor ( noteDialog ) {
		Object.freeze ( this );
		this.#noteDialog = noteDialog;
	}

	destructor ( ) {
		this.#noteDialog = null;
	}

	/**
	click event listener for the toogle button on the toolbar
	*/

	handleEvent ( clickEvent ) {
		clickEvent.target.textContent = '▼' === clickEvent.target.textContent ? '▶' : '▼';
		this.#noteDialog.toogleContents ( );
	}
}

/**
@--------------------------------------------------------------------------------------------------------------------------

@class OpenFileInputChangeEL
@classdesc change event listener for the temp open file input
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class OpenFileInputChangeEL {

	#noteDialog = null;

	/*
	constructor
	*/

	constructor ( noteDialog ) {
		Object.freeze ( this );
		this.#noteDialog = noteDialog;
	}

	/**
	Change event listener for the input associated on the open file button
	@private
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		const fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			try {
				theNoteDialogToolbarData.loadJson ( JSON.parse ( fileReader.result ) );
				this.#noteDialog.updateToolbar ( );
			}
			catch ( err ) {
				if ( err instanceof Error ) {
					console.error ( err );
				}
			}
		};
		fileReader.readAsText ( changeEvent.target.files [ ZERO ] );
	}
}

/**
@--------------------------------------------------------------------------------------------------------------------------

@class OpenFileButtonClickEL
@classdesc click event listener for the open file button
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class OpenFileButtonClickEL {

	#noteDialog = null;

	/*
	constructor
	*/

	constructor ( noteDialog ) {
		Object.freeze ( this );
		this.#noteDialog = noteDialog;
	}

	/**
	click event listener for the open file button on the toolbar
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		theUtilities.openFile ( new OpenFileInputChangeEL ( this.#noteDialog ), '.json' );
	}
}

export {
	AddressButtonClickEL,
	NoteDialogGeoCoderHelper,
	AllControlsFocusEL,
	UrlInputBlurEL,
	AllControlsInputEL,
	EditionButtonsClickEL,
	IconSelectorChangeEL,
	ToggleContentsButtonClickEL,
	OpenFileButtonClickEL
};

/*
@------------------------------------------------------------------------------------------------------------------------------

end of NoteDialogEventListeners.js file

@------------------------------------------------------------------------------------------------------------------------------
*/