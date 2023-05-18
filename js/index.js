/*Olivier Gagnon - TP2*/

//Les variables pour le quizz

noQuestion = 0; //variable pour le nb de question répondu

let titreQuestion = document.querySelector(".titre-question"); //variable pour afficher les questions
let lesChoixDeReponses = document.querySelector(".les-choix-de-reponse"); //variable pour afficher les choix de rép

nombreReponsesJustes = 0; //varible pour le nb de réponse  bonne 

let vaguesAvancement = document.querySelector(".compteurVagues") //les 3 variable pour faire avancer la vagues dans le quizz
hauteurVagues = 0;
hauteurCibleVagues = 0;


//DÉBUTER LE QUIZZ

document.querySelector(".zoneFin").style.display = "none";
window.addEventListener("click", transitionTitre); //cette écouteur d'évènement débutera le quizz lorsqu'un click sera fait sur la page

function transitionTitre(){
    //On affiche la section de la transition
    let transTitre = document.querySelector("div.vagues");
    //On affiche la section de l'animation et on fait jouer l'animation
    transTitre.style.display = "flex";
    transTitre.style.animationPlayState = "running";
    //À la fin de l'animation on affiche le quizz
    transTitre.addEventListener("animationend", debuterLeQuizz);
    //Enlever event listerner 
    window.removeEventListener("click", transitionTitre);
}

function debuterLeQuizz(){

    //On commence par enlever le titre
    let titreQuiz = document.querySelector("main.titre");
    titreQuiz.remove();

    //On enlève ensuite l'écouteur d'évènement
    window.removeEventListener("click", debuterLeQuizz);

    //On met ensuite la section du quizz!
    document.querySelector(".zoneQuizz").style.display = "flex";

    //Pour afficher la question
    afficherQuestion();
}

function afficherQuestion(){
    //on récupère les questions puis on les affiches
    let objetQuestion = lesQuestions[noQuestion];

    titreQuestion.innerText = objetQuestion.titre;

    lesChoixDeReponses.innerHTML = "";

    let unChoix;
    for (let i = 0; i < objetQuestion.choix.length; i++) { 
        unChoix = document.createElement("div");
        unChoix.classList.add("choix");
    
        unChoix.innerText = objetQuestion.choix[i];

        unChoix.indexChoix = i;

        unChoix.addEventListener("mousedown", verifierReponse);

        lesChoixDeReponses.append(unChoix);
        console.log(unChoix);
    }

    //On augemente le nombre de réponse répndu pour la vague et on appelle l'animation
    hauteurCibleVagues = (noQuestion + 1) / lesQuestions.length * 100;

    requestAnimationFrame(animerVaguesAvancement);
}

    function animerVaguesAvancement() { //animation d'avancement de la vague

        hauteurVagues++;
        vaguesAvancement.style.height = hauteurVagues + "vh";

        if(hauteurVagues<hauteurCibleVagues){
            requestAnimationFrame(animerVaguesAvancement);
        }

    }

                /**
         * Fonction permettant de vérifier la réponse choisie et de gérer la suite
         *
         * @param {object} event Informations sur l'événement MouseEvent distribué
         */

        function verifierReponse(event) {

            //On vérifie si la réponse choisie est bonne ou mauvaise puis on rajoute sa classe respective pour l'animation avec un if
            let reponseChoisie = event.target.indexChoix;
            let bonneReponse = lesQuestions[noQuestion].bonneReponse
            console.log(reponseChoisie);
            console.log(bonneReponse);

            if(reponseChoisie == bonneReponse){
                event.target.classList.add('reponse-succes');

                nombreReponsesJustes++;
            }else{
                event.target.classList.add('reponse-echec');
        }
        
            //Une fois l'animation terminée on affiche la prochaine question
            event.target.addEventListener("animationend", gererProchaineQuestion);
        }

        function gererProchaineQuestion() {
            //On incrémente lnoQuestion pour la  prochaine question à afficher
            noQuestion++;
        
            //S'il reste une question on l'affiche, sinon c'est la fin du jeu...
            if (noQuestion < lesQuestions.length) {
                //On affiche la prochaine question
                afficherQuestion();
            } else {
                //C'est la fin du quiz, on regarder le score
                sauverScore();
            }
        }

        function sauverScore() {

            sauveScoreSiPlusHaut("scoreHaut", nombreReponsesJustes);

            var plusHautScore = localStorage.getItem("scoreHaut");
            console.log(plusHautScore);

            //C'est la fin du quiz
            afficherFinQuiz();
        }

        function afficherFinQuiz() {
            let zoneFinQuiz = document.querySelector(".zoneFin");
            //On enlève le quiz de l'affichage et on affiche la fin du jeu
            document.querySelector(".zoneQuizz").style.display = "none";
            zoneFinQuiz.style.display = "flex";
            //Afficher le score du joueur
            var plusHautScore = localStorage.getItem("scoreHaut");
            document.querySelector(".scoreDuJoueur").innerText = "Votre score actuelle est de: " + nombreReponsesJustes + "/5\nVotre score le plus haut est " + plusHautScore + "/5";
            //Écouteur d'évènement pour recommencer le quizz
            let boutonRejouer = document.querySelector(".btnRejouer");
            boutonRejouer.addEventListener("click", rejouerQuizz);
        }

        function rejouerQuizz() {
            //Remettre les variables à leurs valeurs initiale
            noQuestion = 0;
            nombreReponsesJustes = 0;
            hauteurVagues = 0;

            //On enlève la section de la fin, on rajoute celle du début et on affiche la première question
            document.querySelector(".zoneFin").style.display = "none";
            document.querySelector(".zoneQuizz").style.display = "flex";
            afficherQuestion();
        }

        function sauveScoreSiPlusHaut (key, value){ //fonction pour déterminer si le score actuelle est plus haut ou petit que le précédent
            var previousValue = localStorage.getItem(key);

            if (previousValue === null || parseFloat(value) > parseFloat(previousValue)){
                localStorage.setItem(key, value);
            }
        }