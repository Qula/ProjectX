$(document).ready(function(){
	var bool=true;;
	var restored = JSON.parse(localStorage.getItem('klucz'));
	if(restored==null) {
		bool=false;
	}
	if(bool){
		var scoreTabLenght = restored.length;
		for(var i =0; i<scoreTabLenght; i++){
			$(".table").find("tbody").append('<tr><th scope="row">'+(i+1)+'</th><td>' + restored[i].imie+ '</td><td>'+restored[i].wynik+'</td><td>'
				+restored[i].czas+'</td><td>'+restored[i].term+'</td></tr>');
		}
	}
	else{
		$(".table").find("tbody").append('<tr><th scope="row">'+'1'+'</th><td>' + 'NO HIGHSCORES' +'</td></tr>');
	}

	var hsLong = $(".panel").outerHeight()+20;
	$("#container").css("height", hsLong);

});
