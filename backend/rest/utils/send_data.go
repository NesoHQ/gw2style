package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func SendData(w http.ResponseWriter,statusCode int, data interface{}) {
	fmt.Println(data)
	w.WriteHeader(statusCode)
	encoder := json.NewEncoder(w)
	encoder.Encode(data)
}