// creating canvas
const canvas = document.getElementsByTagName('canvas')[0]
const c  = canvas.getContext('2d')
canvas.height = innerHeight - 4
canvas.width = innerWidth - 3

// create a margin
const margin = 10

// construct the player
class Player{
    constructor(){
        // velocity in px
        this.velocity = {
            x:0,
            y:0
        }
        // player speed and rotation
        this.speed = 15 
        this.rotation = 0

        // image upload
        const img = new Image()
        img.src = './img/player.svg' 
        
        // onlaod setup scale,image and location of image
        img.onload = ()=>{
            const scale = 0.06
            this.image = img
            this.width = img.width *  scale
            this.height = img.height * scale
            
            this.position = {
                x: canvas.width/2 - this.width/2,
                y: canvas.height - this.height -20
             }

        }
    }

    // drawing the player with data in the constructor
    draw(){
        c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
        
    }
    update(){
        // if image exists rander it
        if (this.image){
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            
    }
    }
}

// todo
class Letter{
    constructor({position}, source){
        const img = new Image()
        img.src = source
        img.onload = ()=>{
            const scale = 0.8
            this.image=img
            this.width = img.width * scale
            this.height = img.height * scale
            //locatie implicita
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }
    draw(){
        c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
    }
    update(velocity){
        if(this.image){
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
            
            
        }
    }
    shoot(Letter_projectiles){
        Letter_projectiles.push(new Letter_projectile({
            position :{
                x: this.position.x + this.width/2,
                y: this.position.y + this.height
            },
            velocity: {
                x : 0,
                y : 5
 
            }
        }))

    }
}
// todo
class Grid{
    constructor(){
        this.position = {
            x:0,
            y:0 
        }
        this.velocity = {
            x:3,
            y:0
        }
        this.letters = []
        const sources = ['./img/n.svg','./img/n.svg','./img/n.svg','./img/n.svg','./img/n.svg','./img/n.svg']

        this.width = sources.length * 35
        this.height = 3 * 35


        this.random_height = Math.floor(Math.random() * 5 ) + 1

        // for pentru a umple de n-uri
        for (let x =0;x< sources.length; x++){
            for (let y =0;y< this.random_height; y++){
                this.letters.push(new Letter({position : {
                    x : x * 35,
                    y : y * 50
                }}, sources[y] ))
        }}


    }
    update(){
        this.letters.forEach(letter => {
            letter.update(this.velocity)
        });
        this.velocity.y = 0
        if (this.position.x + this.width >= canvas.width || this.position.x < 0){
            this.velocity.x = -this.velocity.x  
            this.velocity.y = 30
            
            
        }
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
    }
}

// TODO
// construct the projectile
class Projectile{
    constructor(position,velocity){
        this.position = position
        this.velocity = velocity
        this.radius = 4
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        c.fillStyle = `rgb(255, 167, 118)`
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y 
    }
}


// TODO
// construct the explosion
class Explosion{
    constructor(position,velocity,radius,color){
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
    }
    draw(){
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y 
        this.opacity -= 0.01
    }
}



// construct the letters projectile
class Letter_projectile{
    constructor({position,velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 4
        this.width = 3
        this.height = 10
    }
    draw(){
        c.fillStyle = 'white'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y
    }
}




// initialize first player
const player = new Player()
const projectiles =[]

// list of invaders grid
const invaders_grid = [new Grid()]
const Letter_projectiles = []
const particles = []

// initialize keys
const keys = {
    a : {
        pressed : false
    },
    d : {
        pressed : false
    },
    space : {
        pressed : false
    }
}

// number of lifes
let lifes = 3


//shooting interval
let shoot_time = 0
let shoot_interval = Math.floor(Math.random() * 50)

// setup animation (loop)
function animate(){

    if (lifes == 0){
        console.log('End Game')
        
    }
     // TODO - make a function form it
    // stars
    for(let i=0;i<5;i++){
         particles.push(new Explosion(position = {
            x: Math.random() * canvas.width,
            y:  Math.random() * canvas.height
        },velocity = {
            x: (Math.random()-0.5) *3,
            y:(Math.random()-0.5) *3
        },radius=Math.random() *4,color = 'blue'))
    }   

    // setup the background
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)

    //moveing player
    if (keys.a.pressed && player.position.x  > margin){
        player.velocity.x = - player.speed
    }
    else if(keys.d.pressed && player.position.x < canvas.width - player.width - margin){
        player.velocity.x = player.speed
    }
    else {
        player.velocity.x = 0
    }
    
