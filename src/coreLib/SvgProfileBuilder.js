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
	- v1.7.0:
		- created
	- v1.8.0:
		- Issue ♯98 : Elevation is not modified in the itinerary pane
	- v2.0.0:
		- Issue ♯135 : Remove innerHTML from code
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file SvgProfileBuilder.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module coreLib
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import { SVG_NS, SVG_PROFILE, ZERO, ONE, TWO, DISTANCE } from '../main/Constants.js';

const OUR_LEFT_PROFILE = SVG_PROFILE.margin.toFixed ( ZERO );
const OUR_BOTTOM_PROFILE = ( SVG_PROFILE.margin + SVG_PROFILE.height ).toFixed ( ZERO );
const OUR_RIGHT_PROFILE = ( SVG_PROFILE.margin + SVG_PROFILE.width ).toFixed ( ZERO );
const OUR_TOP_PROFILE = SVG_PROFILE.margin.toFixed ( ZERO );
const OUR_MAX_X_LEGEND_NUMBER = 8;
const OUR_MAX_Y_LEGEND_NUMBER = 4;
const OUR_RIGHT_TEXT_PROFILE = ( SVG_PROFILE.margin + SVG_PROFILE.width + SVG_PROFILE.xDeltaText ).toFixed ( ZERO );
const OUR_LEFT_TEXT_PROFILE = ( SVG_PROFILE.margin - SVG_PROFILE.xDeltaText ).toFixed ( ZERO );
const OUR_BOTTOM_TEXT_PROFILE = SVG_PROFILE.margin + SVG_PROFILE.height + ( SVG_PROFILE.margin / TWO );

