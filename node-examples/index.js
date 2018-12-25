var rect = require('./rectangle')

function solveRect(l,b){
    console.log("Solving for rectangle with l = "+l+" and b= "+b);
    
    if (l <= 0 || b<=0){
        console.log("rectangle length and breadth must be greater than 0")
    }else{
        console.log("The area of the rectangle is " + rect.area(l,b));
        console.log("The permitetr of the rectangle is "+ rect.perimeter(l,b));
               
    }
}

solveRect(1,4);
solveRect(2,5);
solveRect(5,-1)