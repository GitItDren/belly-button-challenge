const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Populate the dropdown with sample names
function populateDropdown(data) {
    let dropdown = d3.select("#selDataset");
    data.names.forEach(name => {
        dropdown.append("option").text(name).property("value", name);
    });
}

// Draw the bar chart
function drawBarChart(sample) {
    let otu_ids = sample.otu_ids.slice(0, 10).reverse();
    let sample_values = sample.sample_values.slice(0, 10).reverse();
    let otu_labels = sample.otu_labels.slice(0, 10).reverse();

    let bar_data = [{
        x: sample_values,
        y: otu_ids.map(id => `OTU ${id}`),
        text: otu_labels,
        type: 'bar',
        orientation: 'h'
    }];

    Plotly.newPlot('bar', bar_data, {title: 'Top 10 OTUs'});
}

// Draw the bubble chart
function drawBubbleChart(sample) {
    let bubble_data = [{
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: 'markers',
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids
        }
    }];

    let bubble_layout = {
        title: 'Sample Values vs OTU IDs',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
    };

    Plotly.newPlot('bubble', bubble_data, bubble_layout);
}

// Display metadata information
function displayMetadata(metadata) {
    let metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");  // Clear the panel
    Object.entries(metadata).forEach(([key, value]) => {
        metadataPanel.append("h6").text(`${key}: ${value}`);
    });
}

d3.json(url).then(data => {
    console.log(data);

    populateDropdown(data);
    
    let initialSample = data.samples[0];
    drawBarChart(initialSample);
    drawBubbleChart(initialSample);
    displayMetadata(data.metadata[0]);
    
    d3.select("#selDataset").on("change", function() {
        let newSampleID = d3.select(this).property("value");
        let sample = data.samples.filter(sampleObj => sampleObj.id === newSampleID)[0];
        let metadata = data.metadata.filter(metaObj => metaObj.id === parseInt(newSampleID))[0];
        
        drawBarChart(sample);
        drawBubbleChart(sample);
        displayMetadata(metadata);
    });
});
        