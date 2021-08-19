// ejectutar script una vez el DOM está completamente cargado sin esperar al CSS o imágenes
document.addEventListener('DOMContentLoaded', function() {
    let index = new Array(); //storage the id value of the elements in an array
    let notesaved = new Array(); //storage the id value for archive elements
    let elemID = localStorage.getItem('id'); //Load the localStorage of id key value
    let archive = localStorage.getItem('archive'); //Load the localStorage of id key value
    let sticky; //variable to generate the main div container for the sticky notes
    let sequence; //variable to generate the sequence number for the id
    let wrapper = document.getElementById('modal-wrapper');
    let modal = document.getElementById('archive');

    let addBtn = document.getElementById('create-sticky');
    let container = document.getElementById('stickynotes');
    let archiveContainer = document.getElementById('notesSaved');
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
                            + '<span class="float-icons storeSticky"><i class="ion-android-archive" id="store-' + sequence + '" accesskey></i></span>' 
                            + '<span class="float-icons deleteSticky"><i class="ion-trash-a" id="delete-' + sequence + '"></i></span>'
                            ;
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
            container.appendChild(sticky);     
            sticky.id = index[i];      

            document.getElementById(noteTitle).innerText = localStorage.getItem(noteTitle);
            document.getElementById(noteContent).innerText = localStorage.getItem(noteContent);
            document.getElementById('dtc-' + sequence).innerText = localStorage.getItem('timeCreate-' + sequence);
        }
    };

    // load the sticky notes if there are elements in archive
    if (archive && archive.length) {
        notesaved = JSON.parse(archive);
        document.getElementsByClassName('empty-archive')[0].style.display = 'none';

        for (let i = 0; i < notesaved.length; i++) {
            sequence = notesaved[i].split('-')[1];
            let noteTitle = 'noteTitle-' + sequence;
            let noteContent = 'noteContent-' + sequence;

            generateHTML();   
            archiveContainer.appendChild(sticky);           
            sticky.id = notesaved[i];
            
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
        container.appendChild(sticky);
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
            } 
            else if (document.getElementById(seqIndex).hasAttribute('accesskey')) {
                storenotes();
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
        takeOut();
        
        localStorage.removeItem('noteTitle-' + sequence);
        localStorage.removeItem('noteContent-' + sequence);
        localStorage.removeItem('timeCreate-' + sequence);
    };

    // store notes
    let storenotes = function(){
        sequence = localStorage.getItem('eTarget').split('-')[1];
        let noteTitle = 'noteTitle-' + sequence;
        let noteContent = 'noteContent-' + sequence;
        takeOut();

        document.getElementsByClassName('empty-archive')[0].style.display = 'none';
    
        notesaved.push(removeElem);
        localStorage.setItem('archive', JSON.stringify(notesaved));

        setTimeout( function(){
            generateHTML();   
            archiveContainer.appendChild(sticky);           
            sticky.id = "sticky-" + sequence;
            sticky.addEventListener('click', getVal);
            
            document.getElementById(noteTitle).innerText = localStorage.getItem(noteTitle);
            document.getElementById(noteContent).innerText = localStorage.getItem(noteContent);
            document.getElementById('dtc-' + sequence).innerText = localStorage.getItem('timeCreate-' + sequence);
        }, 500 )
    };

    let takeOut = function() {
        removeElem = 'sticky-' + sequence;

        document.getElementById('sticky-' + sequence).style.opacity = '0';
        setTimeout( function(){
            document.getElementById('sticky-' + sequence).remove();
        }, 500 )
        
        if (index.includes(removeElem)) {
            index.splice(index.indexOf(removeElem), 1);
            localStorage.setItem('id', JSON.stringify(index));

            if (index.length === 0){
                localStorage.removeItem('id');
                
                setTimeout( function(){
                    document.getElementsByClassName('empty-block')[0].style.display = 'block';
                }, 500 )
            }

        } else if (notesaved.includes(removeElem)) {
            notesaved.splice(notesaved.indexOf(removeElem), 1);
            localStorage.setItem('archive', JSON.stringify(notesaved));

            if (notesaved.length === 0){
                localStorage.removeItem('archive');
                
                setTimeout( function(){
                    document.getElementsByClassName('empty-archive')[0].style.display = 'block';
                }, 500 )
            }
        }
    }
    
    //modal
    document.getElementById('open-modal').addEventListener('click', function(){    
        wrapper.style.display = 'block';
        modal.style.display = 'block';

        setTimeout( function(){
            wrapper.style.opacity = '1';
            modal.style.opacity = '1';
            modal.classList.add('active');
        }, 100 )

        // document.getElementsByTagName('body').
    });

    document.getElementById('dismiss-modal').addEventListener('click', function(){
        setTimeout( function(){
            modal.classList.remove('active');
            modal.style.opacity = '0';
            wrapper.style.opacity = '0';
        }, 100 )

        setTimeout( function(){
            wrapper.style.display = 'none';
            modal.style.display = 'none';
            modal.classList.remove('active');
        }, 600 )
        
    });
});