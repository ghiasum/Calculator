
/* global variables */
var arStack = "";
var error = false;
const errorMsg = "Digit Limit Exceeded"

/* check if number is whole number */
function isInt(n) {
   return n % 1 === 0;
}

/* takes in string representing arithmetic operation and returns results as number */ 
function getResults(arStack){	
	var entries = arStack.split(/([\u002B\u00F7\u00D7\u2212])/g);
    console.log("entries = " + entries);
    
    /* for the case where no arithmetic operator is present */
    if(entries.length === 1){
        return parseFloat(entries[0]);
    }

    var num1 = entries[0];
    var op = entries[1];
    var num2 = entries[2];
    var result = 0; 
    switch (op){
        // division 
        case String.fromCharCode(247): 
        result = parseFloat(num1) / parseFloat(num2);
        break;
        // multiplication
        case String.fromCharCode(215): 
        result = parseFloat(num1) * parseFloat(num2);
        break;
        // addition
        case String.fromCharCode(43): 
        result = parseFloat(num1) + parseFloat(num2);
        break;
        // subtract
        case String.fromCharCode(8722): 
        result = parseFloat(num1) - parseFloat(num2);
        break;
      default:
        break;
    }

    /* if result is float we round to 5 decimal places to avoid overflowing display */
    if(!isInt(result)){
        return Number(result.toFixed(5));
    }
    return result;
}

/* clears display, errors and any pending operations*/
function allClear(){
	arStack = "";
	$(".big-display").text("0");
	$(".small-display").text("0");
    error = false;
}


/* check for display overflow */
function checkLimit() {
    if ($(".big-display").prop('scrollWidth') > $(".big-display").width() ) {
            allClear();
            $(".small-display").text(errorMsg);
            error = true;
    }
}

function smallDisplayOut(str, append){
    if(error){
        return;
    }
    if(append)
	{
		$(".small-display").append(str);
	}
	else{
		$(".small-display").text(str);
	}
}

function bigDisplayOut(str, append){
    if(error){
        return;
    }
	if(append)
	{
		$(".big-display").append(str);
        checkLimit();
	}
	else{
		$(".big-display").text(str);
        checkLimit();
	}
}



$(document).ready(function(){
  
  $(".calc-button").click(function(){
  
    /* check which button is pressed */
    var input = $(this).children("p:first").text();
    console.log(input);
  
    // if user input is a number
    if(input.match(/[0-9]/g)){ 							
		if(($(".small-display").text().match(/=/g))){
			allClear();
		}
		if($(".big-display").text() === "0"){
            bigDisplayOut(input, false);
			if($(".small-display").text() === "0"){
				smallDisplayOut(input, false);
			}
			else{
              smallDisplayOut(input, true);
			}
		}
		else if($(".small-display").text().match(/[\u002B\u00F7\u00D7\u2212]$/g)){
			bigDisplayOut(input, false);
		  	smallDisplayOut(input, true);
		}
		else{
		  	bigDisplayOut(input, true);
		  	smallDisplayOut(input, true);
		}
		    arStack = arStack.concat(input);
	}	

    // if user input is an operator
	else if(input.match(/[\u002B\u00F7\u00D7\u2212]/g)){ 				
		if(($(".small-display").text().match(/=/g))){
			smallDisplayOut($(".big-display").text(), false);
		}
		if(!($(".small-display").text().match(/[\u002B\u00F7\u00D7\u2212]$/g))){
			console.log(arStack, arStack.length);
			if(arStack.split(/([\u002B\u00F7\u00D7\u2212])/g).length === 3){
				var result = getResults(arStack);
				bigDisplayOut(result, false); 
				arStack = result.toString();
			}
			smallDisplayOut(input, true);
            if($(".big-display").text() === "0"){
			    arStack = arStack.concat("0" + input);
            }
            else{
                arStack = arStack.concat(input);
            }
            console.log("arStack = ", arStack);
		}
	}

    // if user input is "."
	else if(input === "."){							
		var test = $(".big-display").text() + input;
		if(!test.match(/(\.\.)$/g) && !test.match(/\d+\.\d+\./g)){ 
			bigDisplayOut(input, true);
			smallDisplayOut(input, true);
			arStack = arStack.concat(input);
		} 
	}

	else if(input === "AC"){
		allClear();
	}

	else if(input === "CE"){
		if($(".small-display").text().match(/=/g)){
			allClear();
		}
		else if($(".small-display").text() !== "0"){
			var regex = new RegExp($(".big-display").text() + "$", "g"); 
			console.log(regex);
			smallDisplayOut($(".small-display").text().replace(regex, ''), false);
			arStack = arStack.replace(regex, '');
		}
		bigDisplayOut("0", false);
	}

    // if user input is "="
	else if(input === String.fromCharCode(61)){ 				
		if(($(".small-display").text().match(/[0-9]$/g)) && !($(".small-display").text().match(/=/g))){ 
			var results = getResults(arStack);
			bigDisplayOut(results, false); 
			smallDisplayOut("=", true);
		}
	}

  });
});