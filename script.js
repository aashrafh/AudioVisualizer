let audioAnalyser, freqArray;
function visualize(){
    //setup Web Audio API 
    let audio = new Audio();
    let audioContext = new (window.AudioContext || window.webkitAudioContext);

    audioAnalyser = audioContext.createAnalyser();
    audio.src = "tracks/bensound-creativeminds.mp3";
    let source = audioContext.createMediaElementSource(audio);
    source.connect(audioAnalyser);
    audioAnalyser.connect(audioContext.destination);

    freqArray = new Uint8Array(audioAnalyser.frequencyBinCount);

    document.getElementById("play").style.display = "none";
    audio.play();
    animate();
}

function animate(){
    //setup the canvas
    let canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasContext = canvas.getContext("2d");

    //center of the circle
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let radius = 200;

    //background styling
    let gradient = canvasContext.createLinearGradient(0, 0, 0, canvas.height); //x1, y1, x2, y2
    gradient.addColorStop(0, "rgba(26, 13, 21, 1)")  //offset, color
    gradient.addColorStop(1, "rgba(36, 45, 33, 1)")  //offset, color
    canvasContext.fillStyle = gradient;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    //Draw the circle
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, 2*Math.PI);
    canvasContext.stroke();

    const bars = 250;
    const theta = 2*Math.PI / bars;
    audioAnalyser.getByteFrequencyData(freqArray);
    for(let i = 0; i<bars; ++i){
        let barHeight = freqArray[i]*0.62;

        //start point
        let startX = centerX + radius*Math.cos(theta*i);
        let startY = centerY + radius*Math.sin(theta*i);

        //endpoint
        let endX = centerX + (radius+barHeight)*Math.cos(theta*i);
        let endY = centerY + (radius+barHeight)*Math.sin(theta*i);

        //draw that bar
        drawBar(startX, startY, endX, endY, freqArray[i], canvasContext);
    }

    window.requestAnimationFrame(animate);
}

function drawBar(startX, startY, endX, endY, freq, canvasContext){
    let barColor = "rgba(" + freq + ", " + freq + ", " + 205 + ")";
    const barWidth = 2;

    canvasContext.strokeStyle = barColor;
    canvasContext.lineWidth = barWidth;
    canvasContext.beginPath();
    canvasContext.moveTo(startX, startY);
    canvasContext.lineTo(endX, endY);
    canvasContext.stroke();
}