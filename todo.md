movement => 1. key press -> move 1 step 1. key press -> velocity => iteration
position + velocity, => fricction => velocity --

jump => logic complex => draw =>

structure => screen => { height woidtjh pixels = [] objects : [...groudns,
enemt...] }

mario => { x, y vx, vy }

so groiudn,etc hove some prop like marrio or world

1. ui render
2. callbacks

callbacksAndCheck(mario, world){

}

showAnimation = async()=>{

true }

isAnimationEnd = true

const callbackAndCheck = async ()=>{

}

const delay= async(time)=>{ await newPromise((res, rej)=>{ setTimeout(()=>{
res(1) }, time) }) }

fn(){ serraw() <== do the setraw of the stin here while(){

    awiat worldUpdate(world, mario, objects);

    const {isUpdate, iteration} = callbackAndChecks();
    for (let curItr  =0 ; curItr< iter>; curitr++){
      updateMario(mario)
      updateWorld(world, mario)
      await delay(100)
      clear()
      showWorld()
    }

}, 50) }

updateMario= (world, mario)=>{ marioPrevPos = {x:mario.x, y: mario.y} mario.x +=
mario.vx; mario.y += mario.vy; if (mario.vx!==0){ mario.vx +=
(Math.sign(mario.vx) * -1 ) * FRICTION } if (mario.vy!==0){ mario.vy +=
(Math.sign(mario.vy) * -1 ) * FRICTION } if (isHitting something) { mario.x =
marioprevpos.x mario.x = marioprevpos. } }

moveLeft(world, mario){ mario.vx -= 5 return {isUpdate: true, iteration : 10} }

moveRight(world, mario){ mario.vx += 5 return {isUpdate: true, iteration : 10} }

moveJump(world, mario){ mario.vy -= 5 return {isUpdate: true, iteration : 20} }

const action = { "l" : moveLeft, "r" : moveRight, "j" : moveJump, }

callBack = ()=>{ const key = awiat(read) <= stdin read a char here if (key in
action){ return action[key]() } return {isUpdate: false, iteration : 0}

}
