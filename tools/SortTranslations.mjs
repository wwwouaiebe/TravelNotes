import fs from 'fs';
let translations;
translations = JSON.parse ( fs.readFileSync ( 'TravelNotesFR.json', 'utf8' ) );
translations.sort ( ( a,b ) => a.msgid.localeCompare ( b.msgid ) );
fs.writeFileSync ( 'TravelNotesFR.json', JSON.stringify ( translations, null, '\t' ) );
translations = JSON.parse ( fs.readFileSync ( 'TravelNotesEN.json', 'utf8' ) );
translations.sort ( ( a,b ) => a.msgid.localeCompare ( b.msgid ) );
fs.writeFileSync ( 'TravelNotesEN.json', JSON.stringify ( translations, null, '\t' ) );