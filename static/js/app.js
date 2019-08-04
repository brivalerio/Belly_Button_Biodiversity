function buildMetadata(sample) {

// @TODO: Complete the following function that builds the metadata panel

// Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  var url = `/metadata/${sample}`
  d3.json(url).then(function(sample){
    var sample_metadata = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
    sample_metadata.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  Object.entries(sample).forEach(([key,value]) => {
    sample_metadata.append("h5").text(`${key}: ${value}`)
  })

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
  })
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(myData){

    // @TODO: Build a Bubble Chart using the sample data
    var xVals = myData.otu_ids;
    var yVals = myData.sample_values;
    var mSizes = myData.sample_values;
    var mColors = myData.otu_ids;
    var textVals = myData.otu_labels;

    var bubbles = {
      x: xVals,
      y: yVals,
      text: textVals,
      mode: "markers",
      marker: {
        size: mSizes,
        color: mColors
      }
    };

    var data = [bubbles];
    var layout = {
      xaxis: {title: "OTU ID"}
    }
    Plotly.newPlot("bubble", data, layout)
  });
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(url).then(function(myMyData){
      var pieVals = myMyData.sample_values.slice(0,10);
      var otuVals = myMyData.otu_ids.slice(0,10);
      var pieLabs = myMyData.otu_labels.slice(0,10);

      var myPie = [{
        values: pieVals,
        labels: otuVals,
        hovertext: pieLabs,
        type: "pie"
      }];
    
    Plotly.newPlot("pie", myPie)
    });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
