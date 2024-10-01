$(document).ready(function() {

    var wrongWords = [];
    var wordsToReview = [...words]; // 'words' is geladen vanuit words.js
    var correctAnswers = 0;
    var totalWords = words.length; // Totaal aantal woorden
    var currentCard = {};
    var previousCard = {};

    // Update de score
    function updateScore() {
        $('#score').text(correctAnswers + " / " + totalWords);
    }

    function getRandomCard() {
        var potentialCards = [];
        if (wrongWords.length > 0 && Math.random() < 0.3) {
            // Kies een willekeurige kaart uit de verkeerde woorden
            potentialCards = wrongWords;
        } else {
            // Kies een willekeurige kaart uit de woorden die nog niet correct zijn beantwoord
            potentialCards = wordsToReview;
        }

        // Filter om te voorkomen dat dezelfde kaart twee keer achter elkaar wordt getoond
        potentialCards = potentialCards.filter(word => word !== currentCard);

        // Als er na filteren geen kaarten over zijn, gebruik dan de volledige lijst
        if (potentialCards.length === 0) {
            potentialCards = words;
            potentialCards = potentialCards.filter(word => word !== currentCard);
        }

        // Selecteer een willekeurige kaart
        currentCard = potentialCards[Math.floor(Math.random() * potentialCards.length)];

        // Toon het Nederlandse woord op de voorkant en het Franse woord op de achterkant
        $('#word').text(currentCard.translation); // Nederlandse woord
        $('#translation').text(currentCard.word); // Franse woord
    }

    function animateCardTransition(isCorrect) {
        var card = $('#card');
        // Verwijder vorige animatieklassen
        card.removeClass("animate-in animate-out-right animate-out-left flip");
        if (isCorrect) {
            // Animatie voor correct antwoord: kaart vliegt naar rechts
            card.addClass("animate-out-right");
        } else {
            // Animatie voor fout antwoord: kaart vliegt naar links
            card.addClass("animate-out-left");
        }
        setTimeout(function() {
            // Reset de kaart voor de volgende ronde
            card.removeClass("animate-out-right animate-out-left flip").addClass("animate-in");
            if (isCorrect) {
                // Verwijder het woord uit wordsToReview
                wordsToReview = wordsToReview.filter(word => word !== currentCard);
                correctAnswers++;
            } else {
                // Voeg het woord toe aan wrongWords als het er nog niet in zit
                if (!wrongWords.includes(currentCard)) {
                    wrongWords.push(currentCard);
                }
            }
            updateScore();
            if (wordsToReview.length === 0) {
                if (confirm("Wil je nog een keer?")) {
                    resetGame();
                    return;
                } else {
                    return;
                }
            }
            getRandomCard();
        }, 600);
    }

    function resetGame() {
        wrongWords = [];
        correctAnswers = 0;
        wordsToReview = [...words];
        updateScore();
        getRandomCard();
    }

    // Start met een willekeurige kaart
    getRandomCard();

    // Kaart omdraaien bij klik
    $('#card').click(function() {
        $(this).toggleClass('flip');
    });

    // Juist knop
    $('#correct').click(function() {
        animateCardTransition(true);
    });

    // Fout knop
    $('#incorrect').click(function() {
        animateCardTransition(false);
    });
});
