overlayActive = false;
culsorState = 'default';

//start api actions --------------------------------------------------------------------------------
function search(query) { //calls the api to rate <link> with rating <rating>
	//var desiredLink=document.getElementById("searchbox").value;
	//if(desiredLink=='' || desiredLink == null || desiredRating == '' || desiredRating == null){
	//	showOverlay('Not all fields contain a value','You must enter a valid webpage and a valid rating.');
	//}
	query = replaceSpaceWithPlus(query);
	var apiLocation='/?q='+ query;
	//alert(apiLocation)
	// send rate to api
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", apiLocation, true);
	xhttp.setRequestHeader("Content-type", "application/json");
	//showOverlayBody();
	xhttp.onreadystatechange = function() {
		console.log(this);
		responseValidity = checkResponseValidity(this);
		if (responseValidity==1 && this.responseText != '' && this.responseText != null) { //response ok
			//debugger;
			document.getElementsByClassName("searchResults")[0].innerHTML = '';
			for(i=0;i<JSON.parse(this.responseText)['links'].length;i++){
				var parentElement = document.createElement('li');
				var element = document.createElement('a');
				element.innerText = JSON.parse(this.responseText)['links'][i]['link'];
				element.href = JSON.parse(this.responseText)['links'][i]['link'];
				parentElement.appendChild(element);
				document.getElementsByClassName("searchResults")[0].appendChild(parentElement)
			}
		} else {
			if(document.getElementById('searchresultsPlaceHolder') == null){
				var element = document.createElement('p');
				element.innerText = 'Start typing...';
				element.id = 'searchresultsPlaceHolder';
				document.getElementsByClassName("searchResults")[0].appendChild(element);
			}
		}
	}
	xhttp.send();
}
//end api actions ----------------------------------------------------------------------------------

function searchboxChanged(box) {
	if(box.value == '' || box.value == null){
		document.getElementById('searchresultsHolder').value = 'Start typing...';
	} else {
		document.getElementById('searchresultsHolder').value = search(box.value);
	}
}

//start tools --------------------------------------------------------------------------------------
function roundTo(n, digits) { //rounds <n> to <digits> digits
	var negative = false;
	if (digits === undefined) {
		digits = 0;
	}
		if( n < 0) {
		negative = true;
	  n = n * -1;
	}
	var multiplicator = Math.pow(10, digits);
	n = parseFloat((n * multiplicator).toFixed(11));
	n = (Math.round(n) / multiplicator).toFixed(2);
	if( negative ) {
		n = (n * -1).toFixed(2);
	}
	return n;
}

function makeSomeLinks(str) { //transform every link in a string into an <a> element
	//returnStr = [];
	regex = /((?:http|ftp|https):\/\/(?:[\w_-]+(?:(?:\.[\w_-]+)+))(?:[\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?)/g;
    //matches=str.match(regex);
	//for(i=0;i<matches.length;i++){returnStr.push(matches[i].replace(regex,"<a href='$1'>$1</a>"));}
	return str.replace(regex,"<a href='$1'>$1</a>");
}

if (!String.format) { //replaces the normal String.format function with something closer to python
  String.format = function(format) {
	var args = Array.prototype.slice.call(arguments, 1);
	return format.replace(/{(\d+)}/g, function(match, number) {
	  return typeof args[number] != 'undefined'
		? args[number]
		: match
	  ;
	});
  };
}

function replaceSpaceWithPlus(str) {
	return str.replace(' ','+');
}
//end tools --------------------------------------------------------------------------------------


//start overlay ----------------------------------------------------------------------------------
function showError(errorCode){ //shows an overlay with 'error' and corresponding errorCode
	showOverlay('Error.','An error occured. Code  ' + errorCode)
}

function showOverlayBody() {
	showOverlay('…','…');
}
function showOverlay(title,body){ //shows the overlay with the given title and body
	/*if(overlayActive){
		hideOverlay();
		showOverlay(title,body);
	} else {*/
		document.getElementById('panel-title').innerHTML = '<h3 class="panel-title" id="panel-title">'+title+'</h3>';
		document.getElementById('panel-body').innerHTML = '<p id="panel-body">'+body+'</p>';

		$('.overlay').fadeIn('fast');
		overlayActive = true;
		document.getElementById('closeOverlayButton').focus();
	//}
}

function hideOverlay(){ //hides the overlay
	$('.overlay').fadeOut('fast');
	overlayActive = false;
}
//end overlay ------------------------------------------------------------------------------------


//start checks -----------------------------------------------------------------------------------
function checkResponseValidity(response) { //checks for errors in the http response
	var errorCode = null;
	//console.log(response);
	if(response.readyState == 4 && response.status == 200){ // page ready loaded
		if(JSON.parse(response.responseText)['errorCode']==1){
			errorCode = 1; // reponse errorCode good
		} else {
			errorCode = 2; // response errorCode bad
		}
	} else if(response.readyState == 4 && response.status == 401) {
		errorCode = 3; // page ready but denied access to api
	} else if(! response.readyState == 4) {
		errorCode = 4; // wait for one more 'readyStateChange' -> response not ready
	} else {
		errorCode = 0; // unknown error
	}
	return errorCode;
}
//end checks -------------------------------------------------------------------------------------

//if(document.getElementById('topLinksLoadingPlaceholder') != null){generateTopLinkList();}
$(document).ready(function() {
    $('#searchform').submit(function() {
			search($('#searchbox').val())
		});
});
