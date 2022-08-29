
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import { ZERO } from '../main/Constants.js';
import Color from '../colorControl/Color.js';
import ColorButtonClickEL from '../colorControl/ColorButtonClickEL.js';

class ColorButtonsControlElement {

	#colorButtonsHTMLElement;

	#colorButtons;

	#colorButtonClickEL;

	/* eslint-disable-next-line no-magic-numbers */
	static get #ROW_NUMBERS ( ) { return 6; }

	/* eslint-disable-next-line no-magic-numbers */
	static get #CELL_NUMBERS ( ) { return 6; }

	/* eslint-disable-next-line no-magic-numbers */
	static get #DELTA_COLOR ( ) { return 51; }

	/* eslint-disable-next-line no-magic-numbers */
	static get #MIN_COLOR ( ) { return 0; }

	/* eslint-disable-next-line no-magic-numbers */
	static get #MAX_COLOR ( ) { return 255; }

	constructor ( colorControl ) {
		Object.freeze ( this );
		this.#colorButtons = [];
		this.#colorButtonClickEL = new ColorButtonClickEL ( colorControl );
		this.#colorButtonsHTMLElement = theHTMLElementsFactory.create ( 'div', null, colorControl.HTMLElements [ ZERO ] );
		for ( let rowCounter = ZERO; rowCounter < ColorButtonsControlElement.#ROW_NUMBERS; ++ rowCounter ) {
			const colorButtonsRowHTMLElement = theHTMLElementsFactory.create ( 'div', null, this.#colorButtonsHTMLElement );
			for ( let cellCounter = ZERO; cellCounter < ColorButtonsControlElement.#CELL_NUMBERS; ++ cellCounter ) {
				let colorButton = theHTMLElementsFactory.create (
					'div',
					{
						className : 'TravelNotes-ColorControl-CellColorDiv'
					},
					colorButtonsRowHTMLElement
				);
				colorButton.addEventListener ( 'click', this.#colorButtonClickEL, false );
				this.#colorButtons.push ( colorButton );
			}
		}
	}

	destructor ( ) {
		this.#colorButtons.forEach (
			colorButton => { colorButton.removeEventListener ( 'click', this.#colorButtonClickEL, false ); }
		);
		this.#colorButtonClickEL = null;
	}

	set red ( red ) {
		let backgroundColor = new Color ( red, ColorButtonsControlElement.#MIN_COLOR, ColorButtonsControlElement.#MIN_COLOR );
		this.#colorButtons.forEach (
			colorButton => {
				colorButton.style [ 'background-color' ] = backgroundColor.cssColor;
				if ( ColorButtonsControlElement.#MAX_COLOR <= backgroundColor.green ) {
					backgroundColor.green = ColorButtonsControlElement.#MIN_COLOR;
					backgroundColor.blue += ColorButtonsControlElement.#DELTA_COLOR;
				}
				else {
					backgroundColor.green += ColorButtonsControlElement.#DELTA_COLOR;
				}
			}
		);
	}
}

export default ColorButtonsControlElement;