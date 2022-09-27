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

import DockableBaseDialog from '../baseDialog/DockableBaseDialog.js';
import TextInputControl from '../../controls/textInputControl/TextInputControl.js';
import theTranslator from '../../core/uiLib/Translator.js';
import theTravelNotesData from '../../data/TravelNotesData.js';
import SortableListControl from '../../controls/sortableListControl/SortableListControl.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import theTravelEditor from '../../core/TravelEditor.js';
import RouteContextMenu from '../../contextMenus/RouteContextMenu.js';
import TravelNameChangeEL from './TravelNameChangeEL.js';
import theConfig from '../../data/Config.js';
import { ROUTE_EDITION_STATUS } from '../../main/Constants.js';

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
	}

	/**
	Create all the controls needed for the dialog.
	Overload of the base class createContentHTML
	*/

	createContentHTML ( ) {
		this.#travelNameControl = new TextInputControl (
			theTranslator.getText ( 'TravelPropertiesDialog - Name' ),
			{ controlChange : new TravelNameChangeEL ( ) }
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
		return [
			this.#travelNameControl.controlHTMLElement,
			this.#travelRoutesControl.controlHTMLElement
		];
	}

	/**
	The dialog title. Overload of the BaseDialog.title property
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'TravelPropertiesDialog - Travel properties' ); }

	/**
	Add a route in the route list  of the dialog
	@param {Route} route The route to add
	@param {Array.<HTMLElement>} listItemsHTMLElements The list to witch the routes are added
	*/

	#addRoute ( route, listItemsHTMLElements ) {
		const routeName =
		( route.editionStatus === ROUTE_EDITION_STATUS.notEdited ? '' : '🔴\u00a0' ) +
		( route.chain ? '⛓\u00a0' : '' ) +
		(
			route.objId === theTravelNotesData.editedRouteObjId ?
				theTravelNotesData.travel.editedRoute.computedName :
				route.computedName
		);
		listItemsHTMLElements.push (
			theHTMLElementsFactory.create (
				'div',
				{
					textContent : routeName,
					dataset : { ObjId : String ( route.objId ) }
				}
			)
		);
	}

	/**
	Update the content of the dialog
	*/

	updateContent ( ) {
		if ( ! this.#travelRoutesControl ) {
			return;
		}
		const listItemsHTMLElements = [];
		theTravelNotesData.travel.routes.forEach (
			route => {
				if ( route.objId === theTravelNotesData.editedRouteObjId ) {
					this.#addRoute ( theTravelNotesData.travel.editedRoute, listItemsHTMLElements );
				}
				else {
					this.#addRoute ( route, listItemsHTMLElements );
				}
			}
		);
		this.#travelRoutesControl.updateContent ( listItemsHTMLElements );
		this.#travelNameControl.value = theTravelNotesData.travel.name;
	}
}

export default TravelPropertiesDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */