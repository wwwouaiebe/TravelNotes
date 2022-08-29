
import theTranslator from '../UILib/Translator.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import Color from '../colorControl/Color.js';
import { ZERO } from '../main/Constants.js';
import RgbInputEL from '../colorControl/RgbInputEL.js';

class RgbInputsControlElement {

	#rgbHTMLElement;

	#redInput;

	#greenInput;

	#blueInput;

	#rgbInputEL;

	/* eslint-disable-next-line no-magic-numbers */
	static get #MIN_COLOR ( ) { return 0; }

	/* eslint-disable-next-line no-magic-numbers */
	static get #MAX_COLOR ( ) { return 255; }

	#createColorInput ( inputText ) {
		theHTMLElementsFactory.create ( 'text', { value : inputText }, this.#rgbHTMLElement	);
		const inputHtmlElement = theHTMLElementsFactory.create ( 'input',
			{
				type : 'number',
				className : 'TravelNotes-ColorControl-NumberInput',
				min : RgbInputsControlElement.#MIN_COLOR,
				max : RgbInputsControlElement.#MAX_COLOR
			},
			this.#rgbHTMLElement
		);
		inputHtmlElement.addEventListener ( 'input', this.#rgbInputEL, false );

		return inputHtmlElement;
	}

	constructor ( colorControl ) {
		Object.freeze ( this );
		this.#rgbInputEL = new RgbInputEL ( colorControl, this );
		this.#rgbHTMLElement = theHTMLElementsFactory.create ( 'div', null, colorControl.HTMLElements [ ZERO ] );
		this.#redInput = this.#createColorInput ( theTranslator.getText ( 'ColorControl - Red' ) );
		this.#greenInput = this.#createColorInput ( theTranslator.getText ( 'ColorControl - Green' ) );
		this.#blueInput = this.#createColorInput ( theTranslator.getText ( 'ColorControl - Blue' ) );
	}

	destructor ( ) {
		this.#redInput.removeEventListener ( 'input', this.#rgbInputEL, false );
		this.#greenInput.removeEventListener ( 'input', this.#rgbInputEL, false );
		this.#blueInput.removeEventListener ( 'input', this.#rgbInputEL, false );
		this.#rgbInputEL = null;
	}

	set cssColor ( cssColor ) {
		let color = Color.fromCss ( cssColor );
		this.#redInput.value = color.red;
		this.#greenInput.value = color.green;
		this.#blueInput.value = color.blue;
	}

	get color ( ) {
		return new Color (
			Number.parseInt ( this.#redInput.value ),
			Number.parseInt ( this.#greenInput.value ),
			Number.parseInt ( this.#blueInput.value )
		);
	}
}

export default RgbInputsControlElement;