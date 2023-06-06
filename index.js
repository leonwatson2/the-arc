import { arcs } from './arcs.js';
import './Tone.js';
let elaspedTime = 0;
const playPauseButton = document.getElementById('switchNotes');
const paper = document.getElementById('paper');
const unmute = document.getElementById('unmute');
const chosenTime = document.URL.split('#');
const duration =  isNaN(+chosenTime[1]) ? 15: +chosenTime[1] // in minutes
console.log(duration)
const settings = {
  duration,
  totalLoops: 100,
  playing: false,
  startTime: new Date().getTime(),
  pulseDuration: 1400,
  pulseEnabled: true
}
const toggleMute = () => {
  settings.muted = !settings.muted;
  if(settings.muted) {
    unmute.classList.remove('hidden');
  } else {
    unmute.classList.add('hidden');
  }
}

const playPause = () => {
  settings.playing = !settings.playing;
  if(settings.playing) {
    settings.startTime = new Date().getTime() - elaspedTime * 1000;
    playPauseButton.innerHTML = 'Pause';
    setupArcs();
    draw();
  } else {
    playPauseButton.innerHTML = 'Play';
  }
}

document.addEventListener('onvisibilitychange', () => {
    settings.muted = true
})
document.addEventListener('keypress', (event) => {
    if(event.key === 'm') {
       toggleMute();
    }
})
playPauseButton.addEventListener('click', (e) => {
    playPause();
})

paper.addEventListener('click', () => {
    toggleMute();
})



const pen = paper.getContext("2d");
const oneFullLoop = 2 * Math.PI;

const calculateDynamicOpacity = (currentTime, lastImpactTime, baseOpacity, maxOpacity, duration) => {
  const timeSinceImpact = currentTime - lastImpactTime,
  percentage = Math.min(timeSinceImpact / duration, 1),
  opacityDelta = maxOpacity - baseOpacity;
  
  return maxOpacity - (opacityDelta * percentage);
}

const determineOpacity = (currentTime, lastImpactTime, baseOpacity, maxOpacity, duration) => {
  if(!settings.pulseEnabled) return baseOpacity;
  
  return calculateDynamicOpacity(currentTime, lastImpactTime, baseOpacity, maxOpacity, duration);
}

let fullArcs = []
const setupArcs = ()=>{
    if(fullArcs.length > 0) return;
    fullArcs = arcs.map((arc, index) => {
        const numberOfLoops = settings.totalLoops - index;
        const velocity = (oneFullLoop * numberOfLoops) / (settings.duration * 60)
        return {
            ...arc,
            velocity,
            direction: 'forward',
            nextImpactTime: 0,
            timeSinceLastImpact: 0,
            synth: new Tone.AMSynth().toDestination(),
        }
    })
}

const playNote = (arc, index)=>{
  if(!settings.muted) {
    arc.synth.volume.value = -18;
    arc.synth.triggerAttackRelease(notes[index], "8n");
  }
}

const calculatePositionOnArc = (center, radius, angle) => ({
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle)
})

const drawArc = (x, y, radius, start, end, action = "stroke") => {
    pen.beginPath();
    pen.arc(x, y, radius, start, end);
    if(pen[action]){
      pen[action]();
    } else {
      console.error(`No such action for pen: ${action}`);
    }
}

const drawPointOnArc = (center, arcRadius, pointRadius, angle) => {
  const position = calculatePositionOnArc(center, arcRadius, angle);
  drawArc(position.x, position.y, pointRadius, 0, 2 * Math.PI, "fill");
}

const draw = () => {
    paper.width = paper.clientWidth;
    paper.height = paper.clientHeight;
  const currentTime = new Date().getTime();
  elaspedTime = (currentTime - settings.startTime) / 1000;
  const length = Math.min(paper.width, paper.height) * .9;
  const offset = (paper.width - length) / 2

  const start = {
    x: offset,
    y: paper.height * .9
  }
  const end = {
    x: paper.width - offset,
    y: paper.height * .9
    
  }
  const center = {
    x: paper.width * .5,
    y: paper.height * .9
  }
  let base = {
    length: end.x - start.x,
    minAngle: 0,
    startAngle: 0,
    maxAngle: 2 * Math.PI,
  }
  base.initialRadius = base.length * .05;
  base.circleRadius = base.length * .006;
  base.clearance = base.length * .03;
  base.spacing = (base.length - base.initialRadius - base.clearance) / 2 / fullArcs.length;
  pen.strokeStyle = "white";
  pen.lineWidth = 2;
  
  pen.beginPath();
  pen.moveTo(start.x, start.y);
  pen.lineTo(end.x, end.y);
  pen.stroke();
  
  
  fullArcs.forEach((arc, index) => {

    const radius = base.initialRadius + (index * base.spacing);
    const maxAngle = Math.PI * 2;

    
    
    pen.lineWidth = base.length * .002;
    pen.strokeStyle = arc.color;
    
    drawArc(center.x, center.y, radius, Math.PI, Math.PI * 2)
    

    const offset = base.circleRadius * (5/3) / radius;

    pen.lineWidth = 6 
    pen.fillStyle = "white";
    pen.globalAlpha = determineOpacity(currentTime, arc.timeSinceLastImpact, 0.4, 1, settings.pulseDuration);
    drawPointOnArc(center, radius, base.circleRadius * .75, Math.PI);
    drawPointOnArc(center, radius, base.circleRadius * .75, Math.PI * 2);
    

 
    const distance = elaspedTime >= 0 ? (elaspedTime * arc.velocity): 0;
    const modDistance = distance % maxAngle;
    const forward = modDistance >= Math.PI;
    const adjustedDistance = forward ? modDistance : maxAngle - modDistance;
    if(arc.direction === 'forward' && !forward) {
      arc.timeSinceLastImpact = currentTime;
      arc.direction = 'backward';
      playNote(arc, index)
      
    } 
    if(arc.direction === 'backward' && forward) {
      arc.timeSinceLastImpact = currentTime;
      arc.direction = 'forward';
      playNote(arc, index)
    }
    const angle = (-Math.PI + adjustedDistance) % base.maxAngle;

    drawPointOnArc(center, radius, base.circleRadius, -angle);
    
    
  })
  if(settings.playing) {
    requestAnimationFrame(draw);
  } 
}
draw();