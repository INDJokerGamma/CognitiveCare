// frontend/src/components/SpeechButton.jsx
import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import toast from 'react-hot-toast';

const SpeechButton = ({ onTranscript, lang = 'en-US' }) => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        // Check for browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const rec = new SpeechRecognition();
            rec.continuous = false; // Stops after user finishes speaking
            rec.interimResults = false;
            rec.lang = lang; // 'en-US' or 'mr-IN' for Marathi

            rec.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                onTranscript(transcript);
                setIsListening(false);
            };

            rec.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error);
                toast.error("Speech not recognized. Try again.");
                setIsListening(false);
            };

            setRecognition(rec);
        }
    }, [onTranscript, lang]);

    const toggleListen = () => {
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            if (!recognition) {
                toast.error("Speech Recognition not supported in this browser.");
                return;
            }
            recognition.start();
            setIsListening(true);
            toast('Listening...', { icon: '🎤' });
        }
    };

    return (
        <button
            type="button"
            onClick={toggleListen}
            className={`p-4 rounded-2xl transition-all ${isListening
                    ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-200"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
            title="Speak your answer"
        >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
    );
};

export default SpeechButton;