/*
const isArray = function(o) {
  return Object.prototype.toString.call(o) === "[object Array]";
};

const createTree = function(nodes) {
  const docf = document.createDocumentFragment();
  try {
    if (nodes && isArray(nodes)) {
      nodes.forEach(elm => {
        docf.appendChild(elm);
      });
    } else if (nodes) {
      docf.appendChild(nodes);
    }
  } catch (e) {
    console.error(e);
  }
  return docf;
};
*/

// Get a root element and append elements
// TODO: return fragment only.
/* const createDatalist = idTitleArr => {
  const dataListElm = document.getElementById("datalist-movie-title");
  const docf = document.createDocumentFragment();
  const nodes = idTitleArr.map(({ title }) => {
    const elm = document.createElement("option");
    elm.setAttribute("value", title);
    return elm;
  });
  nodes.forEach(node => docf.appendChild(node));
  dataListElm.appendChild(docf);
};*/

const addToDatalist = val => {
  const dataListElm = document.getElementById("datalist-movie-title");
  const optionElm = document.createElement("option");
  optionElm.setAttribute("value", val);
  dataListElm.appendChild(optionElm);
};

/*
// Create a list of titles to create the index for a search
const herokuFilms = "https://ghibliapi.herokuapp.com/films";
const omdbFilms = "http://www.omdbapi.com/?";
fetch(herokuFilms)
  .then(function(response) {
    return response.json();
  })
  .then(function(arrayWthObjects) {
    return arrayWthObjects.map(({ id, title }) => ({
      id,
      title
    }));
  })
  .then(function(index) {
    createDatalist(index);
  })
  .catch(error => console.error(error));
*/

const getHeroukuMovieItem = async (
  url = "https://ghibliapi.herokuapp.com/films",
  id = "58611129-2dbc-4a81-a72f-77ddfc1b1b49"
) => {
  // herokuFilmsExample
  const movie = `${url}/${id}`;
  const response = await fetch(movie);
  const item = await response.json();
  console.log(item.title);
  return item;
};

const getOmdbMovieItem = async (title = "blade+runner") => {
  // herokuFilmsExample
  const url = "http://www.omdbapi.com/";
  const movie = `${url}?t=${title}&apikey=75a48d0e`;
  const response = await fetch(movie);
  const item = await response.json();
  return item;
};

const inputMovieTitleElm = document.getElementById("input-movie-title");

function startTimer(fkn, delay) {
  const id = setTimeout(() => {
    fkn();
  }, delay);
  return id;
}

const olSearchHistory = document.getElementById("ol-search-history");

const removeFromSearchHistory = id => {
  const elm = document.getElementById(id);
  elm.parentNode.removeChild(elm);
};

const removeAllFromSearchHistory = parentElm => {
  while (parentElm.firstChild) {
    parentElm.removeChild(parentElm.firstChild);
  }
};

const toDate = (timestamp = 1556716391503) => {
    console.log(typeof timestamp);
  const date = new Date(timestamp);
  return date
    .toLocaleDateString("en-GB", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    })
    .replace(/\//g, "-")
    .replace("am", "AM")
    .replace("pm", "PM");
};

let searchHistory = [];
const addToSearchHistory = (searchStr, { Title: title, error }, timestamp) => {
  // add to list elements
  const liElm = document.createElement("li");
  liElm.setAttribute("id", timestamp);
  const articleElm = document.createElement("article");
  const btnElm = document.createElement("button");
  btnElm.innerHTML = "Delete";
  /* btnElm.classList.add(
    "btn",
    "btn-title-primary",
    "border-primary",
    "gradient-bg-primary"
  );*/ 
  const headingElm = document.createElement("h1");
  const txt = title ? title : `No result for:"${searchStr}"`;
  const pElm = document.createElement("p");
  const date = toDate(timestamp);
  pElm.innerHTML = `${date}`;
  btnElm.addEventListener("click", () => removeFromSearchHistory(timestamp));
  headingElm.innerHTML += txt;
  liElm.appendChild(articleElm);
  articleElm.appendChild(headingElm);
  articleElm.appendChild(pElm);
  articleElm.appendChild(btnElm);
  olSearchHistory.appendChild(liElm);
  // add to autocomplete elements
  if (!searchHistory.includes(title)) {
    searchHistory = [...searchHistory, title];
    addToDatalist(title);
  }
};

const buttonClearHistory = document.getElementById("button-clear-history");
buttonClearHistory.addEventListener("click", () =>
  removeAllFromSearchHistory(olSearchHistory)
);

let stateTimerId;

/* delete previous started timer and create new
  if the time is reached it will execute
  but if new input is done, the execution waits
  until no more input arrives.*/
const searchApiForMovie = str => {
  const searchStr = str.toLowerCase().replace(/\s/g, "+");
  const delayTime = 500;
  if (stateTimerId) {
    window.clearTimeout(stateTimerId);
  }
  const doApiSearch = async () => {
    console.log("search: val:", searchStr);
    const response = await getOmdbMovieItem(str);
    console.log(response);
    addToSearchHistory(str, response, Date.now());
    return "some response";
  };
  stateTimerId = startTimer(doApiSearch, delayTime);
};

const isString = t => {
  return t && typeof t === "string";
};

const cleanInput = t => {
  if (!isString(t)) return "";
  const notSwedishAlphabetNumbersSpaceApostrophe = new RegExp(
    /[^a-zåäöA-ZÅÄÖ0-9\s'-]/g
  );
  return t.replace(notSwedishAlphabetNumbersSpaceApostrophe, "");
};

inputMovieTitleElm.addEventListener("input", e => {
  const cleanStr = cleanInput(e.target.value);
  cleanStr.length > 0 && searchApiForMovie(cleanStr);
});

document
  .querySelector("form")
  .addEventListener("submit", e => e.preventDefault());
