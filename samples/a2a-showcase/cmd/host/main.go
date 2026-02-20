package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

// This is the Host "App Shell" Server.
// In our Simulated Federation, it proxies A2A HTTP requests to the Agent over port 8081.

func main() {
	fmt.Println("🚀 Host App Server (Reverse Proxy) starting on :8080")

	// Target the Agent running locally
	agentURL, err := url.Parse("http://localhost:8081")
	if err != nil {
		log.Fatal(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(agentURL)

	// 1. Proxy the JSON-RPC /invoke endpoint
	http.HandleFunc("/invoke", func(w http.ResponseWriter, r *http.Request) {
		log.Println("🚀 Host: Proxying A2A /invoke to Agent")
		proxy.ServeHTTP(w, r)
	})

	// 2. Proxy the Discovery endpoint
	http.HandleFunc("/.well-known/agent-card.json", func(w http.ResponseWriter, r *http.Request) {
		log.Println("🚀 Host: Proxying agent-card.json to Agent")
		proxy.ServeHTTP(w, r)
	})

	log.Printf("Listening for Frontend requests on 127.0.0.1:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
