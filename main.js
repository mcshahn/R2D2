var audioCtx;

var carrier;
var modulatorFreq;
var modulationIndex;

var biquadFilter;
var whiteNoise;

var fmGain;
var bqGain;



function initBiquad() {

    var bufferSize = 10 * audioCtx.sampleRate,
        noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
        output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.5;
    }
    whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.start(0);

    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "lowpass";
    biquadFilter.frequency.setValueAtTime(500, audioCtx.currentTime);
    biquadFilter.gain.setValueAtTime(10, audioCtx.currentTime);
    biquadFilter.Q.value = 300;

    bqGain = audioCtx.createGain();
    bqGain.gain.value = 0.5;

    whiteNoise.connect(biquadFilter).connect(bqGain);


}


function initFM() {
    
    carrier = audioCtx.createOscillator();

    modulatorFreq = audioCtx.createOscillator();
    modulatorFreq.frequency.value = 250;

    modulationIndex = audioCtx.createGain();
    modulationIndex.gain.value = 1000;
    
    fmGain = audioCtx.createGain();
    fmGain.gain.value = 0.5;

    modulatorFreq.connect(modulationIndex);
    modulationIndex.connect(carrier.frequency)
    carrier.connect(fmGain);
    
    carrier.start();
    modulatorFreq.start();

    
}


function updateFreq(val) {
    biquadFilter.frequency.value = val;
    modulatorFreq.frequency.value = val;
};


const playButton = document.querySelector('button');
playButton.addEventListener('click', function() {

    if(!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext);
        initBiquad();
        initFM();
        var globalGain = audioCtx.createGain()
        globalGain.gain.value = 0.3;
        fmGain.connect(globalGain).connect(audioCtx.destination);
        bqGain.connect(globalGain);
        return;
	}

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (audioCtx.state === 'running') {
        audioCtx.suspend();
    }

}, false);