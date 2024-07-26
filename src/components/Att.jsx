import { useState } from "react";
import axios from "axios";
import "./index.css";
import Speech from "react-speech";
import LANGUAGES from "./languages";
import Select from "react-select";
import Birds from "./../assets/birds.jpeg";
import Egg from "./../assets/egg.jpeg";
import Reptiles from "./../assets/reptiles.jpeg";

function formatTextWithLineBreaks(text) {
  return text.split("\\n").map((line, index) => (
    <div key={index}>
      {line}
      <br />
    </div>
  ));
}
const sortedLanguages = LANGUAGES.sort((a, b) =>
  a.label.localeCompare(b.label)
);

// Convert the sorted languages to the format expected by react-select
const languageOptions = sortedLanguages.map((lang) => ({
  value: lang.value,
  label: lang.label,
}));

function App() {
  const [selectedText, setSelectedText] = useState("");
  const [outputLang, setOutputLang] = useState("hau_Latn");
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speechStatus, setSpeechStatus] = useState("none"); // 'none', 'playing', 'paused', 'stopped'

  // Function to control speech
  const handleSpeech = (command) => {
    setSpeechStatus(command);
  };

  // Static content for the book container
  const bookContent = `
  <div class="section">
    <h2>Section 2: Reptiles & Birds</h2>
    <div class="content">
    <!-- Placeholder for Image 2 -->
      <img class="book-image" src=${Reptiles} alt="Reptiles characteristics" />
      <p>There are three major groups of reptiles – lizards and snakes, alligators and crocodiles, and turtles. Reptiles live all over the world except in frigid locations. They are ectothermic or cold-blooded. They thrive in warm climates, using the energy from the sun to keep warm. Reptiles use internal fertilization and lay their eggs on land. Internal fertilization is the joining of an egg and sperm cell during sexual reproduction, which occurs inside a female’s body. While still inside the mother’s body, fertilized eggs are covered with membranes and a leathery shell. This shell, an amniotic egg, helps protect the developing embryo and keeps it from drying out. Almost all reptiles do not care for their young, abandoning their eggs and leaving the baby reptiles to grow up independently. Crocodiles are the exception.</p>
      <!-- Placeholder for Image 2 -->
      <img class="book-image" src=${Egg} alt="Animotic Eggs" />

      <p>There are thousands of species of lizards scattered around the globe. Lizards have skin covered with overlapping scales that prevent them from drying out. They don’t shed their skin whole like snakes do, but rather over time, they lose patches of it as they grow. In addition, they have a unique adaptation that allows them to regenerate their tail if it’s lost when escaping from a predator. The tail separates from the body and continues to move, distracting the predator and allowing for a speedy getaway.</p>
      <p>Snakes, like lizards, also have dry, scaly skin covered with overlapping scales. They push themselves on their bellies by moving forward or sideways. They have flexible muscles in their jaws that allow them to stretch like a rubber band. This allows the jaw to get wider as it eats. Additionally, snakes use their bellies to move and can molt or shed their skin several times. The molting process allows the snake to grow. They also have kidneys, an organ that filters water from the blood and excretes it as urine.</p>
      <p>Unlike lizards and snakes, a turtle’s body is covered by a protective shell that develops from its ribs.  They retreat into the shell when threatened or when they sleep.  Turtles live in or near water and can hold their breath underwater for a very long time.  Turtles eat plants and fish.  Like other reptiles, they lay leathery eggs.  They migrate from feeding areas to nesting grounds, where they dig a hold on a sandy beach and lay their eggs.  Then, they cover them and return to the ocean.  A hatchling must then make its way from the nest to the ocean, a difficult time for a sea turtle.</p>
      <p>Both crocodiles and alligators spend most of their lives in water but are adapted to living on land.  They have four legs and a muscular tail for swimming.  They have powerful jaws and large scales, and their eyes and nostrils can be found on top of their heads. The main difference between a crocodile and an alligator is the differences in their snouts.  The crocodile has a long, V-shaped nose, and an alligator has a wide, rounded, u-shaped snout.</p>
      <!-- Placeholder for Image 3 -->
      <img class="book-image" src=${Birds} alt="Birds characteristics" />
      <p>Birds, unlike reptiles, are endothermic vertebrates living in diverse environments worldwide. The shapes of their feet, legs, and beaks allow them to thrive and survive in these different places.  For example, the webbed feet of a duck are arranged in a way ideal for swimming.  An ostrich has long, powerful legs that can cover 10 feet in a single stride.  The sharp bill of a gull allows it to snatch its prey, toss it in the air, and then swallow it whole.  A bird’s beak is made of keratin, making it hard, durable, and ideal for pecking holes and eating.</p>
      <p>A bird, spending much of its life in the air, requires a tremendous amount of energy.  Birds have an efficient respiratory system with a pair of lungs that move oxygen quickly through their bodies.  Birds have a four-chambered heart that is large and systematic, giving them the stamina they need for their many adaptations for flight.  They have a high-energy diet consisting of insects, seeds, and sometimes other small animals.  A bird has wings with a defined shape, allowing for movement and the surface area needed to fly.  Their bones are hollow, making them light and able to support their wings.  The muscles on their breastbone provide the necessary power and endurance for shorter and longer flights.</p>
      <p>The feathers found on a bird’s wings, and tail are referred to as flight feathers.   Their contour feathers give them a streamlined shape, creating an aerodynamic force that enables flight.  A bird can change the shape of its wing to slow down or speed up.  Down feathers provide insulation and help maintain body temperature.</p>
    </div>
  </div>
`;

  const handleAction = (actionType) => {
    let data = {};
    let headers = {
      accept: "application/json, text/plain, */*",
      "content-type": "application/json",
    };
    setIsLoading(true);

    console.log("hhhh", window.location);

    const params = new URLSearchParams(window.location.search);
    const backendUrl = params.get("baseUrl");

    let baseUrl = backendUrl + "/" || "https://a2dd-104-197-182-75.ngrok.io/";
    data = {
      text: selectedText,
      action: actionType,
    };

    if (actionType === "translate") {
      data = {
        ...data,
        source_language: "english",
        target_language: outputLang,
      };
    } 

    axios
      .post(baseUrl, data, { headers: headers })
      .then((response) => {
        // Update the apiResponse state with the response data
        setApiResponse(JSON.stringify(response.data.result)); // Stringify for pretty printing
        setIsLoading(false); // Reset loading state
      })
      .catch((error) => {
        // Handle the error
        console.error("API request error:", error);
        setApiResponse("Error: " + error.message); // Update the state with error message
        setIsLoading(false); // Reset loading state
      });
  };

  // Function to handle text selection within the book container
  const handleTextSelection = () => {
    const selection = window.getSelection();

    // Remove previous highlights
    const previousHighlights = document.querySelectorAll(".highlight");
    previousHighlights.forEach((node) => {
      const parent = node.parentNode;
      while (node.firstChild) {
        parent.insertBefore(node.firstChild, node);
      }
      parent.removeChild(node);
    });

    if (!selection.rangeCount) {
      setIsTextSelected(false);
      return;
    }

    const range = selection.getRangeAt(0);
    if (range.toString().trim().length > 0) {
      const span = document.createElement("span");
      span.className = "highlight";
      range.surroundContents(span);

      const selectedText = range.toString();
      setSelectedText(selectedText);
      setIsTextSelected(true);
    } else {
      setSelectedText("");
      setIsTextSelected(false);
    }

    // Deselect text
    selection.removeAllRanges();
  };

  return (
    <div className="App">
      <div
        className="book-container"
        onMouseUp={handleTextSelection}
        dangerouslySetInnerHTML={{ __html: bookContent }}
      />
      <div className="actions-container">
        <div className="info-container">
          <div className="info-text">
            {"This demo is an open source LLM version of "}
            <a
              href="https://github.com/openai/interactive-textbook-demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              openai/interactive-textbook-demo
            </a>
            {" and uses:"} <br />
            - facebook/nllb-200-distilled-600M for translation
            <br />
            - TheBloke/Llama-2-13B-chat-GGML from HF for other actions
            <br />
          </div>
          <div className="info-text">
            Models are running on the free version of Google Colab here:
            <a
              href="https://colab.research.google.com/drive/1VeCNYhd6B2PN5O_UQ57lgiHtGIPfUjg1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" Google Colab"}
            </a>
            .<br />
            Expect slower execution due to hardware constraints.
          </div>
          <div className="action-instruction">
            Please select the text on the left side area to do an action on that
            text.
          </div>
        </div>

        <button
          disabled={!isTextSelected || isLoading}
          onClick={() => handleAction("eli5")}
        >
          {isLoading ? "Loading..." : "ELI5"}
        </button>
        <button
          disabled={!isTextSelected || isLoading}
          onClick={() => handleAction("summarize")}
        >
          {isLoading ? "Loading..." : "Summarize"}
        </button>
        <button
          disabled={!isTextSelected || isLoading}
          onClick={() => handleAction("poem")}
        >
          {isLoading ? "Loading..." : "Explain as a poem"}
        </button>
        <div className="translate-container">
          <Select
            options={languageOptions}
            value={languageOptions.find(
              (option) => option.value === outputLang
            )}
            onChange={(selectedOption) => setOutputLang(selectedOption.value)}
          />
          <button
            disabled={!isTextSelected || isLoading}
            onClick={() => handleAction("translate")}
          >
            {" "}
            {isLoading ? "Loading..." : "Translate"}
          </button>
        </div>
        {apiResponse && (
          <div className="api-response-container">
            <div>{formatTextWithLineBreaks(apiResponse.replaceAll('"',''))}</div>
            <br />
            <br />
            <div>
              <Speech
                text={apiResponse}
                pitch="1"
                rate="1"
                volume="1"
                lang="en-US"
                voice="Google UK English Male"
                textAsButton={true}
                displayText={speechStatus === "playing" ? "Pause" : "Listen"}
                pause={speechStatus === "paused"}
                stop={speechStatus === "stopped"}
                onClick={() => {
                  if (speechStatus === "playing") {
                    handleSpeech("paused");
                  } else {
                    handleSpeech("playing");
                  }
                }}
              />
              <button
                disabled={!isTextSelected || isLoading}
                onClick={() => {
                  setSelectedText(apiResponse);
                  handleAction("translate");
                }}
              >
                {isLoading ? "Loading..." : "Translate Response"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
