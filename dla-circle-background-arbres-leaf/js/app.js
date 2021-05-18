let plateform   = "https://opendata.paris.fr/api/records/1.0/"
let search      =  "search/?"
let dataset     = "dataset=les-arbres"
let geofilter   = "&geofilter.distance="
let sep         = "%2C+"
let lat, long, request;
let dist        = 1000


let jsondata;

let particles   = [];
let radius      = 4;
let walkers     = [];
let img; 

function preload(){
    img = loadImage('../green.png');
    if("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition(async function(position){
            console.log(position)
            lat     = position.coords.latitude;
            long    = position.coords.longitude;
            
            request = plateform + search + dataset + geofilter + lat + sep + long + sep + dist;
            
            const resp  = await fetch(request);
            jsondata    = await resp.json();

            let nbParticles = 100;
            for(let i=0; i<nbParticles; i++){
                let angle   = (TWO_PI / nbParticles) * i;
                let rad     = height * .3;
                let x       = cos(angle) * rad + width/2;
                let y       = sin(angle) * rad + height/2;

                let vec     = createVector(x, y);
                let target  = createVector(width/2, height/2);
                let toCenter = p5.Vector.sub(target, vec)
                let dir   = toCenter.heading();
                vec.z       = dir;

                particles[i]    = vec;
            }

            for(let i=0; i<jsondata.nhits - nbParticles; i++){
                let angle   = random(TWO_PI)
                let rad     = random(height * .05, height * .3)
                let x       = cos(angle) * rad + width/2;
                let y       = sin(angle) * rad + height/2; 
                walkers.push(createVector(x, y));
            }
        });
    }
    
}

function setup(){
    createCanvas(windowWidth, windowHeight);


   
}

function draw(){
    background("#021826")

    for(let j=0; j<walkers.length; j++){
        let walker = walkers[j];
        for(let i=0; i<particles.length; i++){
            let dst = p5.Vector.dist(walker, particles[i]);
            if(dst <= radius * 2){
                let toWalker = p5.Vector.sub(walker, particles[i])
                let angle = toWalker.heading();
                walker.z = angle;

                // if(particles.length <= 10) particles.push(walker.copy())
                particles.push(walker.copy())
                walkers.splice(j, 1);
                // walkers[j] = createVector(random(width), random(height));
                break;
            }
        }
        walker.x += random(-1, 1) * 5;
        walker.y += random(-1, 1) * 5;
        walker.x = constrain(walker.x, 0, width);
        walker.y = constrain(walker.y, 0, height);
        
        noStroke();
        fill("#F2D95C")
        circle(walker.x, walker.y, radius * 2)
    }


    noStroke();
    fill("#04D9B2")
    imageMode(CENTER)
    for(let i=0; i<particles.length; i++){
        image(img,particles[i].x, particles[i].y, 10, 10);
        /*push();
        translate(particles[i].x, particles[i].y)
        rotate(particles[i].z)
        rect(0, 0, radius * 2, radius)
        pop();*/
    }
}