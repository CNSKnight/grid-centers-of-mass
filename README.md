# grid-centers-of-mass

Calc centers of mass for sub-regions of contiguous cells in a 2-dim grid

## How-To

The usual Suspects: git clone, npm install, node .

### Details

As authored, the index.js will auto generate a test grid w/random values and process the grid into
sub-regions based on the default threshold value, and then calc the center-of-mass for each.

### Testing Considerations

Test cases can be constructed and automated using any Node/JavaScript friendly setup (eg mocha, jest);
Simply import calcCentersOfMass from ./calc-centers-of-mass.js and pass it an array of arrays with
test points and weights in an object [{x, y, v: weight}, ...],
comparing retured point-sets with known sets for each collection of points. 
Any number of point-sets in a collection should be accepted and processed.

Samples could include grids with :
- all weights the same - expect (.5, .5)
- all weights 0 except 1 with some random value - expect (1, 0)
- half the weights having same value and half having another - expect (1, .5)
