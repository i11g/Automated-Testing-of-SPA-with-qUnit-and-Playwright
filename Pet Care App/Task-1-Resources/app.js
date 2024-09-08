window.addEventListener('load', solve);

function solve() {

        let carModelElement = document.getElementById("car-model");
        let carYearElement = document.getElementById("car-year");
        let partNameElement = document.getElementById("part-name");
        let partNumberElement = document.getElementById("part-number");
        let conditionElement = document.getElementById("condition");

        let nextButtonElement = document.getElementById("next-btn");
        
        
        let partInfoUnorderedElement = document.querySelector(".info-list");
        let confirmtInfoUnorderedElement = document.querySelector(".confirm-list");

        let  completeImageElement=document.getElementById("complete-img") 
        let  completeTextElement=document.getElementById("complete-text") 

        nextButtonElement.addEventListener("click", onNext); 

        function onNext(e) {
              
          e.preventDefault();  
               if (    
                      carModelElement.value == "" ||
                      carYearElement.value == "" ||
                      partNameElement.value == "" ||
                      partNumberElement.value == "" ||
                      conditionElement.value == ""
                ) {
                        return;
                 }

                if (
                      carYearElement.value < 1980 ||
                      carYearElement.value> 2023
                 ) {
                        return;
                }

                let articlePartInfoElement = document.createElement("article");
                
                let liPartInfoElement = document.createElement("li");
                liPartInfoElement.setAttribute("class", "part-content"); 

                let carModel = document.createElement("p");
                carModel.textContent = `Car Model: ${carModelElement.value}`; 
                 
                let carYear = document.createElement("p");
                carYear.textContent = `Car Year: ${carYearElement.value}`; 

                let partName = document.createElement("p");
                partName.textContent = `Part Name: ${partNameElement.value}`; 
                
                let partNumber = document.createElement("p");
                partNumber.textContent = `Part Number: ${partNumberElement.value}`; 

                let condition = document.createElement("p");
                condition.textContent = `Condition: ${conditionElement.value}`; 
            
                let editButton = document.createElement("button");
                editButton.setAttribute("class", "edit-btn");
                editButton.textContent = "Edit"; 

                let continueButton = document.createElement("button");
                continueButton.setAttribute("class", "continue-btn");
                continueButton.textContent = "Continue"; 

                articlePartInfoElement.appendChild(carModel);
                articlePartInfoElement.appendChild(carYear);
                articlePartInfoElement.appendChild(partName);
                articlePartInfoElement.appendChild(partNumber);
                articlePartInfoElement.appendChild(condition); 

                liPartInfoElement.appendChild(articlePartInfoElement);
                liPartInfoElement.appendChild(editButton);
                liPartInfoElement.appendChild(continueButton); 

                partInfoUnorderedElement.appendChild(liPartInfoElement); 

                let editCarModel=carModelElement.value 
                let editCarYear=carYearElement.value 
                let editPartName=partNameElement.value 
                let editpartNumber=partNumberElement.value 
                let editCondition=conditionElement.value 

                carModelElement.value=""; 
                carYearElement.value ="";
                partNameElement.value=""; 
                partNumberElement.value=""; 
                conditionElement.value ="";
                
                nextButtonElement.disabled = true;

                editButton.addEventListener('click', onEdit) ; 

                function onEdit() {
                    
                        carModelElement.value=editCarModel; 
                        carYearElement.value =editCarYear;
                        partNameElement.value=editPartName; 
                        partNumberElement.value=editpartNumber; 
                        conditionElement.value =editCondition;
                        
                        liPartInfoElement.remove();
                        nextButtonElement.disabled = false;
                }
                
                continueButton.addEventListener('click', onContinue); 

                function onContinue() {
                       
                     let articleConfirmInfoElement = document.createElement("article");
                     articleConfirmInfoElement=articlePartInfoElement
                
                     let liConfirmInfoElement = document.createElement("li");
                     liConfirmInfoElement.setAttribute("class", "part-content"); 

                     let confirmButton = document.createElement("button");
                     confirmButton.setAttribute("class", "confirm-btn");
                     confirmButton.textContent = "Confirm"; 
     
                     let cancelButton = document.createElement("button");
                     cancelButton.setAttribute("class", "cancel-btn");
                     cancelButton.textContent = "Cancel"; 

                     liConfirmInfoElement.appendChild(articleConfirmInfoElement);
                     liConfirmInfoElement.appendChild(confirmButton)
                     liConfirmInfoElement.appendChild(cancelButton) 

                     confirmtInfoUnorderedElement.appendChild(liConfirmInfoElement)

                     liPartInfoElement.remove();

                     confirmButton.addEventListener('click', onConfirm) 

                     function onConfirm() {
                         
                        liConfirmInfoElement.remove();
                        nextButtonElement.disabled = false;
                        completeImageElement.style.visibility='visible';

                        let text=document.createElement('p')
                        text.textContent="Part is Ordered!";
                        completeTextElement.appendChild(text)

                     } 

                     cancelButton.addEventListener('click', onCancel);
                     
                     function onCancel() {
                        liConfirmInfoElement.remove();
                        nextButtonElement.disabled = false;

                     }
                        
                }


        }
};


    
    
