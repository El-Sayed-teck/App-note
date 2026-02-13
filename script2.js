"use strict";
document.addEventListener('DOMContentLoaded', () => {

const addNoteBtn = document.querySelector(".add-note-form");
const dialog = document.querySelector(".dialog-container");
const closeBtn = document.querySelector(".close-dialog");
const saveNoteBtn = document.querySelector('.save-btn');
const noteTitle = document.querySelector('.note-title');
const noteContent = document.querySelector('.note-Content');
const noteContainer = document.querySelector('.notes-container');
const fallMessage = document.querySelector('.message');

let editingNoteId = null;
let notesArray = getNoteLocaly();
console.log(notesArray);
renderNotes()

function appState(){
  fallMessage.style.display = noteContainer.children.length === 0 ? 'block' : 'none';
}
appState();

function showDialog(){
  dialog.showModal();
  noteTitle.focus();
}

addNoteBtn.addEventListener("click",showDialog);

// function to store the notesArray in the localStorage
function storeNoteLocaly(arr){
  localStorage.setItem('usernotes', JSON.stringify(arr))
}

// function to get the notesArray from the localStorage
function getNoteLocaly(){
  const notesArray = JSON.parse(localStorage.getItem('usernotes')) || [];
  return notesArray;
}
const testArray = getNoteLocaly()
console.log(testArray)

function generateId(){
  //const newId = Math.floor(Math.random() * 1000).toString()
  return Math.floor(Math.random() * 1000).toString();
  //return Date.now().toString()
}

//function render notes for the dom
function renderNotes(){ 
  noteContainer.innerHTML = '';
  notesArray.filter(note => note !== null).forEach(note => createNoteElement(note));
}

// function to put the 
function saveNote(){
  appState()
  if(!noteTitle.value || !noteContent.value) return;
  function dateHoure(){
    const curTime = new Date()
    const curTimeDate = new Intl.DateTimeFormat("en-UK", {
        weekday: "short",
        month:"short",
        year:"numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(curTime);

      return curTimeDate;
  }
    
  if(editingNoteId){
    const editNoteIndex = notesArray.findIndex(note => note.id === editingNoteId)
    notesArray[editNoteIndex].timeDay = `Update: ${dateHoure()}`
    notesArray[editNoteIndex].noteTitle = noteTitle.value.trim();
    notesArray[editNoteIndex].noteContent = noteContent.value.trim();

    editingNoteId = null;

  }else{
  const userNoteObj = 
    {
    id: generateId(),
    timeDay: dateHoure(),
    noteTitle: noteTitle.value.trim(),
    noteContent: noteContent.value.trim(),
  }
  unshiftArray(userNoteObj);
  //createNoteElement(userNoteObj)
  
 }
  storeNoteLocaly(notesArray)

  renderNotes()

  closeDialog();
  console.log(notesArray)
  appState()
}

//function make an html div class note-box element to put in it the note
function createNoteElement(obj){
  if(!obj) return;
  const div = document.createElement('div')
  div.classList.add('note-box');
  div.innerHTML = `
    <p class="date-houre">${obj.timeDay}</p> 
    <h3 class="note-title-added">${obj.noteTitle}</h3>
    <textarea class="note-content-added" readonly>${obj.noteContent}</textarea>
    <div class="btn-container">
      <button type="button" class="delete-btn">X</button>
      <button type="button" class="edit-btn">🖋</button>
    </div>  
  `;
  noteContainer.appendChild(div)

  const deleteBtn = div.querySelector('.delete-btn')
  deleteBtn.addEventListener('click', ()=>{
    if (confirm("Vuoi continuare?")){
    
    div.remove();
    console.log('delete pressed')
    notesArray = notesArray.filter(note => note.id !== obj.id)
    console.log(notesArray)

    storeNoteLocaly(notesArray);
    console.log(notesArray)
    appState();
    }

    // else{
    //   storeNoteLocaly(notesArray);
    //   console.log(notesArray)
    // }
  
  })

  const editBtn = div.querySelector('.edit-btn')
  editBtn.addEventListener('click', () => {
    const noteToEdit = notesArray.find(note => note.id === obj.id)
    console.log(noteToEdit);
    editingNoteId = noteToEdit.id;
    // read it from right to left 
    noteTitle.value = obj.noteTitle.trim(); /*“Take the note’s title from the object (obj.noteTitle), and put it into the title input field (noteTitle.value).” */
    /*Put the note’s title into the form field. */
    
    noteContent.value = obj.noteContent.trim(); /*"Take the note’s content from the object (obj.noteContent),and put it into the content textarea (noteContent.value)." */
    /*Put the note’s content into the form field. */

    showDialog();
      
    
  })

}


function unshiftArray(NoteObj){
  notesArray.unshift(NoteObj)
  //console.log(notesArray)
 return notesArray
}

function closeDialog() {  
  noteTitle.value ='';
  noteContent.value = '';
  dialog.close();
}


saveNoteBtn.addEventListener('click', () => {
  saveNote();
})

closeBtn.addEventListener("click", closeDialog);

})
