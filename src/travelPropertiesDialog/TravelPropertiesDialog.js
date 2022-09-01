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
		- created
Doc reviewed ...
Tests ...
*/

import DockableBaseDialog from '../baseDialog/DockableBaseDialog.js';
import TextInputControl from '../textInputControl/TextInputControl.js';
import theTranslator from '../UILib/Translator.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import SortableListControl from '../sortableListControl/SortableListControl.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTravelEditor from '../core/TravelEditor.js';
import RouteContextMenu from '../contextMenus/RouteContextMenu.js';
import theConfig from '../data/Config.js';
import theHTMLSanitizer from '../core/lib/HTMLSanitizer.js';
import theEventDispatcher from '../core/lib/EventDispatcher.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the TravelName input
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelNameInput {

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
		theTravelNotesData.travel.name = theHTMLSanitizer.sanitizeToJsString ( changeEvent.target.value );
		document.title =
			'Travel & Notes' +
			( '' === theTravelNotesData.travel.name ? '' : ' - ' + theTravelNotesData.travel.name );
		theEventDispatcher.dispatch ( 'roadbookupdate' );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the TravelPropertiesDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelPropertiesDialog extends DockableBaseDialog {

	/**
	The travel name control
	@type {TextInputControl}
	*/

	#travelNameControl = null;

	/**
	The routes control
	@type {SortableListControl}
	*/

	#travelRoutesControl = null;

	/**
	The constructor
	*/

	constructor ( ) {
		super ( theConfig.travelPropertiesDialog.dialogX, theConfig.travelPropertiesDialog.dialogY );
		this.#travelNameControl = new TextInputControl (
			theTranslator.getText ( 'TravelPropertiesDialog - Name' ),
			new TravelNameInput ( )
		);
		this.#travelNameControl.value = theTravelNotesData.travel.name;
		this.#travelRoutesControl = new SortableListControl (
			theTravelEditor.routeDropped,
			RouteContextMenu,
			theTranslator.getText ( 'TravelPropertiesDialog - Routes' )
		);
	}

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	Overload of the BaseDialog contentHTMLElements property.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [ ].concat (
			this.#travelNameControl.controlHTMLElement,
			this.#travelRoutesControl.controlHTMLElement
		);
	}

	/**
	The dialog title. Overload of the BaseDialog.title property
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'TravelPropertiesDialog - Travel properties' ); }

	/**
	Update the content of the dialog
	*/

	updateContent ( ) {
		const contentHTMLElements = [];
		theTravelNotesData.travel.routes.forEach (
			route => {
				const routeName =
				( route.objId === theTravelNotesData.editedRouteObjId ? '🔴\u00a0' : '' ) +
				( route.chain ? '⛓\u00a0' : '' ) +
				(
					route.objId === theTravelNotesData.editedRouteObjId ?
						theTravelNotesData.travel.editedRoute.computedName :
						route.computedName
				);
				contentHTMLElements.push (
					theHTMLElementsFactory.create (
						'div',
						{
							textContent : routeName,
							dataset : { ObjId : String ( route.objId ) }
						}
					)
				);
			}
		);
		this.#travelRoutesControl.updateContent ( contentHTMLElements );
		this.#travelNameControl.value = theTravelNotesData.travel.name;
	}
}

export default TravelPropertiesDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */