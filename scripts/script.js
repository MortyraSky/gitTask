// реализовать одностраничное приложение для отображения различных объектов на карте. 
// На странице должна быть размещена карта и список географических объектов. +
//  При выборе объекта из списка его местоположение должно центрироваться на карте и зуммироваться.+
//  При нажатии на объект на карте, он должен выделяться в списке. +
// Страница должна корректно отображаться в различных браузерах (Google Chrome, Firefox).

// Реализовать с использованием extjs, leaflet

// Плюсом будет:

// ∙  Возможность фильтрации объектов +/-

// ∙  Возможность отображать/скрывать группы объектов + Controls

// ∙  Отображение дополнительной информации об объекте на карте при нажатии на объект + bindPopup

// ∙  Кластеризация точечных объектов на карте +
let selected = null;
let map = null;
const sortButton = document.getElementById('sortByRating');
sortButton.addEventListener('click', sortObjects);
const mapObjectsBlocs = document.querySelector('.map-objects');
mapObjectsBlocs.addEventListener('click', goToMarkerInMap);
L.DomEvent.on(document, 'click', highlightObject);
L.DomEvent.on(document, 'click', removeHighlight);
let objects = [{
        coordinates: [53.21, 45.01],
        zoom: 15,
        id: "23123123",
        rating: 3.8,
        popupName: "some name1",
        popupDesc: "some description1"
    },
    {
        coordinates: [53.22, 45.0125],
        zoom: 15,
        id: "23123124",
        rating: 5.0,
        popupName: "some name2",
        popupDesc: "some description2"
    },
    {
        coordinates: [53.225, 45.0145],
        zoom: 15,
        id: "23123125",
        rating: 4.2,
        popupName: "some name3",
        popupDesc: "some description3"
    },
    {
        coordinates: [53.24, 45.0],
        zoom: 15,
        id: "23123126",
        rating: 3.9,
        popupName: "some name4",
        popupDesc: "some description4"
    },
    {
        coordinates: [53.18, 45.0145],
        zoom: 15,
        id: "23123127",
        rating: 4.6,
        popupName: "some name5",
        popupDesc: "some description5"
    },
    {
        coordinates: [54.192, 45.0145],
        zoom: 15,
        id: "23123128",
        rating: 2.7,
        popupName: "some name6",
        popupDesc: "some description6"
    },
    {
        coordinates: [54.191, 44.0145],
        zoom: 15,
        id: "23123129",
        rating: 3.0,
        popupName: "some name7",
        popupDesc: "some description7"
    },
    {
        coordinates: [53.19, 44.0145],
        zoom: 15,
        id: "23123130",
        rating: 4.1,
        popupName: "some name8",
        popupDesc: "some description8"
    },
    {
        coordinates: [53.185, 44.0145],
        zoom: 15,
        id: "23123131",
        rating: 4.0,
        popupName: "some name9",
        popupDesc: "some description9"
    },
    {
        coordinates: [53.189, 45.0145],
        zoom: 15,
        id: "23123132",
        rating: 3.5,
        popupName: "some name10",
        popupDesc: "some description10"
    }
];

window.onload = function () {
    // let markersGroup = [];
    let clusterMarkers = new L.MarkerClusterGroup();
    let baseLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a rel="nofollow" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        minZoom: 5
    });
    for (let key in objects) {
        let marker = new L.marker(objects[key].coordinates).bindPopup(`<strong>${objects[key].popupName}</strong><br />${objects[key].popupDesc}`);
        clusterMarkers.addLayer(marker);
        // markersGroup.push(marker);//.addTo(map));
    }
    // const markers = document.getElementsByClassName('leaflet-marker-icon');
    // for (let i = 0; i < markers.length; i++) {
    //     markers[i].setAttribute("key", objects[i].id);
    // }
    // let myObjects = L.layerGroup(markersGroup);    
    map = L.map('myMap', {
        center: [53.2, 45.0],
        zoom: 9,
        layers: [baseLayer, clusterMarkers] // layers: [baseLayer, myObjects]
    });

    let baseMaps = {
        "MyLayer": baseLayer
    };

    let overlayMaps = {
        "MyObjects": clusterMarkers
    };
    L.control.layers(baseMaps, overlayMaps).addTo(map);
    displayObjects(objects);
};

