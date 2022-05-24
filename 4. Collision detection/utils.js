function lerp(A,B,t){
    return A+(B-A)*t;
}

function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}


// Checks for damage
//loop through all the points in poly 1, and for each of them, we check all the of points in poly 2. We see if they touch using the getIntersection function. If they do, we check if the distance between the two points is less than the radius of the circle. If it is, we return true.
//Explained at 1:19:00 in the video.
function polysIntersect(poly1, poly2){
    for(let i=0;i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            const touch=getIntersection( 
                //take one point in the first polygon, and the next point in the first polygon. We are making segments from one point after the other.  
                poly1[i],
                poly1[(i+1)%poly1.length], //%modulo operator. If i is the last point in the polygon, we want to start from the first point. 
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false; //if we get through the whole loop without returning true (everything is null), then we know that there is no intersection.
}