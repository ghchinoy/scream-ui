package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Agent Server started on :8081")
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Agent running"))
	})
	log.Fatal(http.ListenAndServe(":8081", nil))
}