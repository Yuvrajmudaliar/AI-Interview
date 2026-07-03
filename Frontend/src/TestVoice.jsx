export default function TestVoice() {
  const testVoice = () => {
    speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(
      "Hello, this is a speech test."
    );

    msg.lang = "en-US";
    msg.rate = 1;

    speechSynthesis.speak(msg);
  };

  return (
    <div style={{ padding: 40 }}>
      <button
        onClick={testVoice}
        style={{
          padding: "15px 30px",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        Test Voice
      </button>
    </div>
  );
}