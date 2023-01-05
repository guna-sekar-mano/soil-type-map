

require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Search",
    "esri/symbols/SimpleMarkerSymbol",//symbol design in map
    "esri/widgets/CoordinateConversion",
    "esri/rest/locator",
    "esri/layers/GeoJSONLayer",
    "esri/widgets/TimeSlider",
    "esri/request"
    
    ], (
        esriConfig,
      Map,
      MapView,
      Graphic,
      GraphicsLayer,
      Search,
      SimpleMarkerSymbol,
      CoordinateConversion,
      locator,
      GeoJSONLayer,
      TimeSlider,
      esriRequest
      
    ) => {
    
      //API Key
        esriConfig.apiKey = "AAPK1211cc66c7234c47a0896a89e8ddd2f5Uv29Nk-kkAWWUX3GP9sqPrZvsUx3LKfR2nE_9_CdD8uni0_-S9fS3rlc55Wz05t8";
    
     
    
    //Map Properties
      const layer = new GeoJSONLayer({
        
       url:"https://front-end-map-ncar.s3.us-west-1.amazonaws.com/us_full.json",
        copyright: "USGS SoilData",
        title: "USGS SoilData",
       
        renderer: {
          type: "simple",
          field: "SPATIALVER",
          symbol: {
            type: "simple-marker",
            color: "orange",
            outline: null
          },
          visualVariables: [
            {
              type: "size",
              field: "SPATIALVER",
              stops: [
                {
                  value: 1,
                  size: "5px"
                },
                {
                  value: 2,
                  size: "15px"
                },
                {
                  value: 3,
                  size: "35px"
                }
              ]
            },
            /*{
              type: "color",
              field: "depth",
              stops: [
                {
                  value: 2.5,
                  color: "#F9C653",
                  label: "<2km"
                },
                {
                  value: 3.5,
                  color: "#F8864D",
                  label: "3km"
                },
                {
                  value: 4,
                  color: "#C53C06",
                  label: ">4km"
                }
              ]
            }*/
          ]
        },
        popupTemplate: {
          title: "{title}",
          content: [
            {
              type: "fields",
              fieldInfos: [
            	{
                  fieldName: "AREASYMBOL",
                  label: "AREASYMBOL",
                  visible: true
                },
                {
                  fieldName: "SPATIALVER",
                  label: "SPATIALVER",
                  visible: true
                },
                 {
                  fieldName: "MUSYM",
                  label: "MUSYM",
                  visible: true
                },
                {
                  fieldName: "MUKEY",
                  label: "MUKEY",
                  visible: true
                },
                {
                  fieldName: "geometry",
                  label: "geometry",
                  visible: true
                }
              ]
            }
          ]
        }
      });
    
      ////////////////////////////Initial start program//////////////////////////////////////
    
      const map = new Map({
        basemap: "gray-vector",
        layers: [layer]
       
      });
    
      const view = new MapView({
        container: "viewDiv",
        center: [-100,40],//USA Center Coordinate
        zoom: 4,
        map: map,
        constraints: {
          minZoom: 4 // Use this constraint to avoid zooming out too far
        },
        popup: {
          dockEnabled: true,
          dockOptions: {
            // Disables the dock button from the popup
            buttonEnabled: false,
            // Ignore the default sizes that trigger responsive docking
            breakpoint: false
          }
        },
        
      });
    
      //Limit Region
      view.when(function() {
        limitMapView(view);
      });
    
      function limitMapView(view) {
        let initialExtent = view.extent;
        let initialZoom = view.zoom;
        view.watch('stationary', function(event) {
          if (!event) {
            return;
          }
          // If the center of the map has moved outside the initial extent,
          // then move back to the initial map position (i.e. initial zoom and extent
          let currentCenter = view.extent.center;
          if (!initialExtent.contains(currentCenter)) {
       
            view.goTo({
              target: initialExtent,
              zoom: initialZoom
            });
    
           
          }
        });
      }
      //remove botttom logo
      view.ui._removeComponents(["attribution"])
    
     //Init Graphics Layer
      
     const graphicsLayer = new GraphicsLayer();
     map.add(graphicsLayer);
     const attributes = {
      Name: "Graphic",
      Description: "I am a polygon"
    }
    
    const simpleMarkerSymbol = {
       type: "simple-marker",
       color: [51, 153, 255],  // blue rgb color system
       outline: {
           color: [255, 255, 255], // White
           width: 1
       },
       size:18
    };
    
    
      var coordinateConversionWidget = new CoordinateConversion({
        view: view,
       
      });
      
      view.ui.add(coordinateConversionWidget, "bottom-right");
      
      /*const serviceUrl = "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";
    
      view.on("click", function(evt){
     
        graphicsLayer.removeAll();
        const params = {
          location: evt.mapPoint
        };
        locator.locationToAddress(serviceUrl, params)
        .then(function(response) { // Show the address found
          const address = response.address;
          showAddress(address, evt.mapPoint);
          
        }, function(err) { // Show no address found
          showAddress("No address found.", evt.mapPoint);
          
        });
    
      });
     
      function showAddress(address, pt) {
    
        const pointss = { //Create a point
          type: "point",
          longitude: pt.longitude,
          latitude: pt.latitude
       };
       var long=Math.round(pt.longitude * 100000)/100000;
       var lat=Math.round(pt.latitude * 100000)/100000;
     
     
      
    
        const pointGraphic = new Graphic({
          geometry: pointss,
          symbol: simpleMarkerSymbol,
          attributes: attributes,
    
        })
        graphicsLayer.add(pointGraphic);
        const popup = view.popup;
    
        view.when(() => {
       
         
        popup.open({
            title:  "<h3>Location Info</h3>",
            content: Modalopen(address,long,lat),
            location: pt,
          
          });
        
          
        });
        
       
       
      }
    
      //Top Rigth Modal
    
      function Modalopen(address,long,lat){
        var ad=address;
        var element = document.createElement("div");
        element.innerHTML="<p><b>Longitude: "+ long + ", Latitude: " +lat+"</b></p>"
        element.innerHTML+="<p><b>Address: </b>"+address+"</p>"
        element.innerHTML+="<h6><b>Moisture Level:</p></h6>";
       
        element.innerHTML+='<a class="btn btn-info text-white" onclick="opengraph(\x27'+ad+'\x27,\x27'+long+'\x27,\x27'+lat+'\x27)">Open Chart</a>';
       
        return element;
      }
      
      //search location
      const search = new Search({
        view: view,
        popupTemplate: {
          title: "<h3>Location Info</h3>",
          content: function demo(feature){
            var data=feature.graphic;
           var long=Math.round(data.geometry.longitude * 100000)/100000;
           var lat=Math.round(data.geometry.latitude * 100000)/100000;
    
            var add=data.attributes['Match_addr'];
            var element = document.createElement("div");
            element.innerHTML="<p><b>Longitude: "+ long + ", Latitude: " +lat+"</b></p>"
            element.innerHTML+="<p><b>Address: </b>"+add+"</p>"
            element.innerHTML+="<h6><b>Moisture Level:</p></h6>";
            element.innerHTML+='<a class="btn btn-info text-white" onclick="opengraph(\x27'+add+'\x27)">Open Chart</a>';
       
            return element;
          }
        }
    
      });
      search.allSources.on("after-add", ({ item }) => {
        item.resultSymbol = new SimpleMarkerSymbol({
          style: "diamond",
          outline: { color: [255, 255, 255, 1] },
          color: [51, 153, 255],
          size: 18,
        });
      });
      view.ui.add(search, "top-left");*/
     
      // create a new time slider widget
               
    });
    
    
    
    
    function opengraph(address,long,lat){
      console.log(address,long,lat)
    
      $('#exampleModal').modal('show');
      $('.modal-backdrop').remove();
      $('#exampleModalLabel').text(address)
      $('.modal-dialog').draggable({
        "handle":".modal-header"
      });
      $('.modal-content').resizable({
        alsoResize: ".modal-dialog"
    });
      showchart() //call function showchart()
    }
    
    
    