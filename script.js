/*************************************************************
	OBIEKT PLAYER
**************************************************************/
function Player(id, points, active){
	this.id = id;
	this.points = points;
	this.active = active;
	this.fields = [];
}

var player1 = new Player(1, 0, true);
var player2 = new Player(2, 0, false);

/*************************************************************
	FUNKCJE
**************************************************************/


/*******
	Wypełnia planszę 42 polami. Na zakoczenie tworzy tablicę z referencją do każdego z pól.
*******/
function prepareFields() {
	var generate = '';																// Utworzenie pustej zmiennej na pola.

	for (var i=0; i<42; i++) {
			generate +='<div class="container__field" id="' + i + '"></div>';		// Dodanie do zmiennej kolejnych div o tej samej klasie i rosnącym id.
	}

	document.querySelector('.container__board').innerHTML = generate;				// Wstawienie zawartości zmiennej do kontenera.

	fields = document.querySelectorAll('.container__field');						// Utworzenie tablicy z referencjami do każdego z pól
	addClickEvents();																// Wywołanie kolejnej funkcji w celu dodania obserwatorów.
}


/*******
	Dodaje obserwatory zdarzeń do odpowiednich pól gry.
*******/
function addClickEvents() {
	for (var i = 35; i < fields.length; i++) {
		fields[i].addEventListener('click', check, false);				// Dodaje obserwator do każdego pola znajdującego się na dole planszy.
	}
}


/*******
	Usuwa obserwatory zdarzeń z pól gry.
*******/
function removeClickEvents() {
	for (var i = 0; i < fields.length; i++) {
		fields[i].removeEventListener('click', check, false);			// Usunięcie obserwatora z każdego pola.
	}
}


/*******
	Kontroluje stan gry po kliknięciu na pole.
*******/
function check(e) {
	var target = e.target;
	var targetId = Number(target.id);
	if (targetId > 6){	//Jeśli zdarzenie nie zaszło w jednym z pól położonych najwyżej...
		fields[targetId-7].addEventListener('click', check, false);	//... to dodajmey obserwator zdarzeń do elementu powyżej obecnego.
	}

	if (player1.active && this.className == 'container__field') {	// Kod aktywowany gdy to gracz 1 kliknął na dane pole.
		this.setAttribute('class', 'container__field blue');		// Wstawienie O w dane pole za pomocą odpowiedniej klasy.
		player1.fields.push(targetId);								// Dodanie id pola do listy pól klikniętych przez gracza w danej rozgrywce.
		if (checkWinner(player1.id)) {								// Przesłanie id gracza i id klikniętego pola do funkcji, która zwróci true, jeśli gracz wygrał.
			player1.points++;										// Przyznanie 1 punktu graczowi.
			removeClickEvents();									// Usunięcie obserwatora w celu uniemożliwienia klikania w pola przed rozpoczęciem nowej gry.
			window.setTimeout(resetBoard, 2000);					// Pokazywanie obecnego stanu planszy przez 2 sekundy i przejście do jej resetowania.
		};
		document.querySelector('.player1__header').setAttribute('class', 'player__header player1__header');				// Zmiana nagłówka
		document.querySelector('.player2__header').setAttribute('class', 'player__header player2__header active');		// aktywnego gracza.
		player1.active = false;																							// Zmiana atrybutu obiektu, który
		player2.active = true;																							// Wskazuje aktywnego gracza.
	}

	else if (player2.active && this.className == 'container__field') {		//Kod analogiczny do powyższego, ale aktywowany przy kliknięciu gracza 2.
		this.setAttribute('class', 'container__field red');
		player2.fields.push(targetId);
		if (checkWinner(player2.id)) {
			player2.points++;
			removeClickEvents();
			window.setTimeout(resetBoard, 2000);
		};
		document.querySelector('.player2__header').setAttribute('class', 'player__header player2__header');
		document.querySelector('.player1__header').setAttribute('class', 'player__header player1__header active');
		player2.active = false;
		player1.active = true;
	}

	globalSum++;								//Zwiększenie sumy globalnej o 1.

	if (globalSum == 42) {						// Aktywuje się gdy wszystkie pola zostały wypełnione, ale nikt nie wygrał.
		window.setTimeout(resetBoard, 2000);	// Pokazywanie obecnego stanu planszy przez 2 sekundy i przejście do jej resetowania.
	}
}


