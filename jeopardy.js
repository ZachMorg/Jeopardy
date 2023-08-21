// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let cluesList = [];
let numberList = [];
const startButton = document.querySelector('#start');
const loadImage = document.querySelector('.fa-spin');
const errorCatcher = document.querySelector('h3');



/**
 * creates an original random number used in the getCategoryIds function
 */

function randomNumber(){
    let newNum = Math.floor(Math.random()*100);
    console.log(newNum);
    if(numberList.includes(newNum)){
        newNum = randomNumber();
    }
    numberList.push(newNum);
    return newNum;
}


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds(ranOffset) {
    let res = await axios.get(`http://jservice.io/api/categories?count=100&offset=${ranOffset}`);
    let fullList = res.data;
    let randomList = [];
    let sortedList = [];
    console.log(fullList);
    console.log(fullList.length);
    for(let i=0; i<6; i++){
        randomList.push(fullList[randomNumber()]);
        console.log(randomList);
    }
    console.log(randomList);
    for(let item of randomList){
        console.log(item.clues_count);
        if(item.clues_count<5){
                return getCategoryIds();
        }
        else{
            sortedList.push(item.id);
        }
    }
    console.log(sortedList);
    return sortedList;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catIds) {
    let dataList = [];
    for(let id of catIds){
        let res = await axios.get(`http://jservice.io/api/category?id=${id}`);
        dataList.push(res.data);
    }
    console.log(dataList);
    return dataList;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

function fillTable(data) {
    let catHeader = document.querySelector('thead');
    catHeader.innerHTML = '';
    let catTable = document.createElement('tr');
    for(let cat of data){
        let newCat = document.createElement('th');
        newCat.innerText = cat.title.toUpperCase();
        catTable.appendChild(newCat);
    }
    catHeader.append(catTable);

    let clueBody = document.querySelector('tbody');
    clueBody.innerHTML = '';
    let increase = 0;
    cluesList = [];
    for(let clue=0; clue<5; clue++){
        let newClueRow = document.createElement('tr');
        for(let cat=0; cat<6; cat++){
            let newClueSquare = document.createElement('td');
            let clueData = data[cat].clues[clue];
            console.log(data[cat]);
            cluesList.push(clueData);
            newClueSquare.id = increase;
            increase++;
            newClueSquare.innerText = '?';
            newClueSquare.classList.add('null');
            newClueSquare.addEventListener('click', handleClick);
            newClueRow.append(newClueSquare);

            
        }
        clueBody.append(newClueRow);
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    console.log(evt.target);
    let clueId = evt.target.id;
    let clueObj = cluesList[clueId];
    if(!evt.target.classList.contains('question')){
        evt.target.innerText = clueObj['question'];
        evt.target.classList.add('question');
    }
    else if(!evt.target.classList.contains('answer')){
        evt.target.innerText = clueObj['answer'];
        evt.target.classList.add('answer');
    }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    errorCatcher.style.visibility = 'hidden';
    loadImage.style.visibility = 'visible';
    startButton.style.visibility = 'hidden';
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    loadImage.style.visibility = 'hidden';
    startButton.style.visibility = 'visible';
    startButton.innerText = 'Restart!';

}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    showLoadingView();
    try{
        fillTable(await getCategory(await getCategoryIds(Math.floor(Math.random()*27000))));
    }
    catch(e){
        errorCatcher.style.visibility = 'visible';
        errorCatcher.innerText = e.message+': Too many requests';
    }
    
    hideLoadingView();
}

/** On click of start / restart button, set up game. */
startButton.addEventListener('click', setupAndStart);



/** On page load, add event handler for clicking clues */




//Suggestions and improvements

   //1.  Consider providing a clearer introduction or description of what the code does at the beginning of the script.
   //2.  The comments and console logs throughout the code can be quite helpful during development but should ideally be removed or reduced in a production environment to avoid clutter.
   //3.  Consider modularizing your code further by separating the functions into their own JavaScript files. 
   //4.  Consider adding a scoring system, timer, and player interactions to make the game more engaging.
   //5.  Implement a feature that allows players to select different difficulty levels or categories.
