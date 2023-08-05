document.addEventListener('DOMContentLoaded', () => {
    const searchContainer = document.querySelector('#search-form');
    const imgNasa = document.querySelector('#nasa-image');
    const imgTitle = document.querySelector('#image-title');
    const imgDescription = document.querySelector('#image-description');

    let resultArray = [];
    let currentIndex = 0;

    let renderSearch = (spaceObject) => {
        imgTitle.innerText = spaceObject.data[0].title;
        imgDescription.innerText = spaceObject.data[0].description;
        if (spaceObject.links !== undefined) {
            imgNasa.src = spaceObject.links[0].href;
        }
        else {
            imgNasa.src = 'https://www.nasa.gov/sites/default/files/thumbnails/image/s75-31690.jpeg';
        }
    }

    const selectImage = (id) => {
        fetch(`https://images-api.nasa.gov/search?nasa_id=${id}`)
            .then(response => response.json())
            .then(dataObj => {
                renderSearch(dataObj?.collection?.items?.[0])
            })
    }
    
    function galleryDisplay() {
        const galleryContainer = document.querySelector('#gallery');
        galleryContainer.innerHTML = '';
        resultArray.forEach((data) => {
            if(data.links[0].href !== undefined){
                const galleryImage = document.createElement('img');
                galleryImage.className = "gallery-image";
                galleryImage.src = data.links[0].href;
                galleryImage.title = data.data[0].title
                galleryImage.id = data.data[0].nasa_id
                
                galleryContainer.append(galleryImage);
                galleryImage.addEventListener("click", e => {
                    const selectedImg = e.target.id;
                    selectImage(selectedImg)
                })
            }
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
            // console.log(dataObj.collection.items)
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
