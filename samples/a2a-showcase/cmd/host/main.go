package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Host Server started on :8080")
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Host running"))
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}