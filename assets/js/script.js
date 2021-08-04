// ejectutar script una vez el DOM está completamente cargado sin esperar al CSS o imágenes
document.addEventListener('DOMContentLoaded', function() {
    let index = new Array(); //storage the id value of the elements in an array
    let elemID = localStorage.getItem('id'); //Load the localStorage of id key value
    let sticky; //variable to generate the main div container for the sticky notes
    let sequence; //variable to generate the sequence number for the id

    let addBtn = document.getElementById('create-sticky');
    let container = document.getElementById('stickynotes');
    let stickynotes = document.getElementsByClassName('note');

    // function to generate dynamic HTML content
    let generateHTML = function() {
        sticky = document.createElement('div');
        sticky.className = 'note'
        sticky.innerHTML = '<header class="noteTitle" id="noteTitle-' + sequence + '"'
                            + 'data-placeholder="Title" contentEditable></header>'
                            + '<div class="noteContent" id="noteContent-' + sequence + '"' 
                                + 'contentEditable data-placeholder="Write your text here..."></div>'
                            + '<span class="dtc" id="dtc-' + sequence + '"></span>'
                            + '<span class="deleteSticky"><i class="ion-trash-a" id="delete-' + sequence + '"></i></span>';
        container.appendChild(sticky);
    };
   
    // load the sticky notes if there are elements created (It check the value contained in the index key)
    if (elemID && elemID.length) {
        index = JSON.parse(elemID);

        document.getElementsByClassName('empty-block')[0].style.display = 'none';

        for (let i = 0; i < index.length; i++) {
            sequence = index[i].split('-')[1];
            let noteTitle = 'noteTitle-' + sequence;
            let noteContent = 'noteContent-' + sequence;

            generateHTML();         
            sticky.id = index[i];
            
            document.getElementById(noteTitle).innerText = localStorage.getItem(noteTitle);

            document.getElementById(noteContent).innerText = localStorage.getItem(noteContent);

            document.getElementById('dtc-' + sequence).innerText = localStorage.getItem('timeCreate-' + sequence);
        }
    };

    //  function to create notes
    addBtn.addEventListener('click', function(){
        sequence = Date.now();

        document.getElementsByClassName('empty-block')[0].style.display = 'none';

        generateHTML();
        sticky.id = "sticky-" + sequence;
        sticky.addEventListener('click', getVal);
        
        index.push(sticky.id);
        localStorage.setItem('id', JSON.stringify(index));

        localStorage.setItem('timeCreate-' + sequence, new Date().toLocaleString());
        document.getElementById('dtc-' + sequence).innerText = localStorage.getItem('timeCreate-' + sequence);
    });

   //capture elem click
    let getVal = function(elem) {
        let captureEvent;
        let seqIndex;

        if (elem != null) {
            captureEvent = elem.target;
            seqIndex = captureEvent.getAttribute('id');

            localStorage.setItem('eTarget', seqIndex);

            if (document.getElementById(seqIndex).hasAttribute('contenteditable')) {
                savedata();
            } else {
                deletedata();
            }
           
        } else {
            captureEvent = EventTarget;
        }
    };

    Array.from(stickynotes).forEach(element => {
        element.addEventListener('click', getVal);
    });

    // save data on localStorage
    let savedata = function() {
        sequence = localStorage.getItem('eTarget');
        let eTarget = document.getElementById(sequence);
        
        eTarget.addEventListener('input', function() {
            localStorage.setItem(sequence, eTarget.innerText);

            if(sequence) {
                this.innerText = localStorage.getItem(sequence).reverse();
            } 
        }, false)
    };

    // delete a all note data on local storage
    let deletedata = function(){      
        sequence = localStorage.getItem('eTarget').split('-')[1];
        removeElem = index.indexOf('sticky-' + sequence)
        index.splice(removeElem, 1);
        localStorage.setItem('id', JSON.stringify(index));

        localStorage.removeItem('noteTitle-' + sequence);
        localStorage.removeItem('noteContent-' + sequence);
        localStorage.removeItem('timeCreate-' + sequence);

        document.getElementById('sticky-' + sequence).style.opacity = '0';
        setTimeout( function(){
            document.getElementById('sticky-' + sequence).remove();
        }, 500 )

        if (index.length === 0){
            localStorage.removeItem('id');
            
            setTimeout( function(){
                document.getElementsByClassName('empty-block')[0].style.display = 'block';
            }, 500 )
        }
    };
});