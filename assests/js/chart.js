 //Chart Area
 function maybeDisposeRoot(divId) {
    am5.array.each(am5.registry.rootElements, function(root) {
      if (root.dom.id == divId) {
        root.dispose();
      }
    });
  }
  

 function showchart(){
    maybeDisposeRoot("chartdiv");
// Create root and chart
var root = am5.Root.new("chartdiv"); 

//set theme
root.setThemes([
  am5themes_Animated.new(root)
]);

am5.addLicense("ch-custom-attribution");
// Create chart
var stockChart = root.container.children.push(am5stock.StockChart.new(root, {
}));
var chart = root.container.children.push( 
  am5xy.XYChart.new(root, {
   
    wheelY: "zoomXY",
    layout: root.verticalLayout
  }) 
);

// Define data
var data = [{ 
  category: "March 01", 
  value1: 1, 
  value2: 1 
}, { 
  category: "March 02", 
  value1: 1.5, 
  value2:5 
 
}, { 
  category: "March 03", 
  value1: 0.7, 
  value2:6 
}];

// Create X-Axis
var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
       
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
      }),
      categoryField: "category"
    })
  );
  xAxis.data.setAll(data);
// Craete Y-axis


let yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {

    renderer: am5xy.AxisRendererY.new(root, {
       
    })
  })
);
var labelY = am5.Label.new(root, {
    rotation: -90,
    text: "Soil Moisture",
    y: am5.p50,
    centerX: am5.p50
    //x: am5.p0,
    //centerY: am5.p0
  })

  yAxis.children.unshift(
    labelY
  );



// Create series
var series1 = chart.series.push( 
  am5xy.ColumnSeries.new(root, { 
    name: "Series1", 
    xAxis: xAxis, 
    yAxis: yAxis, 
    valueYField: "value1", 
    categoryXField: "category",
    tooltip: am5.Tooltip.new(root, {})
  }) 
);
series1.columns.template.setAll({
    tooltipText: "{categoryX},Moisture: {valueY}",
    width: am5.percent(90),
    tooltipY: 0
  });

series1.data.setAll(data);

var series2 = chart.series.push( 
  am5xy.ColumnSeries.new(root, { 
    name: "Series2", 
    xAxis: xAxis, 
    yAxis: yAxis, 
    valueYField: "value2", 
    categoryXField: "category" ,
    
  }) 
);
series2.columns.template.setAll({
    tooltipText: "{categoryX},Moisture: {valueY}",
    width: am5.percent(90),
    tooltipY: 0
  });

series2.data.setAll(data);
chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));
chart.set("scrollbarY", am5.Scrollbar.new(root, { orientation: "vertical" }));
// Add legend
var legend = chart.children.push(am5.Legend.new(root, {})); 
legend.data.setAll(chart.series.values);
chart.set("cursor", am5xy.XYCursor.new(root, {}));

//contollers
var toolbar = am5stock.StockToolbar.new(root, {
    container: document.getElementById("chartcontrols"),
    stockChart: stockChart,
    controls: [
      am5stock.DateRangeSelector.new(root, {
        stockChart: stockChart,
        dateFormat: "yyyy-MM-dd"
      })
    ]
  });




}
