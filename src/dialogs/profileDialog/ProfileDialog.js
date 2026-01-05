/*
Copyright - 2020 - wwwouaiebe - Contact: http//www.ouaie.be/

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
import ObjId from '../../data/ObjId.js';
import NonModalBaseDialog from '../baseDialog/NonModalBaseDialog.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import theEventDispatcher from '../../core/lib/EventDispatcher.js';
import theUtilities from '../../core/uiLib/Utilities.js';
import SvgProfileBuilder from '../../core/lib/SvgProfileBuilder.js';
import SvgContextMenuEL from './SvgContextMenuEL.js';
import SvgMouseLeaveEL from './SvgMouseLeaveEL.js';
import SvgMouseMoveEL from './SvgMouseMoveEL.js';
import { ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
a float window containing a route profile
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ProfileDialog extends NonModalBaseDialog {

	/**
	The svg profile
	@type {SVGElement}
	*/

	#svg = null;

	/**
	The svg div
	@type {HTMLElement}
	*/

	#svgDiv;

	/**
	A div under the svg profile with ascent, descent and distance
	@type {HTMLElement}
	*/

	#ascentDiv;

	/**
	A div under the svg profile with the route name
	@type {HTMLElement}
	*/

	#nameDiv;

	/**
	contextmenu event listener
	@type {SvgContextMenuEL}
	*/

	#svgContextMenuEL = null;

	/**
	mousemove event listener
	@type {SvgMouseMoveEL}
	*/

	#svgMouseMoveEL = null;

	/**
	mouseleave event listener
	@type {SvgMouseLeaveEL}
	*/

	#svgMouseLeaveEL = null;

	/**
	An objId for the position marker
	@type {Number}
	*/

	#markerObjId = ObjId.nextObjId;

	/**
	the displayed route objId
	@type {Number}
	*/

	#routeObjId;

	/**
	remove all the content of the dialog and remove event listeners
	*/

	#clean ( ) {
		if ( this.#svg ) {
			this.#svg.removeEventListener ( 'contextmenu', this.#svgContextMenuEL, false );
			this.#svg.removeEventListener ( 'mousemove', this.#svgMouseMoveEL, false );
			this.#svg.removeEventListener ( 'mouseleave', this.#svgMouseLeaveEL, false );
			this.#svgDiv.removeChild ( this.#svg );
			this.#svg = null;
			theEventDispatcher.dispatch ( 'removeobject', { objId : this.#markerObjId } );
			this.#nameDiv.textContent = '';
			this.#ascentDiv.textContent = '';
		}
	}

	/**
	Set the content of the dialog : heading, svg profile and ascent text
	@param {Route} route The route for witch the profile will be displayed
	*/

	setContent ( route ) {
		this.#routeObjId = route.objId;
		this.#clean ( );
		this.#svg = new SvgProfileBuilder ( ).createSvg ( route );
		this.#svg.dataset.tanObjId = route.objId;
		this.#svg.dataset.tanMarkerObjId = this.#markerObjId;
		this.#svg.addEventListener ( 'contextmenu', this.#svgContextMenuEL, false );
		this.#svg.addEventListener ( 'mousemove', this.#svgMouseMoveEL, false );
		this.#svg.addEventListener ( 'mouseleave', this.#svgMouseLeaveEL, false );
		this.#svgDiv.appendChild ( this.#svg );
		this.setContentName ( route );
	}

	/**
	This method update the profile name. Also called when the user changes the route name with the RoutePropertiesDialog
	or when a waypoint is updated with the geocoder
	@param {Route} route The route for witch the profile is displayed
	*/

	setContentName ( route ) {
		this.#nameDiv.textContent = theTranslator.getText (
			'ProfileWindow - Route {name}',
			{
				name : route.computedName
			}
		);
		this.#ascentDiv.textContent = theTranslator.getText (
			'ProfileWindow - Ascent: {ascent} m. - Descent: {descent} m. - Distance: {distance}',
			{
				ascent : route.itinerary.ascent.toFixed ( ZERO ),
				descent : route.itinerary.descent.toFixed ( ZERO ),
				distance : theUtilities.formatDistance ( route.distance )
			}
		);
	}

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
		this.#svgContextMenuEL = new SvgContextMenuEL ( );
		this.#svgMouseMoveEL = new SvgMouseMoveEL ( );
		this.#svgMouseLeaveEL = new SvgMouseLeaveEL ( );
		this.#svgDiv = theHTMLElementsFactory.create ( 'div', { className : 'travelnotes-profile-dialog-svg-container' } );
		this.#nameDiv = theHTMLElementsFactory.create ( 'div', { className : 'travelnotes-profile-dialog-name-container' } );
		this.#ascentDiv = theHTMLElementsFactory.create (
			'div',
			{ className : 'travelnotes-profile-dialog-ascent-container' }
		);
	}

	/**
	Create all the controls needed for the dialog.
	Overload of the base class createContentHTML
	*/

	createContentHTML ( ) {
	}

	/**
	Overload of the BaseDialog.onCancel ( ) method.
	*/

	onCancel ( ) {
		this.#clean ( );
		super.onCancel ( );
		theEventDispatcher.dispatch (
			'profileclosed',
			{
				objId : this.#routeObjId
			}
		);
	}

	/**
	Show the dialog
	*/

	show ( ) {
		super.show ( );
		this.mover.moveDialogToTopLeft ( );
	}

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	Overload of the base class contentHTMLElements
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [
			this.#svgDiv,
			this.#nameDiv,
			this.#ascentDiv
		];
	}

	/**
	The title of the DialogControl. Overload of the base class get title
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'ProfileWindow - Profile' ); }
}

export default ProfileDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */