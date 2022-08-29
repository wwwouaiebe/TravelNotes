
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import RedSliderInputEL from '../colorControl/RedSliderInputEL.js';
import { ZERO } from '../main/Constants.js';

class RedSliderControlElement {

	#redSliderInputEL;

	#redSliderInput;

	/* eslint-disable-next-line no-magic-numbers */
	static get #SLIDER_MAX_VALUE ( ) { return 100; }

	/* eslint-disable-next-line no-magic-numbers */
	static get #SLIDER_STEP ( ) { return 20; }

	/* eslint-disable-next-line no-magic-numbers */
	static get #MAX_COLOR ( ) { return 255; }

	constructor ( colorControl ) {
		this.#redSliderInputEL = new RedSliderInputEL (
			colorControl,
			RedSliderControlElement.#MAX_COLOR / RedSliderControlElement.#SLIDER_MAX_VALUE );
		this.#redSliderInput = theHTMLElementsFactory.create ( 'input',
			{
				type : 'range',
				value : ZERO,
				min : ZERO,
				max : RedSliderControlElement.#SLIDER_MAX_VALUE,
				step : RedSliderControlElement.#SLIDER_STEP

			},
			theHTMLElementsFactory.create ( 'div', null, colorControl.HTMLElements [ ZERO ] )
		);
		this.#redSliderInput.addEventListener ( 'input', this.#redSliderInputEL, false );
		this.#redSliderInput.focus ( );
	}

	destructor ( ) {
		this.#redSliderInput.removeEventListener ( 'input', this.#redSliderInputEL, false );
		this.#redSliderInputEL = null;
	}
}

export default RedSliderControlElement;