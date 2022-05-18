const cvs= document.getElementById("bird");

const ctx=cvs.getContext("2d");

const sprite= new Image();

var frames=0;
sprite.src="./sprite.png";



const bg={
   Sx: 0, 
   Sy: 0,
   x: 0,
   w: 275,
   h: 226,
   y: cvs.height-226,
   dx: 2,
   draw: function(){
       ctx.drawImage(sprite, this.Sx, this.Sy, this.w, this.h, this.x, this.y, this.w, this.h);
       ctx.drawImage(sprite, this.Sx, this.Sy, this.w, this.h, this.x+this.w, this.y, this.w, this.h);
       ctx.drawImage(sprite, this.Sx, this.Sy, this.w, this.h, this.x+2*this.w, this.y, this.w, this.h);
       ctx.drawImage(sprite, this.Sx, this.Sy, this.w, this.h, this.x+3*this.w, this.y, this.w, this.h);
   },

   update: function(){
       if(state.current==state.game){
            this.x=this.x-this.dx;
            this.x%=2*this.w;
       }
   }

}

const fg={
    Sx: 276, 
    Sy: 0,
    x: 0,
    w: 224,
    h: 112,
    y: cvs.height-112,
    dx: 2,
    draw: function(){
        ctx.drawImage(sprite, this.Sx, this.Sy, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.Sx, this.Sy, this.w, this.h, this.x+this.w, this.y, this.w, this.h);
    },

    update: function(){
        if(state.current==state.game){
            this.x=this.x-this.dx;
            this.x%=this.w/2;
       }
   }
}



const pipes={

    posarray: [],
    bottom:{
        Sx: 502,
        Sy: 0
    },

    top:{
        Sx: 553,
        Sy: 0
    },

    w: 51,
    h: 400,
    gap: 85,
    
    
    dx: 2,
    ypos:-150,
    update: function(){
        if(state.current !== state.game)
            return;

        if(frames%100==0){
            
            this.posarray.push({
                x: cvs.width,
                y: this.ypos* (1+Math.random())
            });
        }

        for(let i=0;i<this.posarray.length;i++){
            this.posarray[i].x-=this.dx;
            if(this.posarray[i].x<=bird.x+bird.w/2 && this.posarray[i].x+this.w>=bird.x-bird.w/2){
                if(bird.y-bird.h/2<=this.posarray[i].y+this.h || bird.y+bird.h/2>=this.posarray[i].y+this.h+85){
                    state.current=state.gameover;
                    return;
                }
            }
            if(this.posarray[i].x+this.w<=0){
                this.posarray.shift();
                score.curr++;
                score.best=Math.max(score.curr, score.best);
                localStorage.setItem("besst", score.best);
            }
        }
    },

    draw: function(){
        for(var i=0;i<this.posarray.length;i++){
            ctx.drawImage(sprite, this.top.Sx, this.top.Sy, this.w, this.h, this.posarray[i].x, this.posarray[i].y, this.w, this.h);
            ctx.drawImage(sprite, this.bottom.Sx, this.bottom.Sy, this.w, this.h, this.posarray[i].x, this.posarray[i].y+this.h+85, this.w, this.h);
        }
    }
}

const state={
    current: 0,
    getready: 0,
    game: 1,
    gameover: 2,
}

const score={
    best : parseInt(localStorage.getItem("best")) || 0,
    curr : 0,

    draw: function(){
        ctx.fillStyle = "white";
        ctx.strokestyle="#000";

        if(state.current ==state.game){
            ctx.lineWidth=2;
            ctx.font="35px Teko";
            ctx.fillText(this.curr, cvs.width/2, 50);
            ctx.strokeText(this.curr, cvs.width/2, 50);
        }
        else if(state.current==state.gameover){
            ctx.font="25px Teko";
            ctx.fillText(this.curr,cvs.width/2 + gameover.w/2-45, 186+67);
            ctx.strokeText(this.curr, cvs.width/2 +gameover.w/2-45, 186+67);
            ctx.fillText(this.best, cvs.width/2 + gameover.w/2-45, 228+67);
            ctx.strokeText(this.best, cvs.width/2+ gameover.w/2-45, 228+67);
        }
    }
}

const bird={
    animation : [
        {sX: 276, sY : 112},
        {sX: 276, sY : 139},
        {sX: 276, sY : 164},
        {sX: 276, sY : 139}
    ],

    x: 50,
    y: 150,
    w: 34,
    h: 26,
    frame: 0,
    speed: 0,
    gravity: 0.25,
    jump: 4.6,
    draw: function(){
        let position= this.animation[this.frame];        
        ctx.drawImage(sprite, position.sX, position.sY, this.w, this.h, this.x-(this.w/2), this.y-(this.h/2), this.w, this.h);
    },

    update: function(){
        if(state.current==state.getready)
            this.y=150;
        else{
            this.speed+=this.gravity;
            this.y+=this.speed;
            // console.log(cvs.height - fg.h);
            if((this.y + this.h/2 >= cvs.height - fg.h )|| (this.y - this.h/2 <= 0 )){
                if(this.y + this.h/2 >= cvs.height - fg.h ){
                    this.y=cvs.height - fg.h-this.h/2;
                }
                // console.log("yes");
                this.speed=0;
                if(state.current == state.game){
                    // console.log("yes");
                    state.current = state.gameover;
                }
            }
        }
        if(state.current==state.game){
            if(frames%5==0){
                this.frame++;
                this.frame%=4;
            }
        }
        else if(state.current==state.getready){
            if(frames%10==0){
                this.frame++;
                this.frame%=4;
            }
        }
        else{
            this.frame=1;
        }
    },

    flap: function(){
        this.speed-=this.jump;
    }
}

const getready={
    Sx:0,
    Sy:228,

    w:172,
    h:160,
    x: cvs.width/2,
    y: cvs.height/2,

    draw: function(){
        if(state.current==state.getready)
            ctx.drawImage(sprite, this.Sx, this.Sy, this.w, this.h, this.x-(this.w/2), this.y-this.h/1.5, this.w, this.h);
    }

}

cvs.addEventListener("click", function(evt){
    if(state.current==state.getready){
        state.current=state.game;
        score.curr=0;
    }
    else if(state.current==state.gameover){
        state.current=state.getready;
        bird.y=150;
        bird.speed=0;
        pipes.posarray=[];
    }
    else{
        bird.flap();
    }
});

const gameover={
    Sx:174,
    Sy:228,

    w:228,
    h:160,
    x: cvs.width/2,
    y: cvs.height/2,

    draw: function(){
        if(state.current==state.gameover)
            ctx.drawImage(sprite, this.Sx, this.Sy, this.w, this.h, this.x-(this.w/2), this.y-this.h/2, this.w, this.h);
    }

}

function update(){
    bird.update();
    fg.update();
    pipes.update();
    bg.update();
    
}

function draw(){
    ctx.fillStyle="#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();    
    getready.draw();
    gameover.draw();
    score.draw();
}

function loop(){
    frames++;
    update();
    draw();
    requestAnimationFrame(loop);    
}

loop();