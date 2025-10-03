package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"
)

var (
	users           = make(map[string]*User)
	complaints      = make(map[string]*Complaint)
	usersMutex      = &sync.RWMutex{}
	complaintsMutex = &sync.RWMutex{}
	idCounter       = 0
	idMutex         = &sync.Mutex{}
)

func main() {
	initializeAdminUser()

	http.HandleFunc("/register", handleRegister)
	http.HandleFunc("/login", handleLogin)
	http.HandleFunc("/submitComplaint", handleSubmitComplaint)
	http.HandleFunc("/getAllComplaintsForUser", handleGetAllComplaintsForUser)
	http.HandleFunc("/getAllComplaintsForAdmin", handleGetAllComplaintsForAdmin)
	http.HandleFunc("/viewComplaint", handleViewComplaint)
	http.HandleFunc("/resolveComplaint", handleResolveComplaint)

	fmt.Println("Server starting on :8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}

func initializeAdminUser() {
	admin := &User{
		ID:         generateID(),
		SecretCode: "ADMIN123",
		Name:       "Admin User",
		Email:      "admin@bugsmirror.com",
		IsAdmin:    true,
		Complaints: []string{},
	}

	usersMutex.Lock()
	users[admin.SecretCode] = admin
	usersMutex.Unlock()

	fmt.Println("Admin initialized")
}
