// read in samples.json from the URL

url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

d3.json(url).then((data) =>{

});

// Function to run on page load
function init(){

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select('#selDataset');
    
    // Use the list of sample names to populate the select options
    d3.json(url).then((data) =>{
        let idNumber = data.names
        idNumber.forEach(id => {
        dropdownMenu.append('option').property('value',id).text(id)   
        });

        // Get the first sample from the list
        buildCharts(idNumber[0], data.samples);
        buildMetadata(idNumber[0],data.metadata);
    });
}

// Build the metadata panel
function buildMetadata(idNumber,metadata) {

  // get the metadata field
  // Use d3 to select the panel with id of `#sample-metadata`
  // Use `.html("") to clear any existing metadata
  let demoInfo = d3.select('#sample-metadata').html('');

  // Filter the metadata for the object with the desired sample number
  metadata.forEach(demographic => {
    if (demographic.id == idNumber) {

  // Use d3 to append new tags for each key-value in the filtered metadata
  Object.entries(demographic).forEach(([key, value]) => {
    demoInfo.append("H6").text(`${key.toUpperCase()}: ${value}`).style('color', 'green');
          });
        } 
    });

  }    

// function to build both charts
function buildCharts(idNumber,samples) {
    
  // Get the samples field
    samples.forEach(sample=>{

      // Filter the samples for the object with the desired sample number
        if(sample.id === idNumber){

          // Get the otu_ids, otu_labels, and sample_values
            let sample_values = sample.sample_values;
            let otu_ids= sample.otu_ids;
            let otu_labels=sample.otu_labels;

            // Build a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual. 
            var trace1 = {
                x: sample_values.slice(0,10).reverse(),
                y: otu_ids.slice(0,10).map(id =>'OTU '+id.toString()).reverse(),
                type: 'bar',
                orientation: 'h',
                text:otu_labels.slice(0,10).reverse(),
                marker: {
                  color: 'rgb(142,124,195)'
                }
              };
             
              var data1 = [trace1];
              
              var layout1 = {
                title: 'Top 10 Bacterias Cultures Found',
                xaxis: {title: 'Number of Bacteria'},
                font:{
                  family: 'Raleway, sans-serif'
                },
                showlegend: false,
                
              };
              // Render the Bar Chart
              Plotly.newPlot('bar', data1, layout1);

            //Build a bubble chart that displays each sample.
            var trace2 ={
              x:otu_ids,
              y:sample_values,
              mode: 'markers',
              text:otu_labels,
              marker:{
                size:sample_values,
                color:otu_ids
              }
            };   
            var data2 = [trace2];

            var layout2 = {
              title: 'Bacteria Cultures Per Sample',
              xaxis: {title: 'OTU ID'},
              yaxis: {title: 'Number of Bacteria'},
              showlegend: false,
              
            };
            // Render the Bubble Chart
            Plotly.newPlot('bubble', data2, layout2);
        }
    });




}
// Function for event listener
function optionChanged(idNumber) {

    // Build charts and metadata panel each time a new sample is selected
    d3.json(url).then((data) => {
        buildCharts(idNumber, data.samples);
        buildMetadata(idNumber,data.metadata);
    });
}

// Initialize the dashboard
init();
