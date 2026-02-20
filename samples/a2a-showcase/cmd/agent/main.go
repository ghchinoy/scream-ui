package main

import (
	"context"
	"fmt"
	"iter"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/a2aproject/a2a-go/a2a"
	"github.com/a2aproject/a2a-go/a2asrv"
)

// agentExecutor implements the a2asrv.AgentExecutor interface required by the a2a-go SDK.
// It receives standard A2A requests (via JSON-RPC over HTTP) and yields a2a.Event responses.
type agentExecutor struct{}

var _ a2asrv.AgentExecutor = (*agentExecutor)(nil)

func (*agentExecutor) Cancel(ctx context.Context, execCtx *a2asrv.ExecutorContext) iter.Seq2[a2a.Event, error] {
	return func(yield func(a2a.Event, error) bool) {
		log.Println("Agent request cancelled")
	}
}

func (*agentExecutor) Execute(ctx context.Context, execCtx *a2asrv.ExecutorContext) iter.Seq2[a2a.Event, error] {
	return func(yield func(a2a.Event, error) bool) {
		// 1. Extract the text intent from the incoming A2A Message parts
		var userText string
		if execCtx.Message != nil {
			for _, part := range execCtx.Message.Parts {
				if text, ok := part.Content.(a2a.Text); ok {
					userText += string(text) + " "
				}
			}
		}

		userText = strings.ToLower(strings.TrimSpace(userText))
		log.Printf("🤖 Agent Heard: %s\n", userText)

		// Simulate LLM latency
		time.Sleep(800 * time.Millisecond)

		// 2. Intent Routing & A2UI Output Generation
		if strings.Contains(userText, "song") || strings.Contains(userText, "music") {
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

			yield(a2a.NewMessage(a2a.MessageRoleAgent,
				a2a.NewTextPart(fmt.Sprintf("I'd love to play some music for you. Here is '%s' by the AI band:", selectedSong.title)),
				&a2a.Part{
					MediaType: "application/json+a2ui",
					Content: a2a.Data{
						"surfaceUpdate": map[string]any{
							"surfaceId": "surface-" + selectedSong.id,
							"components": []map[string]any{
								{
									"id":   "player-1",
									"type": "UiAudioPlayer", // Mapped to <ui-audio-player>
									"props": map[string]any{
										"item": map[string]string{
											"id":  selectedSong.id,
											"src": selectedSong.src,
										},
									},
								},
							},
						},
					},
				},
			), nil)

		} else if strings.Contains(userText, "live") || strings.Contains(userText, "talk") || strings.Contains(userText, "orb") {
			yield(a2a.NewMessage(a2a.MessageRoleAgent,
				a2a.NewTextPart("Switching to Live Duplex Audio mode. Initializing the Orb component now..."),
				&a2a.Part{
					MediaType: "application/json+a2ui",
					Content: a2a.Data{
						"surfaceUpdate": map[string]any{
							"surfaceId": "surface-live",
							"components": []map[string]any{
								{
									"id":    "live-1",
									"type":  "DemoLiveConnection",
									"props": map[string]any{},
								},
							},
						},
					},
				},
			), nil)

		} else if strings.Contains(userText, "how does this work") || strings.Contains(userText, "architecture") || strings.Contains(userText, "what is a2a") || strings.Contains(userText, "a2ui") {
			yield(a2a.NewMessage(a2a.MessageRoleAgent,
				a2a.NewTextPart("This showcase uses the official A2A JSON-RPC protocol over HTTP Server-Sent Events (SSE). Instead of raw WebSockets, the Host sends standard REST POST requests to my /invoke endpoint. I then yield standard A2UI v0.8 surfaceUpdate JSON objects inside a2a.DataParts. Here is a diagram:"),
				&a2a.Part{
					MediaType: "application/json+a2ui",
					Content: a2a.Data{
						"surfaceUpdate": map[string]any{
							"surfaceId": "surface-arch",
							"components": []map[string]any{
								{
									"id":    "arch-1",
									"type":  "DemoArchitectureCard",
									"props": map[string]any{},
								},
							},
						},
					},
				},
			), nil)

		} else if strings.Contains(userText, "who are you") || strings.Contains(userText, "agent info") || strings.Contains(userText, "capabilities") {
			yield(a2a.NewMessage(a2a.MessageRoleAgent,
				a2a.NewTextPart("I am the A2A Showcase Agent running the official a2a-go SDK! Here is my capability profile:"),
				&a2a.Part{
					MediaType: "application/json+a2ui",
					Content: a2a.Data{
						"surfaceUpdate": map[string]any{
							"surfaceId": "surface-agent",
							"components": []map[string]any{
								{
									"id":    "agent-1",
									"type":  "DemoAgentCard",
									"props": map[string]any{},
								},
							},
						},
					},
				},
			), nil)

		} else if strings.Contains(userText, "podcast") || strings.Contains(userText, "playlist") {
			yield(a2a.NewMessage(a2a.MessageRoleAgent,
				a2a.NewTextPart("I found a great podcast episode on WebComponents. Here it is:"),
				&a2a.Part{
					MediaType: "application/json+a2ui",
					Content: a2a.Data{
						"surfaceUpdate": map[string]any{
							"surfaceId": "surface-podcast",
							"components": []map[string]any{
								{
									"id":    "podcast-1",
									"type":  "DemoPodcastPlayer",
									"props": map[string]any{},
								},
							},
						},
					},
				},
			), nil)
		} else {
			yield(a2a.NewMessage(a2a.MessageRoleAgent, a2a.NewTextPart("I'm not sure how to render that. Try asking for 'music', a 'podcast', or to 'talk live'.")), nil)
		}
	}
}

func main() {
	fmt.Println("🤖 Agent Server (Official A2A JSON-RPC) starting on :8081")

	// 1. Define the official AgentCard
	agentCard := &a2a.AgentCard{
		Name:        "A2A Showcase Agent",
		Description: "An interactive agent capable of rendering @ghchinoy/lit-audio-ui components.",
		SupportedInterfaces: []*a2a.AgentInterface{
			a2a.NewAgentInterface("http://127.0.0.1:8081/invoke", a2a.TransportProtocolJSONRPC),
		},
		DefaultInputModes:  []string{"text"},
		DefaultOutputModes: []string{"text"},
		Capabilities: a2a.AgentCapabilities{
			Streaming: true,
			Extensions: []a2a.AgentExtension{
				{
					URI:         "https://a2ui.org/specification/v0_8",
					Required:    true,
					Description: "Supports A2UI v0.8 for dynamic UI orchestration",
					Params: map[string]any{
						"catalogUrl": "https://raw.githubusercontent.com/ghchinoy/scream-ui/main/docs/a2ui_v0.8_catalog.json",
					},
				},
			},
		},
	}

	// 2. Wire up the SDK
	requestHandler := a2asrv.NewHandler(&agentExecutor{})

	mux := http.NewServeMux()
	mux.Handle("/invoke", a2asrv.NewJSONRPCHandler(requestHandler))
	mux.Handle(a2asrv.WellKnownAgentCardPath, a2asrv.NewStaticAgentCardHandler(agentCard))

	log.Printf("Listening for A2A HTTP requests on 127.0.0.1:8081")
	if err := http.ListenAndServe(":8081", mux); err != nil {
		log.Printf("Server stopped: %v", err)
	}
}
