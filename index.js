document.addEventListener('DOMContentLoaded', () => {
    const searchContainer = document.querySelector('#search-form');
    const imgNasa = document.querySelector('#nasa-image');
    const imgTitle = document.querySelector('#image-title');
    const imgDescription = document.querySelector('#image-description');

    let resultArray = [];
    let currentIndex = 0;

    let renderSearch = (spaceObject) => {
        // console.log(spaceObject);
        imgTitle.innerText = spaceObject.data[0].title;
        imgDescription.innerText = spaceObject.data[0].description;
        if (spaceObject.links !== undefined) {
            imgNasa.src = spaceObject.links[0].href;
        }
        else {
            imgNasa.src = 'https://www.nasa.gov/sites/default/files/thumbnails/image/s75-31690.jpeg';
        }
    }

    function galleryDisplay(data) {
        const newImgDataArray = resultArray.map((data) => {
            return data.links;})
            //console.log( "newImgDataArray: " , newImgDataArray )
        const filteredArray = newImgDataArray.filter(element => {
            return element !== undefined;})
            //console.log( "filteredArray: " , filteredArray )
        const finalImageArray = filteredArray.map(element => {
            return element[0].href;})
            //console.log( "finalImageArray: ", finalImageArray )

        const galleryContainer = document.querySelector('#gallery');
        galleryContainer.innerHTML = '';

        finalImageArray.forEach (imageUrl => {
            const galleryImage = document.createElement('img');
            galleryImage.className = "gallery-image";
            galleryImage.src = imageUrl;
            galleryContainer.append(galleryImage);
        })
    }

    let renderPrevItem = () => {
        if(currentIndex > 0) {
            currentIndex -= 1
            renderSearch(resultArray[currentIndex])
        }
        else {
            window.alert('No previous image')
        }
    }
    
    let renderNextItem = () => {
        if(currentIndex < resultArray.length -1) {
            currentIndex += 1
            renderSearch(resultArray[currentIndex])
        }
        else {
            window.alert('No next image')
        }
    }

    document.querySelector("#nextButton").addEventListener("click",renderNextItem);
    document.getElementById('prevButton').addEventListener('click', renderPrevItem);
    
    searchContainer.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchInput = e.target.search.value;
        currentIndex = 0;

        if(searchInput === '') {
            window.alert("Please enter a search term")
        }

        fetch(`https://images-api.nasa.gov/search?q=${searchInput}`)
            .then(response => response.json())
            .then(dataObj => {
            //console.log(dataObj.collection.items)
            resultArray = dataObj.collection.items;
            //console.log ( "resultArray: " , resultArray)
            if(resultArray.length > 0) {
                renderSearch(resultArray[currentIndex])
                galleryDisplay(dataObj[currentIndex])
            }
            else {
                window.alert("No results found")
            }
        })
        searchContainer.reset();
    })
});
