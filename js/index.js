var arStack = "";

function getResults(arStack){	
	var entries = arStack.split(/([\u002B\u00F7\u00D7\u2212])/g);
    var num1 = entries[0];
    var op = entries[1];
    var num2 = entries[2];
    var result = 0; 
    switch (op){
        case String.fromCharCode(247): // divide 
        result = parseFloat(num1) / parseFloat(num2);
        break;
        case String.fromCharCode(215): // multiply
        result = parseFloat(num1) * parseFloat(num2);
        break;
        case String.fromCharCode(43): // plus
        result = parseFloat(num1) + parseFloat(num2);
        break;
        case String.fromCharCode(8722): //  minus 
        result = parseFloat(num1) - parseFloat(num2);
        break;
      default:
        break;
    }
  return result;
}

function allClear(){
	arStack = "";
	$("#display-txt").text("0");
	$("#running-display").text("0");
}

function smallDisplayOut(str, append){
	if(append)
	{
		var testStr = $("#running-display").text() + str;
		if(testStr.length > 28){
			allClear();
			smallDisplayOut("Digit Limit Exceeded", false);
			return;
		}
		$("#running-display").append(str);
	}
	else{
		if(str.length > 30){
			allClear();
			smallDisplayOut("Digit Limit Exceeded", false);
			return;
		}
		$("#running-display").text(str);
	}
}

function bigDisplayOut(str, append){
	if(append)
	{
		var testStr = $("#display-txt").text() + str;
		if(testStr.length > 19){
			allClear();
			smallDisplayOut("Digit Limit Exceeded", false);
			return;
		}
		$("#display-txt").append(str);
	}
	else{
		if(str.length > 10){
			allClear();
			smallDisplayOut("Digit Limit Exceeded", false);
			return;
		}
		$("#display-txt").text(str);
	}
}



$(document).ready(function(){
  
  $(".calc-btn").click(function(){
  
    var input = $(this).children("h1:first").text();
  
    if(input.match(/[0-9]/g)){ 							// user input is a number
		if(($("#running-display").text().match(/=/g))){
			allClear();
		}
		if($("#display-txt").text() === "0"){
            bigDisplayOut(input, false);
			if($("#running-display").text() === "0"){
				smallDisplayOut(input, false);
			}
			else{
              smallDisplayOut(input, true);
			}
		}
		else if($("#running-display").text().match(/[\u002B\u00F7\u00D7\u2212]$/g)){
			bigDisplayOut(input, false);
		  	smallDisplayOut(input, true);
		}
		else{
		  	bigDisplayOut(input, true);
		  	smallDisplayOut(input, true);
		}
		    arStack = arStack.concat(input);
	}	
	else if(input.match(/[\u002B\u00F7\u00D7\u2212]/g)){ 				// user input is an operator
		if(($("#running-display").text().match(/=/g))){
			smallDisplayOut($("#display-txt").text(), false);
		}
		if(!($("#display-txt").text().match(/[\u002B\u00F7\u00D7\u2212]$/g))){
			console.log(arStack, arStack.length);
			if(arStack.split(/([\u002B\u00F7\u00D7\u2212])/g).length === 3){
				var result = getResults(arStack);
				bigDisplayOut(result, false); 
				arStack = result.toString();
			}
			smallDisplayOut(input, true);
			arStack = arStack.concat(input);
		}
	}
	else if(input === "."){							
		var test = $("#display-txt").text() + input;
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
		if($("#running-display").text().match(/=/g)){
			allClear();
		}
		else if($("#running-display").text() !== "0"){
			var regex = new RegExp($("#display-txt").text() + "$", "g"); 
			console.log(regex);
			smallDisplayOut($("#running-display").text().replace(regex, ''), false);
			arStack = arStack.replace(regex, '');
		}
		bigDisplayOut("0", false);
	}
	else if(input === String.fromCharCode(61)){ 				// user input is "="
		if(($("#running-display").text().match(/[0-9]$/g)) && !($("#running-display").text().match(/=/g))){ 
			var results = getResults(arStack);
			bigDisplayOut(results, false); 
			smallDisplayOut("=" + results, true);
		}
	}
  });
});