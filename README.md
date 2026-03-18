------------

Author: Adam Tilkens [EMAIL](mailto:adam.tilkens@gmail.com)  
Date: November 6th, 2024


## Notes
This is a parallel coordinates plot based on the famous "iris" dataset (https://archive.ics.uci.edu/ml/datasets/Iris).

The species attribute of each datapoint is color-coded:
setosa: Blue
versicolor: Purple
virginica: Green

Interaction:

By clicking and dragging vertically along any axis, a selection box will
be created specific to said axis and highlight the line reperesentations of all
datapoints falling within the created bounds.

Creating additional bound regions on other axis will filter to only the data points
satisfying all active selections.

The selection box once created can be dragged along the axis or resized by dragging the top or bottom ends.

Clicking on an unselected area of an axis will clear any active selections.

Clicking on an axis title will cause it to swap positions with the axis to its 
right (or left if the axis is already the rightmost one).



## Included files

* index.html - Webpage Skeleton (unedited)
* a07.js - Primary JavaScript File
* iris.js - Dataset
* d3.js - D3 Library providing functionality


## References

https://stackoverflow.com/questions/48425935/css-change-x-position-of-text-tag
https://d3-graph-gallery.com/graph/interactivity_brush.html
https://blocks.roadtolarissa.com/jasondavies/1341281
