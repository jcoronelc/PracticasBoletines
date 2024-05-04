function generateQuestions(form) {
    var numQuestions = document.getElementById("num-questions").value;
    var form = document.createElement("form");
    form.classList.add("generate-form");

    for (var i = 0; i < numQuestions; i++) {
        var questionLabel = "Pregunta " + (i + 1);
        var questionDiv = document.createElement("div");
        questionDiv.classList.add("form-group");

        var label = document.createElement("label");
        label.textContent = questionLabel;
        questionDiv.appendChild(label);

        var inputDiv = document.createElement("div");

        var dropdown = document.createElement("select");
        dropdown.name = "question-type" + i; 
        dropdown.classList.add("form-control");
        dropdown.style.marginTop = "10px";
        dropdown.style.marginBottom = "10px";


        dropdown.onchange = function() {
            handleDropdownChange(this);
        };

        var optionTexts = ["Pregunta de texto", "Pregunta de Verdadero/Falso", "Opción Múltiple"];
        var optionValues = ["text", "truefalse", "multiple"];

        for (var j = 0; j < optionTexts.length; j++) {
            var option = document.createElement("option");
            option.value = optionValues[j];
            option.text = optionTexts[j];
            dropdown.appendChild(option);
        }


        var inputQuestionDiv = document.createElement("div");
        var input = document.createElement("input");
        input.type = "text";
        input.name = "Pregunta " + (i+1) ;
        input.placeholder = "Ingrese la pregunta " + (i + 1);
        input.classList.add("form-control");
        inputQuestionDiv.appendChild(input);

        inputDiv.appendChild(inputQuestionDiv); 
        inputDiv.appendChild(dropdown);
       
        questionDiv.appendChild(inputDiv);
        form.appendChild(questionDiv);
    }

    var submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.classList.add("btn", "btn-primary");
    submitButton.textContent = "Aceptar";
    submitButton.style.marginLeft = "15px";
    submitButton.style.marginRight = "15px";


    form.appendChild(submitButton);

    form.onsubmit = function(event) {
        event.preventDefault();
        showAnswers(form);
    };

    var generatedForm = document.getElementById("generated-form");
    generatedForm.innerHTML = '';
    generatedForm.appendChild(form);
}

