// linear interpolation that we use in road.js
function lerp(A,B,t){
    return A+(B-A)*t;
}

// t is a %
// when t is zero, (B-A) is zero. We only have A.
// when t is one, the As cancel out. We only have B.