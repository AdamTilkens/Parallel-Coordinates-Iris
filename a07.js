// 
// a07.js
// Template for CSC444 Assignment 07, Fall 2024
// Joshua A. Levine <josh@arizona.edu>
// Code added by Adam Tilkens <adamtilkens@arizona.edu>
//
// This file provides the template code for A07, providing a skeleton
// for how to initialize and draw the parallel coordinates plot  
//



////////////////////////////////////////////////////////////////////////
// Global variables for the dataset 

let data = iris 
const durTime = 1000;
// dims will store the four axes in left-to-right display order
let dims = [
  "sepalLength",
  "sepalWidth",
  "petalLength",
  "petalWidth"
];

// mapping from dimension id to dimension name used for text labels
let dimNames = {
  "sepalLength": "Sepal Length",
  "sepalWidth": "Sepal Width",
  "petalLength": "Petal Length",
  "petalWidth": "Petal Width",
};

// For reverse lookup of dumNames
let dimLabels = {
  "Sepal Length": "sepalLength",
  "Sepal Width": "sepalWidth",
  "Petal Length": "petalLength",
  "Petal Width": "petalWidth",

}


/**
 * Swaps elements of index a and b in the dims array 
 * @param {*} a : index of first dim element to swap
 * @param {*} b  :index of dim element to swap with
 */
function dimSwap(a,b) {
  let temp = dims[a];
  dims[a] = dims[b];
  dims[b] = temp;

}

// Available Species for mapping color
let speciesList = [
  "setosa",
  "versicolor",
  "virginica"
];



////////////////////////////////////////////////////////////////////////
// Global variables for the svg

let width = dims.length*125;
let height = 500;
let padding = 50;

let svg = d3.select("#pcplot")
  .append("svg")
  .attr("width", width).attr("height", height);




////////////////////////////////////////////////////////////////////////
// Initialize the x and y scales, axes, and brushes.  
//  - xScale stores a mapping from dimension id to x position
//  - yScales[] stores each y scale, one per dimension id
//  - axes[] stores each axis, one per id
//  - brushes[] stores each brush, one per id
//  - brushRanges[] stores each brush's event.selection, one per id

let xScale = d3.scalePoint()
  .domain(dims)
  .range([padding, width-padding]);

let yScales = {};
let axes = {};
let brushes = {};
let brushRanges = {};

// For each dimension, we will initialize a yScale, axis, brush, and
// brushRange
dims.forEach(function(dim) {
  //create a scale for each dimension
  yScales[dim] = d3.scaleLinear()
    .domain( d3.extent(data, function(datum) { return datum[dim]; }) )
    .range( [height-padding, padding] );

  //set up a vertical axis for each dimensions
  axes[dim] = d3.axisLeft()
    .scale(yScales[dim])
    .ticks(10);
  
  //set up brushes as a 20 pixel width band
  //we will use transforms to place them in the right location
  brushes[dim] = d3.brushY()
    .extent([[-10, padding], [+10, height-padding]]);
  
  //brushes will be hooked up to their respective updateBrush functions
  brushes[dim]
    .on("brush", updateBrush(dim))
    .on("end", updateBrush(dim))

  //initial brush ranges to null
  brushRanges[dim] = null;
});


//////////////////////////////////////
// Colormap
let colormap = d3.scaleOrdinal(speciesList, ['steelblue', 'mediumorchid','seagreen']);


////////////////////////
/// Path Function

function path(d) {

  return d3.line()(dims.map(function(p) { return[xScale(p),yScales[p](d[p])] }));
}
// add the actual polylines for data elements, each with class "datapath"
svg.append("g")
  .selectAll(".datapath")
  .data(data)
  .enter()
  .append("path")
  .attr("class", "datapath")
  .attr("d", path)
    .style('fill', 'none')
    .style('stroke', function(d){return colormap(d.species)})
    .style('opacity', 0.75)
    .style('shape-rendering','crispEdges');
  //TODO: write the rest of this\\

// add the axis groups, each with class "axis"
svg.selectAll(".axis")
    .data(dims)
    .enter()
    .append('g')
    .attr('class', 'axis')
    .each(function(d) { d3.select(this).call(axes[d]); })
    .attr('transform', function(d){ return 'translate(' + xScale(d) + ')'} );
  //TODO: write the rest of this\\

// add the axes labels, each with class "label"
svg.selectAll(".label")
  .data(dims)
  .enter()
  .append('g')
  .attr('class', 'label')
  .append("text")
    .style("text-anchor", "middle")
    .style('font-family', 'helvetica')
    .attr('x', function(d){ return xScale(d)})
    .attr('y', padding - 15)
    .text(function(d){ return dimNames[d] } )
  .on('click', function(){ onClick('click', d3.select(this)) });
  
  //TODO: write the rest of this, be sure to set the click function\\

// add the brush groups, each with class ".brush" 
svg.selectAll(".brush")
  .data(dims)
  .enter()
  .append('g')
  .attr('class', 'brush')
  .each(function(d) { d3.select(this).call(brushes[d])})
  .attr('transform', function(d){ return 'translate(' + xScale(d) + ')'} );
  //TODO: write the rest of this \\




////////////////////////////////////////////////////////////////////////
// Interaction Callbacks

// Callback for swapping axes when a text label is clicked.
function onClick(event,d) {
  let dims_a_index = dims.indexOf(dimLabels[d.text()]);
  let dims_b_index = dims_a_index + 1;

  // Handle the case of the rightmost label chosen.
  if (dims_b_index == 4 ) { dims_b_index = 2; }

  dimSwap(dims_a_index, dims_b_index);



  // Update graphical elements to reflect swap

  // Update xScale
  xScale = d3.scalePoint()
          .domain(dims)
          .range([padding, width-padding]);

  // Update Lines
  svg.selectAll(".datapath")
    .transition().duration(durTime)
    .attr("d", path);


  // Update Axis
  d3.selectAll(".axis")
    .transition().duration(durTime)
    .each(function(d) { return d3.select(this).call(axes[d]); })
    .attr('transform', function(d){ return 'translate(' + xScale(d) + ')'} );
  
  // Update Labels
  d3.selectAll(".label").selectAll('text')
    .transition().duration(durTime)
    .attr('x', function(d){ return xScale(d)});


  // Update Brushes
  d3.selectAll('.brush')
    .transition().duration(durTime)
    .each(function(d) { return d3.select(this).call(brushes[d]); })
    .attr('transform', function(d){ return 'translate(' + xScale(d) + ')'} );

}

// Returns a callback function that calls onBrush() for the brush
// associated with each dimension
function updateBrush(dim) {
  return function(event) {
    brushRanges[dim] = event.selection;
    onBrush();
  };
}

// Callback when brushing to select elements in the PC plot
function onBrush() {
  let allLines = d3.selectAll(".datapath");
  function isSelected(d) {
    //TODO: write this \\

    for (e in brushRanges){
      // Skip unused brushes
      if (brushRanges[e] == null) { continue; }

      let dataElement = yScales[e](d[e]);     
      // return false if datapoint is outside selection 
      if (!(dataElement >= brushRanges[e][0] && dataElement <= brushRanges[e][1])){
        return false;
      }
    }
    return true;
  }

  let selected = allLines
    .filter(isSelected);
  let notSelected = allLines
    .filter(function(d) { return !isSelected(d); });

  // Update the style of the selected and not selected data
  selected
    .style('opacity',0.75);

  notSelected
    .style('opacity',0.1);
 
  // TODO: write this \\
}
