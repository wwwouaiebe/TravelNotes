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
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import theConfig from '../data/Config.js';
import theTranslator from '../UILib/Translator.js';

import { ICON_POSITION } from '../main/Constants.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@classdesc Search:<br/>
- the arrow to use for the direction to follow ( the arrow will be displayed in the address )<br/>
- the tooltip content

@------------------------------------------------------------------------------------------------------------------------------
*/

class ArrowAndTooltipFinder {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	This method set the direction arrow and tooltip
	@param {ComputeDataForMapIcon} computeData The object with the data needed for the computations
	@param {NoteDataForMapIcon} noteData The object with the nota data
	*/

	findData ( computeData, noteData ) {

		if ( null !== computeData.direction ) {
			if ( computeData.direction < theConfig.note.svgIcon.angleDirection.right ) {
				noteData.tooltipContent = theTranslator.getText ( 'MapIconDataBuilder - Turn right' );
				computeData.directionArrow = '🢂';
			}
			else if ( computeData.direction < theConfig.note.svgIcon.angleDirection.slightRight ) {
				noteData.tooltipContent = theTranslator.getText ( 'MapIconDataBuilder - Turn slight right' );
				computeData.directionArrow = '🢅';
			}
			else if ( computeData.direction < theConfig.note.svgIcon.angleDirection.continue ) {
				noteData.tooltipContent = theTranslator.getText ( 'MapIconDataBuilder - Continue' );
				computeData.directionArrow = '🢁';
			}
			else if ( computeData.direction < theConfig.note.svgIcon.angleDirection.slightLeft ) {
				noteData.tooltipContent = theTranslator.getText ( 'MapIconDataBuilder - Turn slight left' );
				computeData.directionArrow = '🢄';
			}
			else if ( computeData.direction < theConfig.note.svgIcon.angleDirection.left ) {
				noteData.tooltipContent = theTranslator.getText ( 'MapIconDataBuilder - Turn left' );
				computeData.directionArrow = '🢀';
			}
			else if ( computeData.direction < theConfig.note.svgIcon.angleDirection.sharpLeft ) {
				noteData.tooltipContent = theTranslator.getText ( 'MapIconDataBuilder - Turn sharp left' );
				computeData.directionArrow = '🢇';
			}
			else if ( computeData.direction < theConfig.note.svgIcon.angleDirection.sharpRight ) {
				noteData.tooltipContent = theTranslator.getText ( 'MapIconDataBuilder - Turn sharp right' );
				computeData.directionArrow = '🢆';
			}
			else {
				noteData.tooltipContent = theTranslator.getText ( 'MapIconDataBuilder - Turn right' );
				computeData.directionArrow = '🢂';
			}
		}

		if ( ICON_POSITION.atStart === computeData.positionOnRoute ) {
			noteData.tooltipContent = theTranslator.getText ( 'MapIconDataBuilder - Start' );
		}
		else if ( ICON_POSITION.atEnd === computeData.positionOnRoute ) {
			noteData.tooltipContent = theTranslator.getText ( 'MapIconDataBuilder - Stop' );
		}
	}
}

export default ArrowAndTooltipFinder;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of ArrowAndTooltipFinder.js file

@------------------------------------------------------------------------------------------------------------------------------
*/