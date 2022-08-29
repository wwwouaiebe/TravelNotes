
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import { ZERO } from '../main/Constants.js';

class SampleControlElement {

	#sampleHTMLElement;

	constructor ( colorControl ) {
		Object.freeze ( this );
		this.#sampleHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-ColorControl-ColorSampleDiv'
			},
			colorControl.HTMLElements [ ZERO ]
		);
	}

	set cssColor ( cssColor ) {
		this.#sampleHTMLElement.style [ 'background-color' ] = cssColor;
	}

	get cssColor ( ) {
		return this.#sampleHTMLElement.style [ 'background-color' ];
	}
}

export default SampleControlElement;