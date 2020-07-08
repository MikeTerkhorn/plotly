// function getPlot(id) {
//     getting data from the json file
//     d3.json('https://miketerkhorn.github.io/plotly/StarterCode/samples.json").then((data)=> 
//        console.log(data)
// }

//get data
//plot function
function getPlot(id) {
        d3.json("Data/samples.json").then((data)=> {
        console.log(data)
  
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Frequency: ${wfreq}`)
        
        
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        // check
        console.log(samples);
  
        //top 10
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // sort
        var top_otu = (samples.otu_ids.slice(0, 10)).reverse();
        
        // plot id's
        var otu_id = top_otu.map(d => "OTU " + d)
   
        // labels
        var labels = samples.otu_labels.slice(0, 10);
  
        // first trace
        var trace = {
            x: samplevalues,
            y: otu_id,
            text: labels,
            marker: {
              color: 'teal'},
            type:"bar",
            orientation: "h",
        };
  
        // data variable
        var data = [trace];
  
        // layout
        var layout = {
            title: "OTU - Top 10",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
  
        // bar plot
        Plotly.newPlot("bar", data, layout);
  
      
        // bubble trace
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        // bubble layout
        var layout_2 = {
            xaxis:{title: "OTU ID"},
            height: 700,
            width: 1000
        };
  
        // data1 bubble
        var data1 = [trace1];
  
        // bubble plot
        Plotly.newPlot("bubble", data1, layout_2); 
  
        // guage chart
  
        var data_g = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "yellow" },
                    { range: [2, 4], color: "orange" },
                    { range: [4, 6], color: "green" },
                    { range: [6, 8], color: "lime" },
                    { range: [8, 9], color: "purple" },
                  ]}
              
          }
        ];
        var layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data_g, layout_g);
      });
  }  
// data function
function getInfo(id) {
    d3.json("Data/samples.json").then((data)=> {
        
        // demographic data
        var metadata = data.metadata;

        console.log(metadata)

        // filter by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        var demographicInfo = d3.select("#sample-metadata");
        
        // reload
        demographicInfo.html("");

        // demographic data append
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// change event function
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

//  data rendering 
function init() {
    // dropdown menu 
    var dropdown = d3.select("#selDataset");

    d3.json("Data/samples.json").then((data)=> {
        console.log(data)

        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call functions 
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();