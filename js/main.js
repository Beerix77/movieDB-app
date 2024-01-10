
const movieApp = {

    config: {
        API_KEY: "24d863d54c86392e6e1df55b9a328755",

        MOVIE_SEARCH_URL: "https://api.themoviedb.org/3/search/movie", //SEARCH
        MOVIE_POSTERS: "https://image.tmdb.org/t/p/w200/",  //SEARCH
        
        MOVIE_DETAILS: "https://api.themoviedb.org/3/movie/", //RESULTS
        MOVIE_POSTER_DETAILS: "https://image.tmdb.org/t/p/w500/", //RESULTS

        //MOVIE_REVIEWS: `https://api.themoviedb.org/3/movie/{movie_id}/reviews`
        POPULAR_MOVIES: "https://api.themoviedb.org/3/movie/popular"
    },


    dom: {},


    initUI(){

        this.dom = {
            searchForm: document.querySelector('#searchForm'),
            searchText: document.querySelector('#searchText'),
            searchResults: document.querySelector('#results'),
            movieDetails: document.querySelector('#details'),
            reviewsDiv: document.querySelector('#reviews'),
            popularDiv: document.querySelector('#popular')

        };
    
        console.log(this.dom.searchForm);
        
        this.dom.searchForm.addEventListener('submit', (ev) => {
            this.dom.popularDiv.replaceChildren(); // delete POPULAR MOVIES once search submitted
            //console.log(`Form submitted! ie BUTTON CLICKED`, Math.random());
            //console.log('Value submitted:', this.dom.searchText.value);
            ev.preventDefault(); // prevent form submit page reload
            this.loadSearchResults(this.dom.searchText.value); // run AJAX request function (loadSearchResults) with 'value submitted' as argument
        });// submit event

        this.dom.searchText.focus(); // after page loads cursor appears in form

        //listen to 'click' events on the div#results parent element (clicking on a movie (add a dataset-id))
        //thus any child of this element (searcResults) (img are all CHILDREN of this) when we click we can run some code
        this.dom.searchResults.addEventListener('click', (ev) => {
            console.log(`img clicked`, ev.target.dataset.id);
            this.loadMovieDetails(ev.target.dataset.id); //individual clicked movie details
        }); //eventListener 'CLICK'


        this.dom.popularDiv.addEventListener('click', (ev) => {
            console.log(`img clicked`, ev.target.dataset.id);
            this.loadMovieDetails(ev.target.dataset.id); //individual clicked movie details
            
        }); //eventListener 'CLICK' for POPULAR movies

    },//initUI()



    loadPopular() {

        axios.get(`${this.config.POPULAR_MOVIES}?api_key=${this.config.API_KEY}`)   
        .then( (res) => {
            console.log(`Popular movies array:`, res.data.results);
            this.renderPopular(res.data.results);
        }) //.then()
        .catch( (err) => {
            console.warn(`There was an error loading popular movies...`, err);
        }) //.catch()
        
    }, //renderPopular()



    renderPopular(popular){
        
        console.log(`popular movies: `, popular); // array of selected movie result objects

        // this.dom.searchResults.innerHTML = ''; // clear any existing movies
        this.dom.popularDiv.replaceChildren();// clear any existing movies

        this.dom.popularDiv.innerHTML = '<h2>POPULAR MOVIES:</h2>';
        
        for(const popMovie of popular){

            const imgNode = document.createElement('img');
            imgNode.src = this.generateImageURL(popMovie);    // passing each array object to the func: generateImageURL()
            imgNode.alt = `NO POSTER FOR: ${popMovie.title}`;
            // dataset make a new att:
            // <img data-id="${movie.id)" src=...>
            imgNode.dataset.id = popMovie.id;   // new att added "data-id" //  allocates 'id' to popular movies
            
            //this.dom.popularDiv is a DOM node we can append CHILD (img) to 
            this.dom.popularDiv.appendChild(imgNode)

        }

    }, //renderSearchResults



    loadSearchResults(searchText){

        console.log('search text value submitted:', searchText);
        
        //clear search results initial and clear the loading message
        this.dom.searchResults.replaceChildren();// clear any existing movies

        const loadingNode = document.createElement('p');
        loadingNode.innerHTML = "LOADING search results...";
        this.dom.searchResults.appendChild(loadingNode);
        
// MOVIE SEARCH URL: `https://api.themoviedb.org/3/search/movie?api_key=24d863d54c86392e6e1df55b9a328755&query=alien` --> RESULTS
        axios.get(this.config.MOVIE_SEARCH_URL, {
            params: {
                api_key: this.config.API_KEY,
                query: searchText
            }
        })
        .then( res => {
            console.log(`Movie RESULTS: `, res.data);
        //window.results = res.data;// debugging trick to create a global variable (TYPE IN CONSOLE)
            this.renderSearchResults(res.data.results);  
        }) // .then()
        .catch( err => {
        console.log(`There was an error loading movie results:`, err);
        }); //.catch()

    }, // loadSearchResults() 



    renderSearchResults(movies){
        console.log(`in renderSearchResults`, movies); // array of selected movie result objects

        // this.dom.searchResults.innerHTML = ''; // clear any existing movies
        this.dom.searchResults.replaceChildren();// clear any existing movies

        for(const movie of movies){

            //console.log(this.generateImageURL, movie);          
            const imgNode = document.createElement('img');
            imgNode.src = this.generateImageURL(movie);    // passing each array object to the func: generateImageURL()
            imgNode.alt = `NO POSTER FOR: ${movie.title}`;
            // dataset make a new att:
            // <img data-id="${movie.id)" src=...>
            imgNode.dataset.id = movie.id;   // new att added "data-id" 

            //this.dom.searchResults is a DOM node we can append CHILD (img) to
            this.dom.searchResults.appendChild(imgNode)

        }
    }, //renderSearchResults



// `https://image.tmdb.org/t/p/w200/${movie.poster_path}" alt="NO POSTER FOR: ${movie.title}` --> MOVIE IMAGE RESULTS
    generateImageURL(movieObject){ 
        //console.log('movie poster img URL generated: ', movieObject.poster_path);
        return `https://image.tmdb.org/t/p/w200${movieObject.poster_path}`; 
    }, // generateImageURL(): returns URL of specific movie poster as a STRING



    loadMovieDetails(chosenMovie){

        console.log(`chosen movie:`, chosenMovie);
        axios.get(`${this.config.MOVIE_DETAILS}${chosenMovie}`, {
            params: {
                api_key: this.config.API_KEY
            }
        })   
        .then( (res) => {
            console.log(`selected to pass to renderMovieDetails:`, res.data);
            this.renderMovieDetails(res.data) // pass selected movie object to func renderMovieDetails()            
        }) //.then()
        .catch( (err) => {
            console.warn(`There was an error loading details...`, err);
        }) //.catch()

    }, // loadMovieDetails()



    renderMovieDetails(selectedMovie){
        console.log('selected movie:', selectedMovie); //selected movie object details
        this.dom.popularDiv.replaceChildren();// clear any existing movies (if popular movie chosen)


        this.dom.searchForm.style.display = 'none'; // hide searchbar
        this.dom.searchResults.style.display = 'none';  //CSS hide movies NOT delete

        this.dom.movieDetails.style.display = 'block';  //CSS unhide movies
        this.dom.movieDetails.replaceChildren(); //clear

        const headingTag = document.createElement('h2'); 
        headingTag.classList.add('movieDetails'); // add class to h2
        headingTag.innerHTML = selectedMovie.title;
        this.dom.movieDetails.appendChild(headingTag);

        const imgTag = document.createElement('img');
        headingTag.classList.add('resultImage'); // add class to img
        imgTag.src = `${this.config.MOVIE_POSTER_DETAILS}${selectedMovie.poster_path}`; 
        imgTag.alt = selectedMovie.title;
        // add IMG to DOM
        this.dom.movieDetails.appendChild(imgTag);

        const pTag = document.createElement('p');
        pTag.innerHTML = `${selectedMovie.overview} <br/>`;
        pTag.innerHTML += `Runtime: ${selectedMovie.runtime}mins <br/>`;
        pTag.innerHTML += `Release Date: ${selectedMovie.release_date}`;

        this.dom.movieDetails.appendChild(pTag);

        this.loadMovieReviews(selectedMovie.id); // 

    },// renderMovieDetails()



    loadMovieReviews(movieID) {
        console.log(`movie id check:`, movieID);
        axios.get(`https://api.themoviedb.org/3/movie/${movieID}/reviews`, {
            params: {
                api_key: this.config.API_KEY
            }
        })   
        .then( (res) => {
            console.log(`selected to pass to renderMovieReviews:`, res.data.results);
            this.renderMovieReviews(res.data.results) // pass selected movie object to func renderMovieReviews()         
        }) //.then()
        .catch( (err) => {
            console.warn(`There was an error loading reviews...`, err);
        }) //.catch()
        
    },// loadMovieReviews()



    renderMovieReviews(reviews) {
        const reviewTag = document.createElement('p'); 
        reviewTag.classList.add('movieReviewHeading') // add class to p
        reviewTag.innerHTML = `<strong>Reviews: </strong><hr/>`;
        for (const review of reviews){
            reviewTag.innerHTML += `Author: ${review.author}<br/>`;
            reviewTag.innerHTML += `Review: ${review.content}<hr/>`;
        }

        this.dom.reviewsDiv.appendChild(reviewTag);
    }, //renderMovieReviews()

} // movieApp

movieApp.initUI(); ///initialises ie the methods in the variable don't run automatically
movieApp.loadPopular(); // run popular movies



// Core/vanilla JS: choose at least two of the following endpoints to use to make additional AJAX requests from the Movie
// details page of your MovieDB app homework from last Monday, so you can show more information about the movie:

//TODO//: Credits: https://api.themoviedb.org/3/movie/{movie_id}/credits - show the name and headshot for each of the cast members
// and director, and link to a details page for each person using the endpoint https://api.themoviedb.org/3/person/{person_id}

//TODO//: Recommendations: https://api.themoviedb.org/3/movie/{movie_id}/recommendations OR Similar (based 
//on genre tags): https://api.themoviedb.org/3/movie/{movie_id}/similar

//COMPLETED//: Reviews: https://api.themoviedb.org/3/movie/{movie_id}/reviews  

//COMPLETED//: Popular movies: https://api.themoviedb.org/3/movie/popular (this should be shown not on a movie details page but
// on the home page, before a search is done) 



//Updated so that a user can select a 'POPULAR MOVIE' from the populated home page without having to enter a search... AM 06/12/23