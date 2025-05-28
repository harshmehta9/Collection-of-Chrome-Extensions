//gets the user selected object
let selection = window.getSelection();

//gets the range of the selection (usually its one unless used in firefox) -> search to know why
let range = selection.getRangeAt(0);

//create a element to insert after removing the existing element(selected element)
let span = document.createElement('span')
span.style.backgroundColor = "yellow";
span.style.color = "black";
//insert the selected text to the new elemet that would be highlighted.
span.innerHTML = selection.toString();

//deletes the existing element and insert the new highlighted element.
range.deleteContents();
range.insertNode(span);

//remove all the selection
selection.removeAllRanges();

//selection in more than one element won't work