/**
@------------------------------------------------------------------------------------------------------------------------------

@class
@classdesc This class provides methods to build a Route profile
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class SvgProfileBuilder {

	#route = null;

	#svg = null;
	#VScale = ONE;
	#HScale = ONE;

	#minElev = Number.MAX_VALUE;
	#maxElev = ZERO;
	#deltaElev = ZERO;

	/**
	This method creates the profile polyline in the svg element
	@private
	*/

	#createProfilePolyline ( ) {
		let pointsAttribute = '';
		let distance = ZERO;
		let xPolyline = ZERO;
		let yPolyline = ZERO;
		this.#route.itinerary.itineraryPoints.forEach (
			itineraryPoint => {
				xPolyline = ( SVG_PROFILE.margin + ( this.#HScale * distance ) ).toFixed ( ZERO );
				yPolyline =
					(
						SVG_PROFILE.margin +
						( this.#VScale * ( this.#maxElev - itineraryPoint.elev ) )
					)
						.toFixed ( ZERO );
				pointsAttribute += xPolyline + ',' + yPolyline + ' ';
				distance += itineraryPoint.distance;
			}
		);
		const polyline = document.createElementNS ( SVG_NS, 'polyline' );
		polyline.setAttributeNS ( null, 'points', pointsAttribute );
		polyline.setAttributeNS ( null, 'class', 'TravelNotes-Route-SvgProfile-profilePolyline' );
		this.#svg.appendChild ( polyline );
	}

	/**
	This method creates the frame polyline in the svg element
	@private
	*/

	#createFramePolyline ( ) {
		const pointsAttribute =
			OUR_LEFT_PROFILE + ',' + OUR_TOP_PROFILE + ' ' + OUR_LEFT_PROFILE + ',' + OUR_BOTTOM_PROFILE + ' ' +
			OUR_RIGHT_PROFILE + ',' + OUR_BOTTOM_PROFILE + ' ' + OUR_RIGHT_PROFILE + ',' + OUR_TOP_PROFILE;
		const polyline = document.createElementNS ( SVG_NS, 'polyline' );
		polyline.setAttributeNS ( null, 'points', pointsAttribute );
		polyline.setAttributeNS ( null, 'class', 'TravelNotes-Route-SvgProfile-framePolyline' );
		this.#svg.appendChild ( polyline );
	}

	/**
	This method creates the distance texts in the svg element
	@private
	*/

	#createDistanceTexts ( ) {

		let minDelta = Number.MAX_VALUE;
		let selectedScale = 0;
		SVG_PROFILE.hScales.forEach (
			scale => {
				const currentDelta = Math.abs ( ( this.#route.distance / OUR_MAX_X_LEGEND_NUMBER ) - scale );
				if ( currentDelta < minDelta ) {
					minDelta = currentDelta;
					selectedScale = scale;
				}
			}
		);
		let distance = Math.ceil ( this.#route.chainedDistance / selectedScale ) * selectedScale;
		while ( distance < this.#route.distance + this.#route.chainedDistance ) {
			const distanceText = document.createElementNS ( SVG_NS, 'text' );

			distanceText.appendChild (
				document.createTextNode (
					DISTANCE.metersInKm < selectedScale || ZERO < this.#route.chainedDistance
						?
						( distance / DISTANCE.metersInKm ) + ' km'
						:
						distance + ' m '
				)
			);
			distanceText.setAttributeNS ( null, 'class', 'TravelNotes-Route-SvgProfile-distLegend' );
			distanceText.setAttributeNS (
				null,
				'x',
				SVG_PROFILE.margin + ( ( distance - this.#route.chainedDistance ) * this.#HScale )
			);
			distanceText.setAttributeNS ( null, 'y', OUR_BOTTOM_TEXT_PROFILE );
			distanceText.setAttributeNS ( null, 'text-anchor', 'start' );
			this.#svg.appendChild ( distanceText );
			distance += selectedScale;
		}
	}

	/**
	This method creates the elevation texts in the svg element
	@private
	*/

	#createElevTexts ( ) {

		let minDelta = Number.MAX_VALUE;
		let selectedScale = ZERO;
		SVG_PROFILE.vScales.forEach (
			scale => {
				const currentDelta = Math.abs ( ( this.#deltaElev / OUR_MAX_Y_LEGEND_NUMBER ) - scale );
				if ( currentDelta < minDelta ) {
					minDelta = currentDelta;
					selectedScale = scale;
				}
			}
		);
		let elev = Math.ceil ( this.#minElev / selectedScale ) * selectedScale;
		while ( elev < this.#maxElev ) {
			const elevTextY = SVG_PROFILE.margin + ( ( this.#maxElev - elev ) * this.#VScale );
			const rightElevText = document.createElementNS ( SVG_NS, 'text' );
			rightElevText.appendChild ( document.createTextNode ( elev.toFixed ( ZERO ) ) );
			rightElevText.setAttributeNS ( null, 'class', 'TravelNotes-Route-SvgProfile-elevLegend' );
			rightElevText.setAttributeNS ( null, 'x', OUR_RIGHT_TEXT_PROFILE );
			rightElevText.setAttributeNS ( null, 'y', elevTextY );
			rightElevText.setAttributeNS ( null, 'text-anchor', 'start' );
			this.#svg.appendChild ( rightElevText );
			const leftElevText = document.createElementNS ( SVG_NS, 'text' );
			leftElevText.appendChild ( document.createTextNode ( elev.toFixed ( ZERO ) ) );
			leftElevText.setAttributeNS ( null, 'class', 'TravelNotes-Route-SvgProfile-elevLegend' );
			leftElevText.setAttributeNS ( null, 'x', OUR_LEFT_TEXT_PROFILE );
			leftElevText.setAttributeNS ( null, 'y', elevTextY );
			leftElevText.setAttributeNS ( null, 'text-anchor', 'end' );
			this.#svg.appendChild ( leftElevText );
			elev += selectedScale;
		}

	}

	/**
	This method creates the svg element
	@private
	*/

	#createSvgElement ( ) {
		this.#svg = document.createElementNS ( SVG_NS, 'svg' );
		this.#svg.setAttributeNS (
			null,
			'viewBox',
			'0 0 ' + ( SVG_PROFILE.width + ( TWO * SVG_PROFILE.margin ) ) +
			' ' + ( SVG_PROFILE.height + ( TWO * SVG_PROFILE.margin ) )
		);
		this.#svg.setAttributeNS ( null, 'class', 'TravelNotes-Route-SvgProfile' );
	}

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	this method creates the svg with the Route profile. This svg is displayed in the profile window and in the roadbook
	@param {Route} route The route for witch the svg must be created
	@return the svg element with the profile
	*/

	createSvg ( route ) {

		// Doing some computations for min and max elev and scale...
		this.#route = route;
		this.#minElev = Number.MAX_VALUE;
		this.#maxElev = ZERO;
		this.#route.itinerary.itineraryPoints.forEach (
			itineraryPoint => {
				this.#maxElev = Math.max ( this.#maxElev, itineraryPoint.elev );
				this.#minElev = Math.min ( this.#minElev, itineraryPoint.elev );
			}
		);
		this.#deltaElev = this.#maxElev - this.#minElev;
		this.#VScale = SVG_PROFILE.height / this.#deltaElev;
		this.#HScale = SVG_PROFILE.width / this.#route.distance;

		// ... then creates the svg
		this.#createSvgElement ( );
		this.#createProfilePolyline ( );
		this.#createFramePolyline ( );
		this.#createElevTexts ( );
		this.#createDistanceTexts ( );

		return this.#svg;
	}
}

export default SvgProfileBuilder;

/*
--- End of SvgProfileBuilder.js file ------------------------------------------------------------------------------------------
*/