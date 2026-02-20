package main

import (
	"encoding/json"
	"fmt"
	"log"
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
		// 1. Send the text response
		sendA2A(conn, A2APayload{
			Type: "text",
			Text: "I'd love to play some music for you. Here is 'Neon Pulse' by the AI band:",
		})
		time.Sleep(300 * time.Millisecond)
		// 2. Yield the A2UI Component Payload
		sendA2A(conn, A2APayload{
			Type:      "a2ui_render",
			Component: "ui-audio-player",
			Props: map[string]any{
				"item": map[string]string{
					"id":  "neon-1",
					"src": "https://storage.googleapis.com/scream-ui-samples/neon_pulse.mp3",
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

	} else if strings.Contains(text, "podcast") || strings.Contains(text, "playlist") {
		sendA2A(conn, A2APayload{
			Type: "text",
			Text: "Here is your queued podcast playlist.",
		})
		time.Sleep(300 * time.Millisecond)
		sendA2A(conn, A2APayload{
			Type:      "a2ui_render",
			Component: "ui-playlist",
			Props: map[string]any{
				"items": []map[string]string{
					{"id": "1", "title": "Latent Space", "duration": "45:00"},
					{"id": "2", "title": "Gradient Descent", "duration": "32:15"},
				},
			},
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
