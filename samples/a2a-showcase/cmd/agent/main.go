package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

// A2APayload represents the "Simulated" Agent-to-Agent / Agent-to-UI contract
type A2APayload struct {
	Type      string         `json:"type"`                // "text" or "a2ui_render"
	Text      string         `json:"text,omitempty"`      // The spoken/text response
	Component string         `json:"component,omitempty"` // The Lit element tag (e.g. "ui-audio-player")
	Props     map[string]any `json:"props,omitempty"`     // The properties to assign to the DOM element
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all for demo
	},
}

func main() {
	fmt.Println("🤖 Agent Server (LLM Brain) starting on :8081")

	http.HandleFunc("/ws", handleAgentWebSocket)
	log.Fatal(http.ListenAndServe(":8081", nil))
}

func handleAgentWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer conn.Close()

	log.Println("🤖 Agent: New A2A connection established.")

	// Send an initial greeting
	sendA2A(conn, A2APayload{
		Type: "text",
		Text: "Hello! I am your A2A-capable AI agent. Ask me to play a song, show you a podcast, or talk to me live.",
	})

	for {
		_, msgBytes, err := conn.ReadMessage()
		if err != nil {
			log.Println("🤖 Agent: Connection closed")
			break
		}

		// Parse the incoming user request (assuming standard JSON for now)
		var userMsg struct {
			Text string `json:"text"`
		}
		if err := json.Unmarshal(msgBytes, &userMsg); err != nil {
			continue
		}

		log.Printf("🤖 Agent Heard: %s\n", userMsg.Text)
		processIntent(conn, strings.ToLower(userMsg.Text))
	}
}

// processIntent is a simulated "LLM Tool Calling" router.
// In a production app, this would be `google.golang.org/genai` returning a ToolCall.
func processIntent(conn *websocket.Conn, text string) {
	// Simulate LLM processing latency
	time.Sleep(800 * time.Millisecond)

	if strings.Contains(text, "song") || strings.Contains(text, "music") {
		type song struct {
			id    string
			title string
			src   string
		}

		songs := []song{
			{"neon-1", "Neon Pulse", "https://storage.googleapis.com/scream-ui-samples/neon_pulse.mp3"},
			{"deep-2", "Deep Learning", "https://storage.googleapis.com/scream-ui-samples/deep_learning.mp3"},
			{"digital-3", "Digital Horizon", "https://storage.googleapis.com/scream-ui-samples/digital_horizon.mp3"},
			{"ether-4", "Ether Drift", "https://storage.googleapis.com/scream-ui-samples/ether_drift.mp3"},
			{"gradient-5", "Gradient Descent", "https://storage.googleapis.com/scream-ui-samples/gradient_descent.mp3"},
			{"latent-6", "Latent Space", "https://storage.googleapis.com/scream-ui-samples/latent_space.mp3"},
			{"neural-7", "Neural Flux", "https://storage.googleapis.com/scream-ui-samples/neural_flux.mp3"},
			{"starlight-8", "Starlight Silicon", "https://storage.googleapis.com/scream-ui-samples/starlight_silicon.mp3"},
			{"synaptic-9", "Synaptic Void", "https://storage.googleapis.com/scream-ui-samples/synaptic_void.mp3"},
		}

		selectedSong := songs[rand.Intn(len(songs))]

		// 1. Send the text response
		sendA2A(conn, A2APayload{
			Type: "text",
			Text: fmt.Sprintf("I'd love to play some music for you. Here is '%s' by the AI band:", selectedSong.title),
		})
		time.Sleep(300 * time.Millisecond)
		// 2. Yield the A2UI Component Payload
		sendA2A(conn, A2APayload{
			Type:      "a2ui_render",
			Component: "ui-audio-player",
			Props: map[string]any{
				"item": map[string]string{
					"id":  selectedSong.id,
					"src": selectedSong.src,
				},
			},
		})

	} else if strings.Contains(text, "live") || strings.Contains(text, "talk") || strings.Contains(text, "orb") {
		sendA2A(conn, A2APayload{
			Type: "text",
			Text: "Switching to Live Duplex Audio mode. Initializing the Orb component now...",
		})
		time.Sleep(300 * time.Millisecond)
		// Render the live-connection demo we built earlier!
		sendA2A(conn, A2APayload{
			Type:      "a2ui_render",
			Component: "demo-live-connection",
			Props:     map[string]any{}, // No props needed, it boots itself
		})

	} else if strings.Contains(text, "how does this work") || strings.Contains(text, "architecture") || strings.Contains(text, "what is a2a") || strings.Contains(text, "a2ui") {
		sendA2A(conn, A2APayload{
			Type: "text",
			Text: "This showcase uses Simulated Federation. The frontend sends me (the Agent) text. I then reply with an 'A2UI Payload' which the frontend uses to dynamically mount the components. Here is a diagram:",
		})
		time.Sleep(300 * time.Millisecond)
		sendA2A(conn, A2APayload{
			Type:      "a2ui_render",
			Component: "demo-architecture-card",
			Props:     map[string]any{},
		})

	} else if strings.Contains(text, "who are you") || strings.Contains(text, "agent info") || strings.Contains(text, "capabilities") {
		sendA2A(conn, A2APayload{
			Type: "text",
			Text: "I am the A2A Showcase Agent running on port 8081! Here is my capability profile:",
		})
		time.Sleep(300 * time.Millisecond)
		sendA2A(conn, A2APayload{
			Type:      "a2ui_render",
			Component: "demo-agent-card",
			Props:     map[string]any{},
		})

	} else if strings.Contains(text, "podcast") || strings.Contains(text, "playlist") {
		sendA2A(conn, A2APayload{
			Type: "text",
			Text: "I found a great podcast episode on WebComponents. Here it is:",
		})
		time.Sleep(300 * time.Millisecond)
		sendA2A(conn, A2APayload{
			Type:      "a2ui_render",
			Component: "demo-podcast-player",
			Props:     map[string]any{},
		})
	} else {
		sendA2A(conn, A2APayload{
			Type: "text",
			Text: "I'm not sure how to render that. Try asking for 'music', a 'podcast', or to 'talk live'.",
		})
	}
}

func sendA2A(conn *websocket.Conn, payload A2APayload) {
	bytes, _ := json.Marshal(payload)
	conn.WriteMessage(websocket.TextMessage, bytes)
}
