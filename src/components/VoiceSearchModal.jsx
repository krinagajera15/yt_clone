import React, { useContext, useEffect } from "react";
import "./VoiceSearchModal.css";
import { MdMic } from "react-icons/md";
import Modecontext from "../Context/ModeContext";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const VoiceSearchModal = ({
  isOpen,
  onClose,
  onVoiceSearch = () => {},   // ✅ default empty function (important)
}) => {
  const ctx = useContext(Modecontext);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!isOpen) {
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  }, [isOpen, resetTranscript]);

  // ✅ Safe call to parent
  useEffect(() => {
    if (transcript && typeof onVoiceSearch === "function") {
      onVoiceSearch(transcript);
    }
  }, [transcript, onVoiceSearch]);


  if (!isOpen) return null;

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-IN",
      });
    }
  };

  return (
    <div className="voice-backdrop">
      <div className={`voice-modal ${ctx?.mode}`}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>Search with your voice</h2>

        <p>
          {listening
            ? "Listening... Speak now"
            : "To search by voice, click on microphone"}
        </p>

        <div className="mic-circle" onClick={handleMicClick}>
          <MdMic />
        </div>

        {transcript && (
          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <strong>You said:</strong>
            <p>{transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceSearchModal;