    // spawn player
    player.update()

    //spawn particle
    particles.forEach(particle=>{
        if (particle.opacity < 0){
            particles.shift()
        }
        else{
            particle.update()
        }
        
    })

    // spawn letter projectiles
    Letter_projectiles.forEach(projectile=>{
        projectile.update()
        if(projectile.position.y + projectile.height >= canvas.height){
            Letter_projectiles.shift()
        }
        if (projectile.position.y + projectile.height >= player.position.y && projectile.position.x > player.position.x && projectile.position.x < player.position.x + player.width){
            // TODO - make a function form it
            for(let i=0;i<30;i++){
                particles.push(new Explosion(position = {
                    x: player.position.x + player.width/2,
                    y: player.position.y  + player.height/2
                },velocity = {
                    x: (Math.random()-0.5) *4,
                    y:(Math.random()-0.5) *4
                },radius=Math.random() *5,color = 'white'))
            }
            Letter_projectiles.shift()
            lifes --
        }
    })

    // spawn player projectiles
    projectiles.forEach(projectile => {
        projectile.update()
        if (projectile.position.y < 0){
            projectiles.shift()
        }
    });

    


    // spawning every grid invaders in list of invaders grid
    invaders_grid.forEach(grid => {

        grid.update()
        
            
        // projectile spawn
        if (shoot_time > shoot_interval && grid.letters.length > 0){
            grid.letters[Math.floor(Math.random()*grid.letters.length)].shoot(Letter_projectiles)
            shoot_time = 0
        }
        // spawn a new grid when the last grid died
        if (grid.letters == 0){
            invaders_grid[0] = new Grid()
        }

        

        grid.letters.forEach((letter , y)=> {
            projectiles.forEach((projectile,i)=>{
                if (projectile.position.y  <=letter.position.y + letter.height && 
                    projectile.position.x>=letter.position.x &&
                     projectile.position.x <= letter.position.x + letter.width &&
                     projectile.position.y  >= letter.position.y){

                        // TODO - make a function form it
                        for(let i=0;i<15;i++){
                            particles.push(new Explosion(position = {
                                x: letter.position.x + letter.width/2,
                                y: letter.position.y + letter.height/2
                            },velocity = {
                                x: (Math.random()-0.5) *3,
                                y:(Math.random()-0.5) *3
                            },radius=Math.random() *4,color = 'lime'))
                        }
                        

                        setTimeout(()=>{
                            const letter_found = grid.letters.find((founded_l)=>founded_l == letter)
                            const proj_found = projectiles.find((founded_p)=>founded_p == projectile)
                            // delete projectile and letter
                            if (letter_found  && proj_found){
                                grid.letters.splice(y,1)
                                projectiles.splice(i,1)
                                if (grid.letters.length>0){
                                    grid.width = grid.letters[grid.letters.length -1].position.x - grid.letters[0].position.x + grid.letters[grid.letters.length -1].width + margin
                                    grid.position.x = grid.letters[0].position.x - margin
                                }
                            }
                            
                        },0)
                    
                }
            })
        });
    });
    
    shoot_time ++
    // loop
    requestAnimationFrame(animate)
}

// the actual call
animate()



// move player event (keysdownd)
addEventListener('keydown',({key})=>{
    switch (key){
        case 'a':
            keys.a.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break 
        case ' ':

            // middle shot
            projectiles.push(new Projectile(position = {
                x: player.position.x + player.width/2,
                y: player.position.y 
            }, velocity = {
                x: 0,
                y: -9
            }))

            // // right shoot
            // projectiles.push(new Projectile(position = {
            //     x: player.position.x + player.width -6,
            //     y: player.position.y + 33
            // }, velocity = {
            //     x: 0,
            //     y: -3
            // }))

            // // left shoot
            // projectiles.push(new Projectile(position = {
            //     x: player.position.x + 6,
            //     y: player.position.y + 33
            // }, velocity = {
            //     x: 0,
            //     y: -3
            // }))

            keys.space.pressed=true
    }
    
})

// move player event (keysup)
addEventListener('keyup',({key})=>{
    switch (key){
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case ' ':
            keys.space.pressed= false
    }
    
})


// move player event (mouse)
// addEventListener('onmousemove',(e)=>{
// })
// onmousemove = (e) => { player.position.x = e.clientX - player.width/2
//                        player.position.y = e.clientY - player.height/2};