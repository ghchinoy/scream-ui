package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// This is the Host "App Shell" Server.
// In our Simulated Federation, it serves the Vite Frontend on port 8080 and proxies WebSockets to the Agent.
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all for demo
	},
}

func main() {
	fmt.Println("🚀 Host App Server starting on :8080")

	// 1. The Proxy WebSocket Route (App -> Agent)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		// Accept the frontend connection
		clientConn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("Host: Client Upgrade error:", err)
			return
		}
		defer clientConn.Close()
		log.Println("🚀 Host: Frontend connected. Dialing Agent on :8081...")

		// Dial the actual AI Agent
		agentConn, _, err := websocket.DefaultDialer.Dial("ws://localhost:8081/ws", nil)
		if err != nil {
			log.Println("Host: Failed to dial Agent:", err)
			clientConn.WriteMessage(websocket.TextMessage, []byte(`{"type":"text", "text":"Error: Agent is unreachable. Did you start cmd/agent?"}`))
			return
		}
		defer agentConn.Close()

		log.Println("🚀 Host: Successfully proxied to Agent. Streaming A2A events.")

		// Proxy Agent -> Frontend
		go func() {
			for {
				msgType, msg, err := agentConn.ReadMessage()
				if err != nil {
					log.Println("Host: Agent connection closed")
					clientConn.Close()
					return
				}
				if err = clientConn.WriteMessage(msgType, msg); err != nil {
					return
				}
			}
		}()

		// Proxy Frontend -> Agent
		for {
			msgType, msg, err := clientConn.ReadMessage()
			if err != nil {
				log.Println("Host: Client connection closed")
				agentConn.Close()
				break
			}
			if err = agentConn.WriteMessage(msgType, msg); err != nil {
				break
			}
		}
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}