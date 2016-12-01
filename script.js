/*************************************************************
	OBIEKT PLAYER
**************************************************************/
function Player(id, points, active){
	this.id = id;
	this.points = points;
	this.active = active;
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
	var generate = '';																			// Utworzenie pustej zmiennej na pola.

	for (var i=0; i<42; i++) {
			generate +='<div class="container__field" id="' + i + '"></div>';		// Dodanie do zmiennej kolejnych div o tej samej klasie i rosnącym id.
	}

	document.querySelector('.container__board').innerHTML = generate;				// Wstawienie zawartości zmiennej do kontenera.

	fields = document.querySelectorAll('.container__field');							// Utworzenie tablicy z referencjami do każdego z pól
	addClickEvents();																				// Wywołanie kolejnej funkcji w celu dodania obserwatorów.
}


/*******
	Dodaje obserwatory zdarzeń do odpowiednich pól gry.
*******/
function addClickEvents() {
	for (var i = 35; i < fields.length; i++) {
		fields[i].addEventListener('click', check, false);				// Dodanie obserwator do każdego pola znajdującego się na dole planszy.
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
	if (targetId > 6){
		fields[targetId-7].addEventListener('click', check, false);
	}

	if (player1.active && this.className == 'container__field') {	// Kod aktywowany gdy to gracz 1 kliknął na dane pole.
		this.setAttribute('class', 'container__field blue');		// Wstawienie O w dane pole za pomocą odpowiedniej klasy.
		if (checkWinner(player1.id, targetId)) {								// Przesłanie id gracza i id klikniętego pola do funkcji, która zwróci true, jeśli gracz wygrał.
			player1.points++;												// Przyznanie 1 punktu graczowi.
			removeClickEvents();											// Usunięcie obserwatora w celu uniemożliwienia klikania w pola przed rozpoczęciem nowej gry.
			window.setTimeout(resetBoard, 2000);					// Pokazywanie obecnego stanu planszy przez 2 sekundy i przejście do jej resetowania.
		};
		document.querySelector('.player1__header').setAttribute('class', 'player__header player1__header');				// Zmiana nagłówka
		document.querySelector('.player2__header').setAttribute('class', 'player__header player2__header active');		// aktywnego gracza.
		player1.active = false;																														// Zmiana atrybutu obiektu, który
		player2.active = true;																														// wskazuje aktywnego gracza.
	}

	else if (player2.active && this.className == 'container__field') {		//Kod analogiczny do powyższego, ale aktywowany przy kliknięciu gracza 2.
		this.setAttribute('class', 'container__field red');
		if (checkWinner(player2.id, targetId)) {
			player2.points++;
			removeClickEvents();
			window.setTimeout(resetBoard, 2000);
		};
		document.querySelector('.player2__header').setAttribute('class', 'player__header player2__header');
		document.querySelector('.player1__header').setAttribute('class', 'player__header player1__header active');
		player2.active = false;
		player1.active = true;
	}

	globalSum++;										//Zwiększenie sumy globalnej o 1.

	if (globalSum == 42) {							// Aktywuje się gdy wszystkie pola zostały wypełnione, ale nikt nie wygrał.
		window.setTimeout(resetBoard, 2000);	// Pokazywanie obecnego stanu planszy przez 2 sekundy i przejście do jej resetowania.
	}
}


/*******
	Sprawdza czy gracz o podanej sumie nie wygrał gry.
*******/
function checkWinner(id, targetId) {

	// Ustala, który gracz kliknął w pole i przypisuje zmiennej playerClass klasę charakterystyczną dla kliknięć tego gracza.
	if (globalSum >= 6) {

		if (id == 1){
			var playerClass = 'container__field blue';
		} else {
			var playerClass = 'container__field red';
		}


			// Kod sprawdzający dopasowanie elementów w pionie i po skosie z wykorzystaniem dodatkowo utworzonej funkcji.
			if (checkColors(targetId, playerClass, 6) || checkColors(targetId, playerClass, 7) || checkColors(targetId, playerClass, 8)) {
				return true;
			};


			// Kod umożliwiający obsłużenie dopasowania elementów w poziomie przy jednoczesnym zapewnieniu, że elementy nie będą liczone po przejściu do kolejnego wiersza.

			if((targetId%7 == 0) && (fields[targetId + 1].className == playerClass) && (fields[targetId + 2].className == playerClass) && (fields[targetId + 3].className == playerClass)) {return true;}
			else if((targetId%7 == 1) && (fields[targetId + 1].className == playerClass) && (fields[targetId + 2].className == playerClass) && ((fields[targetId + 3].className == playerClass) || (fields[targetId - 1].className == playerClass))) {return true;}
			else if((targetId%7 == 2) && (fields[targetId + 1].className == playerClass) && (((fields[targetId + 2].className == playerClass) && (fields[targetId + 3].className == playerClass)) || ((fields[targetId - 1].className == playerClass) && (fields[targetId + 2].className == playerClass)) || ((fields[targetId - 1].className == playerClass) && (fields[targetId - 2].className == playerClass)))) {return true;}
			else if((targetId%7 == 3)) {return checkColors(targetId, playerClass, 1);}
			else if((targetId%7 == 4) && (fields[targetId - 1].className == playerClass) && (((fields[targetId - 2].className == playerClass) && (fields[targetId - 3].className == playerClass)) || ((fields[targetId + 1].className == playerClass) && (fields[targetId - 2].className == playerClass)) || ((fields[targetId + 1].className == playerClass) && (fields[targetId + 2].className == playerClass)))) {return true;}
			else if((targetId%7 == 5) && (fields[targetId - 1].className == playerClass) && (fields[targetId - 2].className == playerClass) && ((fields[targetId - 3].className == playerClass) || (fields[targetId + 1].className == playerClass))) {return true;}
			else if((targetId%7 == 6) && (fields[targetId - 1].className == playerClass) && (fields[targetId - 2].className == playerClass) && (fields[targetId - 3].className == playerClass)) {return true;}
	}
	return false;
}



/*******
Funkcja sprawdzająca warunki zwycięstwa.
	Dla i=6 sprawdza czy gracz zakolorował 4 kolejne pola po skosie z lewego dolnego do prawego górnego rogu.
	Dla i=7 sprawdza czy gracz zakolorował 4 kolejne pola w pionie.
	Dla i=8 sprawdza czy gracz zakolorował 4 kolejne pola po skosie z lewego górnego do prawego dolnego rogu.
*******/
function checkColors(targetId, playerClass, i) {
	if ( (targetId+i < 42) && fields[targetId + i].className == playerClass){
		if ( (targetId+i*2 < 42) && fields[targetId + i*2].className == playerClass){
			if ( (targetId+i*3 < 42) && fields[targetId + i*3].className == playerClass){
				return true;
			} else if ( (targetId-i >= 0) && fields[targetId - i].className == playerClass){
				return true;
			}
		} else if ( (targetId-i >= 0) && fields[targetId - i].className == playerClass){
			if ( (targetId-i*2 >= 0) && fields[targetId - i*2].className == playerClass){
				return true;
			}
		}
	} else if ( (targetId-i >= 0) && fields[targetId - i].className == playerClass){
		if ( (targetId-i*2 >= 0) && fields[targetId - i*2].className == playerClass){
			if ( (targetId-i*3 >= 0) && fields[targetId - i*3].className == playerClass){
				return true;
			}
		}
	}
	return false;
}


/*******
	Przekazuje zdobyte punkty na liczniki i resetuje planszę umożliwiając rozpoczęcie kolejnej rozgrywki.
*******/
function resetBoard() {
	document.querySelector('.player1__points').textContent = player1.points;	// Przekazanie punktów gracza 1 z obiektu na licznik.
	document.querySelector('.player2__points').textContent = player2.points;	// Przekazanie punktów gracza 2 z obiektu na licznik.
	globalSum = 0;																					// Wyzerowanie sumy globalnej.
	prepareFields();																				// Rozpoczęcie ponownego szykowania pól do gry.
}

/*************************************************************
	KOD GLOWNY
**************************************************************/

var fields = [];			// Utworzenie tablicy, która później będzie przechowywać referencje do pól planszy.
var globalSum = 0;		// Inicjalizacja licznika sumy ze wszystkich pól. Wartość 42 będzie oznaczała, że wszystkie pola są zajęte.
prepareFields();			// Przygotowanie planszy do gry.
