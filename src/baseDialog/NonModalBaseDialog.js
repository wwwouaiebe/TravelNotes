import BaseDialog from '../BaseDialog/BaseDialog.js';
import { BackgroundDragOverEL } from '../baseDialog/BaseDialogBackgroundEventListeners.js';
import theTravelNotesData from '../data/TravelNotesData.js';

class NonModalBaseDialog extends BaseDialog {

	/**
	Drag over the background event listener
	@type {BackgroundDragOverEL}
	*/

	#backgroundDragOverEL;

	#createBackgroundDivEL ( ) {

		this.#backgroundDragOverEL = new BackgroundDragOverEL ( this.dragData, this.container );
		document.body.addEventListener ( 'dragover', this.#backgroundDragOverEL, false );
	}

	constructor ( ) {
		super ( );
	}

	/**
	Cancel button handler. Can be overloaded in the derived classes
	*/

	onCancel ( ) {
		document.body.removeEventListener ( 'dragover', this.#backgroundDragOverEL, false );
		this.#backgroundDragOverEL = null;
		super.onCancel ( );
		document.body.removeChild ( this.container );
	}

	show ( ) {
		super.show ( );
		this.dragData.background = theTravelNotesData.map.getContainer ( );
		this.#createBackgroundDivEL ( );
		document.body.appendChild ( this.container );
		this.centerDialog ( );
	}
}

export default NonModalBaseDialog;