function handleDropdownChange(dropdown) {
    var selectedValue = dropdown.value;
    var questionDiv = dropdown.parentElement.parentElement; 
    var inputDiv = questionDiv.querySelector(".input-div");

    if (inputDiv) {
        inputDiv.remove();
    }

    inputDiv = document.createElement("div");
    inputDiv.classList.add("input-div");

    if (selectedValue === "text") {
        var input = document.createElement("input");
        input.type = "text";
        input.classList.add("form-control");
        input.name = "Respuesta";
        input.style.marginTop = "10px"; 
        inputDiv.appendChild(input);

    } else if (selectedValue === "truefalse") {

        var trueLabel = document.createElement("label");
        var trueInput = document.createElement("input");
        trueInput.type = "radio";
        trueInput.name = "Respuesta ";
        trueInput.value = "verdadero";
        trueLabel.appendChild(trueInput);
        trueLabel.appendChild(document.createTextNode(" Verdadero"));
        trueLabel.style.marginTop = "10px";
        trueLabel.style.marginRight = "10px";
        inputDiv.appendChild(trueLabel);

        var falseLabel = document.createElement("label");
        var falseInput = document.createElement("input");
        falseInput.type = "radio";
        falseInput.name = "Respuesta" ; 
        falseInput.value = "falso";
        falseLabel.appendChild(falseInput);
        falseLabel.appendChild(document.createTextNode(" Falso"));
        falseLabel.style.marginTop = "10px"; 
        inputDiv.appendChild(falseLabel);

    }else if (selectedValue === "multiple") {
            var optionsDiv = document.createElement("div");
            optionsDiv.classList.add("multiple-options");
        
            for (var j = 0; j < 3; j++) { 
                createOption(j);
            }
        
            inputDiv.appendChild(optionsDiv);
        
            var addButton = document.createElement("button");
            addButton.type = "button"; 
            addButton.textContent = "Agregar Opción";
            addButton.classList.add("btn", "btn-primary", "mt-2");
            addButton.style.marginTop = "10px"; 
        
            addButton.addEventListener("click", function(event) {
                event.stopPropagation();
                var newIndex = optionsDiv.getElementsByClassName("option-container").length;
                createOption(newIndex);
            });
        
            inputDiv.appendChild(addButton);
        
            function createOption(index) {
                var optionContainer = document.createElement("div");
                optionContainer.classList.add("option-container");
                
                var optionLabel = document.createElement("label");
                optionLabel.classList.add("form-check-label");
            
                var optionInput = document.createElement("input");
                optionInput.type = "checkbox";
                optionInput.classList.add("form-check-input", "mt-2");
                optionInput.name = "Respuesta ";
                optionInput.value = "Opción" + (index + 1);
                optionLabel.appendChild(optionInput);
            
                var optionTextInput = document.createElement("input"); 
                optionTextInput.type = "text";
                optionTextInput.classList.add("form-control", "mt-2", "multiple-option-text");
                optionTextInput.placeholder = "Opción " + (index + 1);
                optionTextInput.style.marginLeft = "4px";
                optionTextInput.style.width = "20%";
        
                var deleteButton = document.createElement("button");
                deleteButton.textContent = "Eliminar";
                deleteButton.classList.add("btn", "btn-danger", "mt-2", "ml-2"); 
        
                deleteButton.addEventListener("click", function() {
                    var optionToRemove = this.parentNode.parentNode;
                    optionToRemove.parentNode.removeChild(optionToRemove);
                });
        
                optionContainer.appendChild(optionLabel);
                optionContainer.appendChild(optionTextInput);
                optionContainer.appendChild(deleteButton);
        
                var rowDiv = document.createElement("div");
                rowDiv.classList.add("row-checkbox");
                rowDiv.appendChild(optionContainer);
                
                optionsDiv.appendChild(rowDiv);
            }
        }
        

    questionDiv.appendChild(inputDiv);
}

function cancelForm() {
    var generatedForm = document.getElementById("generated-form");
    generatedForm.innerHTML = '';

  var answersDiv = document.getElementById("answers-form");
    answersDiv.innerHTML = '';

    document.getElementById("num-questions").value = ""; 

}


function showAnswers(form) {
    var answersDiv = document.getElementById("answers-form");
    answersDiv.innerHTML = '';
    
    for (var i = 0; i < form.elements.length; i++) {
        var element = form.elements[i];
        if (element.tagName === "INPUT") {
            if (element.type === "checkbox" && element.checked) {
                showCheckboxAnswer(element, answersDiv);
            } else if (element.type === "radio" && element.checked) {
                showRadioAnswer(element, answersDiv);
            } else if (element.type === "text" && element.value.trim() !== "" && !element.classList.contains("multiple-option-text")) {
                showTextAnswer(element, answersDiv);
            }
        }
    }
}


function showCheckboxAnswer(checkbox, answersDiv) {
    var answerItem = document.createElement("div");
    var labelText = document.createElement("strong"); 
    labelText.textContent = checkbox.name + ": "; 
    answerItem.appendChild(labelText);

    var valueText = document.createTextNode(checkbox.value);
    answerItem.appendChild(valueText); 

    answerItem.style.marginLeft = "30px";

    answersDiv.appendChild(answerItem);
}

function showRadioAnswer(radio, answersDiv) {
    var answerItem = document.createElement("div");
    var labelText = document.createElement("strong"); 
    labelText.textContent = radio.name + ": "; 
    answerItem.appendChild(labelText);

    var valueText = document.createTextNode(radio.value); 
    answerItem.appendChild(valueText); 
    answerItem.style.marginLeft = "30px";

    answersDiv.appendChild(answerItem);
}

function showTextAnswer(textInput, answersDiv) {
    var answerItem = document.createElement("div");
    var labelText = document.createElement("strong"); 
    labelText.textContent = textInput.name + ": "; 
    answerItem.appendChild(labelText);

    var valueText = document.createTextNode(textInput.value); 
    answerItem.appendChild(valueText); 
    answerItem.style.marginLeft = "30px";

    answersDiv.appendChild(answerItem);
}
