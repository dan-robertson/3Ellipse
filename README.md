# Three-Focus Ellipse

To draw an ellipse, put two pins in a piece of card and wrap a loop of
string around them. Now use a pencil to pull the string tight and
trace out the shape of the ellipse by moving it around the pins. The
two pins are called the _foci_ of the ellipse.

What shape do we get if we follow the above procedure with three pins?
It turns out not to look much different from a regular ellipse, only a
little flatter near to the focii.

The program does not attempt any kind of analytical solution and
instead simulates the process: It determines if a point is inside the
ellipse by forming the minimum convex hull with the point and the foci
and measuring its perimeter. It then samples a load of points at
random and forms the minimum convex hull of all of those points which
were in the ellipse.

## Usage

Open up the `index.html` page in a web browser. The three foci are
shown as black or red circles. Click and drag to move whichever foci
is currently red. The length of the piece of string is fixed.
