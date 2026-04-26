const startBtn = document.getElementById('wish');
const flame = document.getElementById('flame');
const message = document.getElementById('message');
const instruction = document.getElementById('instruction');

startBtn.addEventListener('click', async () => {
  
    const AudioContext = window.AudioContext || window.webkitAudioContext;
  
    const audioContext = new AudioContext();
   
    if (audioContext.state === 'suspended') {
      
        await audioContext.resume();
      
    }

    try {
      
        const stream = await
        
        navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            } 
        });

        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
      
        source.connect(analyser);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
      
        const dataArray = new Uint8Array(bufferLength);

        startBtn.style.display = 'none';

        function detectBlow() {
          
            analyser.getByteFrequencyData(dataArray);

            let sum = 0;
          
            for (let i = 0; i < 10; i++) {
              
                sum += dataArray[i];
              
            }
          
            let lowAverage = sum / 10;

            if (lowAverage > 100) {
              
                flame.classList.add('out');
                message.style.opacity = '1';
                
                confetti({
                  
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                  
                });

                stream.getTracks().forEach(track => track.stop());
              
                return; 
              
            }

            requestAnimationFrame(detectBlow);
          
        }

        detectBlow();

    } catch (err) {
      
        console.error("microphone access denied:", err);
      
        alert("i kinda need mic access for the blow-out effect to work");
      
    }
  
});
