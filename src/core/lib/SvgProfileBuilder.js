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

import { SVG_NS, ZERO, TWO, DISTANCE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class provides methods to build a Route profile
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SvgProfileBuilder {

	/**
	A reference to the route for witch the profile is createDistanceTexts
	@type {Route}
	*/

	#route;

	/**
	The created svg with the profile
	@type {SVGElement}
	*/

	#svg;

	/**
	The scale used in the Y direction
	@type {Number}
	*/

	#YScale;

	/**
	The scale used in the Y direction
	@type {Number}
	*/

	#XScale;

	/**
	The smallest elevation
	@type {Number}
	*/

	#minElev;

	/**
	The greatest elevation
	@type {Number}
	*/

	#maxElev;

	/**
	The delta between the max and the min elevation
	@type {Number}
	*/

	#deltaElev;

	/**
	The margin around the profile
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get PROFILE_MARGIN ( ) { return 100; }

	/**
	The height of the profile
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get PROFILE_HEIGHT ( ) { return 500; }

	/**
	The width of the profile
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get PROFILE_WIDTH ( ) { return 1000; }

	/**
	The horizontal distance between the texts and the vertical line of the flag
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get X_DELTA_TEXT ( ) { return 10; }

	/**
	The vertical distance between texts of the flag
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get Y_DELTA_TEXT ( ) { return 30; }

	/**
	The possible X scales for the elevation
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #X_SCALES ( ) { return [ 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000 ]; }

	/**
	The possible Y scales for the elevation
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #Y_SCALES ( ) { return [ 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000 ]; } // vScales

	/**
	The maximum number of legends in the X direction
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MAX_X_LEGEND_NUMBER ( ) { return 8; }

	/**
	The maximum number of legends in the Y direction
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MAX_Y_LEGEND_NUMBER ( ) { return 4; }

	/**
	The left position of the profile inside the svg
	@type {String}
	*/

	static get #LEFT_PROFILE ( ) { return SvgProfileBuilder.PROFILE_MARGIN.toFixed ( ZERO ); }

	/**
	The right position of the profile inside the svg
	@type {String}
	*/

	static get #RIGHT_PROFILE ( ) {
		return ( SvgProfileBuilder.PROFILE_MARGIN + SvgProfileBuilder.PROFILE_WIDTH ).toFixed ( ZERO );
	}

	/**
	The top position of the profile inside the svg
	@type {String}
	*/

	static get #TOP_PROFILE ( ) { return SvgProfileBuilder.PROFILE_MARGIN.toFixed ( ZERO ); }

	/**
	The bottom position of the profile inside the svg
	@type {String}
	*/

	static get #BOTTOM_PROFILE ( ) {
		return ( SvgProfileBuilder.PROFILE_MARGIN + SvgProfileBuilder.PROFILE_HEIGHT ).toFixed ( ZERO );
	}

	/**
	The left position of the texts inside the svg
	@type {String}
	*/

	static get #LEFT_TEXT_PROFILE ( ) {
		return ( SvgProfileBuilder.PROFILE_MARGIN - SvgProfileBuilder.X_DELTA_TEXT ).toFixed ( ZERO );
	}

	/**
	The right position of the texts inside the svg
	@type {String}
	*/

	static get #RIGHT_TEXT_PROFILE ( ) {
		return (
			SvgProfileBuilder.PROFILE_MARGIN +
			SvgProfileBuilder.PROFILE_WIDTH +
			SvgProfileBuilder.X_DELTA_TEXT
		).toFixed ( ZERO );
	}

	/**
	The bottom position of the texts inside the svg
	@type {Number}
	*/

	static get #BOTTOM_TEXT_PROFILE ( ) {
		return SvgProfileBuilder.PROFILE_MARGIN +
			SvgProfileBuilder.PROFILE_HEIGHT +
			( SvgProfileBuilder.PROFILE_MARGIN / TWO );
	}

	/**
	This method creates the profile polyline in the svg element
	*/

	#createProfilePolyline ( ) {
		let pointsAttribute = '';
		let distance = ZERO;
		let xPolyline = ZERO;
		let yPolyline = ZERO;
		this.#route.itinerary.itineraryPoints.forEach (
			itineraryPoint => {
				xPolyline = ( SvgProfileBuilder.PROFILE_MARGIN + ( this.#XScale * distance ) ).toFixed ( ZERO );
				yPolyline =
					(
						SvgProfileBuilder.PROFILE_MARGIN +
						( this.#YScale * ( this.#maxElev - itineraryPoint.elev ) )
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
	*/

	#createFramePolyline ( ) {
		const pointsAttribute =
			SvgProfileBuilder.#LEFT_PROFILE + ',' +
			SvgProfileBuilder.#TOP_PROFILE + ' ' + SvgProfileBuilder.#LEFT_PROFILE + ',' +
			SvgProfileBuilder.#BOTTOM_PROFILE + ' ' + SvgProfileBuilder.#RIGHT_PROFILE + ',' +
			SvgProfileBuilder.#BOTTOM_PROFILE + ' ' + SvgProfileBuilder.#RIGHT_PROFILE + ',' +
			SvgProfileBuilder.#TOP_PROFILE;
		const polyline = document.createElementNS ( SVG_NS, 'polyline' );
		polyline.setAttributeNS ( null, 'points', pointsAttribute );
		polyline.setAttributeNS ( null, 'class', 'TravelNotes-Route-SvgProfile-framePolyline' );
		this.#svg.appendChild ( polyline );
	}

	/**
	This method creates the distance texts in the svg element
	*/

	#createDistanceTexts ( ) {
		let minDelta = Number.MAX_VALUE;
		let selectedScale = 0;
		SvgProfileBuilder.#X_SCALES.forEach (
			scale => {
				const currentDelta = Math.abs ( ( this.#route.distance / SvgProfileBuilder.#MAX_X_LEGEND_NUMBER ) - scale );
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
				SvgProfileBuilder.PROFILE_MARGIN + ( ( distance - this.#route.chainedDistance ) * this.#XScale )
			);
			distanceText.setAttributeNS ( null, 'y', SvgProfileBuilder.#BOTTOM_TEXT_PROFILE );
			distanceText.setAttributeNS ( null, 'text-anchor', 'start' );
			this.#svg.appendChild ( distanceText );
			distance += selectedScale;
		}
	}

	/**
	This method creates the elevation texts in the svg element
	*/

	#createElevTexts ( ) {
		let minDelta = Number.MAX_VALUE;
		let selectedScale = ZERO;
		SvgProfileBuilder.#Y_SCALES.forEach (
			scale => {
				const currentDelta = Math.abs ( ( this.#deltaElev / SvgProfileBuilder.#MAX_Y_LEGEND_NUMBER ) - scale );
				if ( currentDelta < minDelta ) {
					minDelta = currentDelta;
					selectedScale = scale;
				}
			}
		);
		let elev = Math.ceil ( this.#minElev / selectedScale ) * selectedScale;
		while ( elev < this.#maxElev ) {
			const elevTextY = SvgProfileBuilder.PROFILE_MARGIN + ( ( this.#maxElev - elev ) * this.#YScale );
			const rightElevText = document.createElementNS ( SVG_NS, 'text' );
			rightElevText.appendChild ( document.createTextNode ( elev.toFixed ( ZERO ) ) );
			rightElevText.setAttributeNS ( null, 'class', 'TravelNotes-Route-SvgProfile-elevLegend' );
			rightElevText.setAttributeNS ( null, 'x', SvgProfileBuilder.#RIGHT_TEXT_PROFILE );
			rightElevText.setAttributeNS ( null, 'y', elevTextY );
			rightElevText.setAttributeNS ( null, 'text-anchor', 'start' );
			this.#svg.appendChild ( rightElevText );
			const leftElevText = document.createElementNS ( SVG_NS, 'text' );
			leftElevText.appendChild ( document.createTextNode ( elev.toFixed ( ZERO ) ) );
			leftElevText.setAttributeNS ( null, 'class', 'TravelNotes-Route-SvgProfile-elevLegend' );
			leftElevText.setAttributeNS ( null, 'x', SvgProfileBuilder.#LEFT_TEXT_PROFILE );
			leftElevText.setAttributeNS ( null, 'y', elevTextY );
			leftElevText.setAttributeNS ( null, 'text-anchor', 'end' );
			this.#svg.appendChild ( leftElevText );
			elev += selectedScale;
		}
	}

	/**
	This method creates the svg element
	*/

	#createSvgElement ( ) {
		this.#svg = document.createElementNS ( SVG_NS, 'svg' );
		this.#svg.setAttributeNS (
			null,
			'viewBox',
			'0 0 ' + ( SvgProfileBuilder.PROFILE_WIDTH + ( TWO * SvgProfileBuilder.PROFILE_MARGIN ) ) +
			' ' + ( SvgProfileBuilder.PROFILE_HEIGHT + ( TWO * SvgProfileBuilder.PROFILE_MARGIN ) )
		);
		this.#svg.setAttributeNS ( null, 'class', 'TravelNotes-Route-SvgProfile' );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	this method creates the svg with the Route profile. This svg is displayed in the profile window and in the roadbook
	@param {Route} route The route for witch the svg must be created
	@return {SVGElement} the svg element with the profile
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
		this.#YScale = SvgProfileBuilder.PROFILE_HEIGHT / this.#deltaElev;
		this.#XScale = SvgProfileBuilder.PROFILE_WIDTH / this.#route.distance;

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

/* --- End of file --------------------------------------------------------------------------------------------------------- */