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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Enum for icons used by Mapbox and OSRM
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

export const ICON_LIST = Object.freeze (
	{
		turn : Object.freeze (
			{
				default : 'undefined',
				'sharp left' : 'turn-sharp-left',
				left : 'turn-left',
				'slight left' : 'turn-slight-left',
				straight : 'turn-straight',
				'slight right' : 'turn-slight-right',
				right : 'turn-right',
				'sharp right' : 'turn-sharp-right',
				uturn : 'turn-u-turn'
			}
		),
		'new name' : Object.freeze (
			{
				default : 'undefined',
				'sharp left' : 'new-name-sharp-left',
				left : 'new-name-left',
				'slight left' : 'new-name-slight-left',
				straight : 'new-name-straight',
				'slight right' : 'new-name-slight-right',
				right : 'new-name-right',
				'sharp right' : 'new-name-sharp-right'
			}
		),
		depart : Object.freeze (
			{
				default : 'depart-default',
				'sharp left' : 'depart-left',
				left : 'depart-left',
				'slight left' : 'depart-left',
				straight : 'depart-default',
				'slight right' : 'depart-right',
				right : 'depart-right',
				'sharp right' : 'depart-right'
			}
		),
		arrive : Object.freeze (
			{
				default : 'arrive-default',
				'sharp left' : 'arrive-left',
				left : 'arrive-left',
				'slight left' : 'arrive-left',
				straight : 'arrive-default',
				'slight right' : 'arrive-right',
				right : 'arrive-right',
				'sharp right' : 'arrive-right'
			}
		),
		merge : Object.freeze (
			{
				default : 'merge-default',
				'sharp left' : 'merge-left',
				left : 'merge-left',
				'slight left' : 'merge-left',
				straight : 'merge-default',
				'slight right' : 'merge-right',
				right : 'merge-right',
				'sharp right' : 'merge-right'
			}
		),
		'on ramp' : Object.freeze (
			{
				default : 'undefined',
				'sharp left' : 'on-ramp-left',
				left : 'on-ramp-left',
				'slight left' : 'on-ramp-left',
				'slight right' : 'on-ramp-right',
				right : 'on-ramp-right',
				'sharp right' : 'on-ramp-right'
			}
		),
		'off ramp' : Object.freeze (
			{
				default : 'undefined',
				'sharp left' : 'off-ramp-left',
				left : 'off-ramp-left',
				'slight left' : 'off-ramp-left',
				'slight right' : 'off-ramp-right',
				right : 'off-ramp-right',
				'sharp right' : 'off-ramp-right'
			}
		),
		fork : Object.freeze (
			{
				default : 'undefined',
				'sharp left' : 'fork-left',
				left : 'fork-left',
				'slight left' : 'fork-left',
				'slight right' : 'fork-right',
				right : 'fork-right',
				'sharp right' : 'fork-right'
			}
		),
		'end of road' : Object.freeze (
			{
				default : 'undefined',
				'sharp left' : 'end-of-road-left',
				left : 'end-of-road-left',
				'slight left' : 'end-of-road-left',
				'slight right' : 'end-of-road-right',
				right : 'end-of-road-right',
				'sharp right' : 'end-of-road-right'
			}
		),
		continue : Object.freeze (
			{
				default : 'undefined',
				'sharp left' : 'continue-sharp-left',
				left : 'continue-left',
				'slight left' : 'continue-slight-left',
				straight : 'continue-straight',
				'slight right' : 'continue-slight-right',
				right : 'continue-right',
				'sharp right' : 'continue-sharp-right'
			}
		),
		roundabout : Object.freeze (
			{
				default : 'undefined',
				'sharp left' : 'roundabout-left',
				left : 'roundabout-left',
				'slight left' : 'roundabout-left',
				'slight right' : 'roundabout-right',
				right : 'roundabout-right',
				'sharp right' : 'roundabout-right'
			}
		),
		'exit roundabout' : Object.freeze (
			{
				default : 'undefined',
				left :	'roundabout-exit',
				'sharp left' : 'roundabout-exit',
				'slight left' : 'roundabout-exit',
				right : 'roundabout-exit',
				'sharp right' : 'roundabout-exit',
				'slight right' : 'roundabout-exit',
				straight : 'roundabout-exit'
			}
		),
		rotary : Object.freeze (
			{
				default : 'undefined',
				'sharp left' : 'rotary-left',
				left : 'rotary-left',
				'slight left' : 'rotary-left',
				'slight right' : 'rotary-right',
				right : 'rotary-right',
				'sharp right' : 'rotary-right'
			}
		),
		'roundabout turn' : Object.freeze (
			{
				default : 'undefined',
				'sharp left' : 'roundabout-turn-sharp-left',
				left : 'roundabout-turn-left',
				'slight left' : 'roundabout-turn-slight-left',
				straight : 'roundabout-turn-straight',
				'slight right' : 'roundabout-turn-slight-right',
				right : 'roundabout-turn-right',
				'sharp right' : 'roundabout-turn-sharp-right'
			}
		),
		notification : Object.freeze (
			{
				default : 'undefined'
			}
		),
		default : Object.freeze (
			{
				default : 'undefined'
			}
		)
	}
);

/* --- End of file --------------------------------------------------------------------------------------------------------- */