function highlightObject(event) {
    const targetMarker = event.target;
    if (targetMarker.tagName == "IMG") {
        const popupContents = document.querySelectorAll('.leaflet-popup-content');
        const popupContentsArr = Array.from(popupContents);//.innerText;
        let popupContent = null;
        if(popupContentsArr.length > 1) {
            console.log(popupContentsArr.length);
            popupContent = popupContentsArr[1].innerText;
        }else {
            popupContent = popupContentsArr[0].innerText;
        }
        let popupName = popupContent.substring(0, popupContent.indexOf('\n'));
        console.log(popupName);
        if (selected) {
            selected.classList.remove('selected');
        }
        const mapObjects = [].slice.call(document.getElementsByClassName('map-object'));
        selected = mapObjects.find(item => item.firstChild.innerText == popupName);
        selected.scrollIntoView({
            block: "center",
            behavior: "smooth"
        });
        selected.classList.add('selected');
    }
}

function removeHighlight(event) {
    const target = event.target;
    if (!target.className.includes('leaflet-marker-icon')) {
        if (selected) {
            selected.classList.remove('selected');
        }
    }
}

function goToMarkerInMap(event) {
    const target = event.target;
    if (target.className == "map-object") {
        toMarker(target);
    } else if (target.className == "map-name" || target.className == "map-description" || target.className == "map-text" || target.className == "map-rating") {
        toMarker(target.closest('.map-object'));
    }
    
}

function toMarker(node) {
    const key = node.getAttribute("key");
    let object = objects.find(item => item.id == key);
    map.setView(object.coordinates, object.zoom);
}

function displayObjects(customObjects) {
    const mapObjectsField = document.getElementById('objects-field');
    for (let key in customObjects) {
        const object = customObjects[key];
        let mapObject = document.createElement('div');
        mapObject.classList.add('map-object');
        mapObject.setAttribute('key', object['id']);
        let mapNameBlock = createDivBlock('map-name', object['popupName']);
        let mapDescriptionBlock = document.createElement('div');
        mapDescriptionBlock.classList.add('map-description');
        let mapTextBlock = createDivBlock('map-text', object['popupDesc']);
        let mapRatingBlock = createDivBlock('map-block', object['rating']);
        mapDescriptionBlock.appendChild(mapTextBlock);
        mapDescriptionBlock.appendChild(mapRatingBlock);
        mapObject.appendChild(mapNameBlock);
        mapObject.appendChild(mapDescriptionBlock);
        mapObjectsField.appendChild(mapObject);
    }
}

function createDivBlock(className, value = '') {
    let block = document.createElement('div');
    block.classList.add(className);
    block.innerHTML = value;
    return block;
}

function sortObjects() {
    let copyObjects = objects.slice();
    copyObjects.sort(function (a, b) {
        let rateA = a.rating,
            rateB = b.rating;
        return rateB - rateA;
    });
    // console.log(copyObjects);
    const mapObjectsField = document.getElementById('objects-field');
    mapObjectsField.innerHTML = "";
    displayObjects(copyObjects);
}

// function renderSortedObjects(copyObjects) {
//     // 4. очишаем поле
//     const mapObjectsField = document.getElementById('objects-field');
//     mapObjectsField.innerHTML = "";
//     // 5. отрисовываем сортированные todo элементы
//     for (let key in copyObjects) {
//         const object = copyObjects[key];
//         let mapObject = document.createElement('div');
//         mapObject.classList.add('map-object');
//         mapObject.setAttribute('key', object['id']);
//         let mapNameBlock = createDivBlock('map-name', object['popupName']);
//         let mapDescriptionBlock = document.createElement('div');
//         mapDescriptionBlock.classList.add('map-description');
//         let mapTextBlock = createDivBlock('map-text', object['popupDesc']);
//         let mapRatingBlock = createDivBlock('map-block', object['rating']);
//         mapDescriptionBlock.appendChild(mapTextBlock);
//         mapDescriptionBlock.appendChild(mapRatingBlock);
//         mapObject.appendChild(mapNameBlock);
//         mapObject.appendChild(mapDescriptionBlock);
//         mapObjectsField.appendChild(mapObject);
//     }
// }