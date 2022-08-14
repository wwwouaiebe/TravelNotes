import DialogControl from '../baseDialog/DialogControl.js';

class DragStartEL {

	constructor ( ) {
		Object.freeze ( this );
	}

	handleEvent ( /* dragStartEvent */ ) {
	}
}

class SortableListControl extends DialogControl {

	#dragStartEL;

	constructor ( ) {
		super ( );
		this.#dragStartEL = new DragStartEL ( );
	}

	set contentHTMLElements ( htmlElements ) {

		htmlElements.forEach (
			htmlElement => {
				htmlElement.draggable = true;
				htmlElement.addEventListener ( 'dragstart', this.#dragStartEL, false );
				this.HTMLElement.appendChild ( htmlElement );
			}
		);
	}

}

export default SortableListControl;