/*******
	Sprawdza czy gracz o podanej sumie wygra grę.
*******/
function checkWinner(id) {

	if (globalSum >= 6) {	//Przechodzimy dalej jeśli gracze wykonali już łącznie co najmniej 7 kliknięć.
		if (id === 1){
			var fields = player1.fields;
			for(var i=0; i<winOptions.length; i++){	//Pętla przechodząca przez wszystkie indeksy tabeli winOptions. 
				var option = winOptions[i];
				if ((fields.indexOf(option[0]) !== -1) && (fields.indexOf(option[1]) !== -1) && (fields.indexOf(option[2]) !== -1) && (fields.indexOf(option[3]) !== -1)){
					return true;	//If zostanie spełniona jeśli wszystkie wartości z przetwarzanej tablicy z układem znajdują się na koncie gracza.
				}
			}
		} else {
			var fields = player2.fields;
			for(var i=0; i<winOptions.length; i++){
				var option = winOptions[i];
				if ((fields.indexOf(option[0]) !== -1) && (fields.indexOf(option[1]) !== -1) && (fields.indexOf(option[2]) !== -1) && (fields.indexOf(option[3]) !== -1)){
					return true;
				}
			}
		}
	}
	return false;	//Jeśli żadna instrukcja warunkowa nie została spełniona - funkcja zwróci false.
}

			
/*******
	Przekazuje zdobyte punkty na liczniki i resetuje planszę umożliwiając rozpoczęcie kolejnej rozgrywki.
*******/
function resetBoard() {
	document.querySelector('.player1__points').textContent = player1.points;	// Przekazanie punktów gracza 1 z obiektu na licznik.
	document.querySelector('.player2__points').textContent = player2.points;	// Przekazanie punktów gracza 2 z obiektu na licznik.
	globalSum = 0;																					// Wyzerowanie sumy globalnej.
	player1.fields = [];																			// Wyzerowanie pó klikniętych gracza 1.
	player2.fields = [];																			// Wyzerowanie pó klikniętych gracza 2.
	prepareFields();																				// Rozpoczęcie ponownego szykowania pól do gry.
}

/*************************************************************
	KOD GLOWNY
**************************************************************/

var winOptions = [];	//Tablica przeznaczona do przechodywania możliwych ułożeń kół, dających zwycięstwo.
for (var i=0; i<7; i++){	//Układy pionowe.
	for (var j=0; j<=14; j+=7){
		var winOption = [(i+j), (i+j+7), (i+j+14), (i+j+21)];
		winOptions.push(winOption);
	}
}
for (var i=0; i<=35; i+=7){	//Układy poziome.
	for (var j=0; j<4; j++){
		var winOption = [(i+j), (i+j+1), (i+j+2), (i+j+3)];
		winOptions.push(winOption);
	}
}
for (var i=0; i<=14; i+=7){	//Układy skośne od lewej.
	for (var j=0; j<4; j++){
		var winOption = [(i+j), (i+j+8), (i+j+16), (i+j+24)];
		winOptions.push(winOption);
	}
}
for (var i=0; i<=14; i+=7){	//Układy skośne od prawej.
	for (var j=0; j<4; j++){
		var winOption = [(6+i-j), (6+i-j+6), (6+i-j+12), (6+i-j+18)];
		winOptions.push(winOption);
	}
}

var fields = [];			// Utworzenie tablicy, która później będzie przechowywać referencje do pól planszy.
var globalSum = 0;		// Inicjalizacja licznika sumy ze wszystkich pól. Wartość 42 będzie oznaczała, że wszystkie pola są zajęte.
prepareFields();			// Przygotowanie planszy do gry.
