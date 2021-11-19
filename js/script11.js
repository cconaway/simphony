

//Good Poly Synth Example
//          https://github.com/marcusprice/Musi

Tone.Transport.scheduleRepeat(function(time) {
    getWaveform();
}, '1.0');
Tone.Transport.start();


//binds to the device
function replaceElements(inputs) {
    const elements = inputs.map(e => {
        console.log(e);
        connectToDevice.bind(null, e)();
        return "";
    });
}

//Connects to console and maps inputs to commands
//This is where you map the numbers to stuff.
function connectToDevice(device) {
    console.log('Connecting to device', device);
    device.onmidimessage = function(m) {
        const [command, key, value] = m.data;
        console.log([command, key, value])

        //Maps keys
        if (command === 144) {
            noteOn(key, value);
        } else if(command === 128) {
            noteOff(key);
        } else if (command=== 176) {
            if(key===1)
                console.log("PitchBend of: ", value);
            if(key===2)
                lpFilterChange(value);
                console.log("Knob 2 Turned to: ", value);
            if(key===3)
                console.log("Knob 3 Turned to: ", value);
            if(key===4)
                console.log("Knob 4 Turned to: ", value);
            if(key===5)
                console.log("Knob 5 Turned to: ", value);
            if(key===6)
                console.log("Knob 6 Turned to: ", value);
            if(key===7)
                console.log("Knob 7 Turned to: ", value);
            if(key===8)
                console.log("Knob 8 Turned to: ", value);
            if(key===9)
                console.log("Knob 9 Turned to: ", value);
        } else if (command === 224) {
            console.log("Mod Wheel Set To: ", value);
        }
    }
}

//Note On Function
function noteOn(midiNote,v) {
    console.log("note on");
    var freq = Tone.Midi(midiNote).toFrequency(); //converts midi note to dreq
    
    polySynth.triggerAttack(freq); //trigger poly synth Attack at Frequency 
}

//Note Off Function
function noteOff(midiNote) {
    console.log("note off");
    var freq = Tone.Midi(midiNote).toFrequency();

    polySynth.triggerRelease(freq);
}

function lpFilterChange(value) {

    const maxFilter = 10000;
    const minFilter = 100;
    const stepsize = (maxFilter-minFilter)/128 

    lpFilter.set({
        frequency: value*stepsize, //need to change linear scaling
    })
}

//Requests midi access
navigator.requestMIDIAccess().then(function(access) {
    console.log('access', access);
    replaceElements(Array.from(access.inputs.values()));
    access.onstatechange = function(e) {
        replaceElements(Array.from(this.inputs.values()));
    }
});

//Creating a filter
const lpFilter = new Tone.Filter().toDestination();
lpFilter.set({
	frequency: "1000",
	type: "lowpass"
});

//Making a poly synth
const polySynth = new Tone.PolySynth(Tone.AMSynth).connect(lpFilter);
polySynth.set({
    "envelope" : {
        "attack" : 0.3,
        "decay" : 0.1,
        "sustain" : 1.0,
        "release" : 5.0
    }
})

//gives out array of waveform analysis. Not sure if it passes through the filter yet.
function getWaveform() {
    var values = analyser.getValue();

    //console.log(values); //Comment on if you want to log the arrays
}

const analyser = new Tone.Analyser('waveform', 128);
polySynth.connect(analyser);


//0 - 100,
//127 - 10000+