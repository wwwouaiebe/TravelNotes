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
	- v1.2.0:
		- created
	- v2.0.0:
		- Issue ♯147 : Add the travel name to gpx file name
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import theDataSearchEngine from '../data/DataSearchEngine.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theUtilities from '../UILib/Utilities.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is used to create gpx files
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class GpxFactory {

	/**
	The gpx string to write in the gpx file
	@type {String}
	*/

	#gpxString;

	/**
	The time stamp added in the gpx
	@type {String}
	*/

	#timeStamp;

	/**
	A reference to the Route for witch the gpx file is created
	@type {Route}
	*/

	#route;

	/**
	Simple constant for gpx presentation
	@type {String}
	*/

	static get #TAB0 ( ) { return '\n'; }

	/**
	Simple constant for gpx presentation
	@type {String}
	*/

	static get #TAB1 ( ) { return '\n\t'; }

	/**
	Simple constant for gpx presentation
	@type {String}
	*/

	static get #TAB2 ( ) { return '\n\t\t'; }

	/**
	Simple constant for gpx presentation
	@type {String}
	*/

	static get #TAB3 ( ) { return '\n\t\t\t'; }

	/**
	Simple constant for gpx presentation
	@type {String}
	*/

	static get #TAB4 ( ) { return '\n\t\t\t\t'; }

	/**
	Creates the header of the gpx file
	*/

	#addHeader ( ) {

		// header
		this.#gpxString = '<?xml version="1.0"?>' + GpxFactory.#TAB0;
		this.#gpxString += '<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
		'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
		'xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" ' +
		'version="1.1" creator="TravelNotes">';
	}

	/**
	Replace the chars &, ', ", < and > with entities
	@param {String} text The text containing reserved chars
	@return {String} The text with reserved chars replaced by entities
	*/

	#replaceEntities ( text ) {
		return ( text.replaceAll ( '&', '&amp;' )
			.replaceAll ( /\u0027/g, '&apos;' )
			.replaceAll ( /"/g, '&quot;' )
			.replaceAll ( /</g, '&lt;' )
			.replaceAll ( />/g, '&gt;' )
		);
	}

	/**
	Add the waypoints to the gpx file
	*/

	#addWayPoints ( ) {
		const wayPointsIterator = this.#route.wayPoints.iterator;
		while ( ! wayPointsIterator.done ) {
			this.#gpxString +=
				GpxFactory.#TAB1 + '<wpt lat="' + wayPointsIterator.value.lat + '" lon="' + wayPointsIterator.value.lng + '">' +
				GpxFactory.#TAB2 + this.#timeStamp +
				GpxFactory.#TAB2 + '<name>' + this.#replaceEntities ( wayPointsIterator.value.fullName ) + '</name>' +
				GpxFactory.#TAB1 + '</wpt>';

		}
	}

	/**
	Add the route to the gpx file
	*/

	#addRoute ( ) {
		this.#gpxString += GpxFactory.#TAB1 + '<rte>';
		this.#gpxString += GpxFactory.#TAB2 + '<name>' + this.#replaceEntities ( this.#route.computedName ) + '</name>';
		const maneuverIterator = this.#route.itinerary.maneuvers.iterator;
		while ( ! maneuverIterator.done ) {
			const wayPoint = this.#route.itinerary.itineraryPoints.getAt (
				maneuverIterator.value.itineraryPointObjId
			);
			this.#gpxString +=
				GpxFactory.#TAB2 + '<rtept lat="' + wayPoint.lat + '" lon="' + wayPoint.lng + '">' +
				GpxFactory.#TAB3 + this.#timeStamp +
				GpxFactory.#TAB3 + '<desc>' + this.#replaceEntities ( maneuverIterator.value.instruction ) + '</desc>' +
				GpxFactory.#TAB2 + '</rtept>';
		}
		this.#gpxString += GpxFactory.#TAB1 + '</rte>';
	}

	/**
	Add the track to the gpx file
	*/

	#addTrack ( ) {
		this.#gpxString += GpxFactory.#TAB1 + '<trk>';
		this.#gpxString += GpxFactory.#TAB2 + '<name>' + this.#replaceEntities ( this.#route.computedName ) + '</name>';
		this.#gpxString += GpxFactory.#TAB2 + '<trkseg>';
		const itineraryPointsIterator = this.#route.itinerary.itineraryPoints.iterator;
		while ( ! itineraryPointsIterator.done ) {
			this.#gpxString +=
				GpxFactory.#TAB3 +
				'<trkpt lat="' + itineraryPointsIterator.value.lat + '" lon="' + itineraryPointsIterator.value.lng + '">' +
				GpxFactory.#TAB4 + this.#timeStamp +
				GpxFactory.#TAB4 + '<ele>' + itineraryPointsIterator.value.elev + '</ele>' +
				GpxFactory.#TAB3 + '</trkpt>';
		}
		this.#gpxString += GpxFactory.#TAB2 + '</trkseg>';
		this.#gpxString += GpxFactory.#TAB1 + '</trk>';
	}

	/**
	Add the footer to the gpx file
	*/

	#addFooter ( ) {
		this.#gpxString += GpxFactory.#TAB0 + '</gpx>';
	}

	/**
	Save the gpx string to a file
	*/

	#saveGpxToFile ( ) {
		let fileName =
			( '' === theTravelNotesData.travel.name ? '' : theTravelNotesData.travel.name + ' - ' ) + this.#route.computedName;
		if ( '' === fileName ) {
			fileName = 'TravelNote';
		}
		fileName += '.gpx';
		theUtilities.saveFile ( fileName, this.#gpxString, 'application/xml' );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Transform a route into a gpx file
	@param {Number} routeObjId the objId of the route to save in a gpx file
	*/

	routeToGpx ( routeObjId ) {
		this.#route = theDataSearchEngine.getRoute ( routeObjId );
		if ( ! this.#route ) {
			return;
		}
		this.#timeStamp = '<time>' + new Date ( ).toISOString ( ) + '</time>';

		this.#addHeader ( );
		this.#addWayPoints ( );
		this.#addRoute ( );
		this.#addTrack ( );
		this.#addFooter ( );
		this.#saveGpxToFile ( );
	}
}

export default GpxFactory;

/* --- End of file --------------------------------------------------------------------------------------------------------- */