package main

import (
	"encoding/json"
	"net/http"
	"time"
)

func sendError(w http.ResponseWriter, code int, errType, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(ErrorResponse{Error: errType, Message: msg})
}

func sendJSON(w http.ResponseWriter, code int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(data)
}

func handleRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		sendError(w, http.StatusMethodNotAllowed, "method_not_allowed", "Only POST allowed")
		return
	}

	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, "invalid_json", "Invalid JSON")
		return
	}

	if !validateName(req.Name) {
		sendError(w, http.StatusBadRequest, "invalid_name", "Name required")
		return
	}

	if !validateEmail(req.Email) {
		sendError(w, http.StatusBadRequest, "invalid_email", "Invalid email")
		return
	}

	if emailExists(req.Email) {
		sendError(w, http.StatusConflict, "email_exists", "Email already exists")
		return
	}

	user := &User{
		ID:         generateID(),
		SecretCode: generateSecretCode(),
		Name:       req.Name,
		Email:      req.Email,
		Complaints: []string{},
		IsAdmin:    false,
	}

	usersMutex.Lock()
	users[user.SecretCode] = user
	usersMutex.Unlock()

	response := RegisterResponse{
		ID:         user.ID,
		SecretCode: user.SecretCode,
		Name:       user.Name,
		Email:      user.Email,
	}

	sendJSON(w, http.StatusCreated, response)
}

// handleLogin handles user login
func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		sendError(w, http.StatusMethodNotAllowed, "method_not_allowed", "Only POST method is allowed")
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, "invalid_json", "Invalid JSON in request body")
		return
	}

	// Authenticate user
	user, err := authenticateUser(req.SecretCode)
	if err != nil {
		sendError(w, http.StatusUnauthorized, "authentication_failed", err.Error())
		return
	}

	// Prepare response
	response := LoginResponse{
		ID:         user.ID,
		SecretCode: user.SecretCode,
		Name:       user.Name,
		Email:      user.Email,
		Complaints: user.Complaints,
		IsAdmin:    user.IsAdmin,
	}

	sendJSON(w, http.StatusOK, response)
}

// handleSubmitComplaint handles complaint submission
func handleSubmitComplaint(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		sendError(w, http.StatusMethodNotAllowed, "method_not_allowed", "Only POST method is allowed")
		return
	}

	var req SubmitComplaintRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, "invalid_json", "Invalid JSON in request body")
		return
	}

	// Authenticate user
	user, err := authenticateUser(req.SecretCode)
	if err != nil {
		sendError(w, http.StatusUnauthorized, "authentication_failed", err.Error())
		return
	}

	// Validate complaint data
	if !validateComplaintTitle(req.Title) {
		sendError(w, http.StatusBadRequest, "invalid_title", "Title is required and must be less than 200 characters")
		return
	}

	if !validateComplaintSummary(req.Summary) {
		sendError(w, http.StatusBadRequest, "invalid_summary", "Summary is required and must be less than 1000 characters")
		return
	}

	if !validateRating(req.Rating) {
		sendError(w, http.StatusBadRequest, "invalid_rating", "Rating must be between 1 and 10")
		return
	}

	// Create complaint
	complaint := &Complaint{
		ID:        generateComplaintID(),
		Title:     req.Title,
		Summary:   req.Summary,
		Rating:    req.Rating,
		UserID:    user.ID,
		UserName:  user.Name,
		Status:    "pending",
		CreatedAt: time.Now(),
	}

	// Store complaint
	complaintsMutex.Lock()
	complaints[complaint.ID] = complaint
	complaintsMutex.Unlock()

	// Update user's complaints list
	usersMutex.Lock()
	user.Complaints = append(user.Complaints, complaint.ID)
	usersMutex.Unlock()

	sendJSON(w, http.StatusCreated, complaint)
}

// handleGetAllComplaintsForUser handles getting all complaints for a user
func handleGetAllComplaintsForUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		sendError(w, http.StatusMethodNotAllowed, "method_not_allowed", "Only POST method is allowed")
		return
	}

	var req GetComplaintsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, "invalid_json", "Invalid JSON in request body")
		return
	}

	// Authenticate user
	user, err := authenticateUser(req.SecretCode)
	if err != nil {
		sendError(w, http.StatusUnauthorized, "authentication_failed", err.Error())
		return
	}

	// Get user's complaints
	var userComplaints []Complaint
	complaintsMutex.RLock()
	for _, complaintID := range user.Complaints {
		if complaint, exists := complaints[complaintID]; exists {
			userComplaints = append(userComplaints, *complaint)
		}
	}
	complaintsMutex.RUnlock()

	sendJSON(w, http.StatusOK, userComplaints)
}

// handleGetAllComplaintsForAdmin handles getting all complaints for admin
func handleGetAllComplaintsForAdmin(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		sendError(w, http.StatusMethodNotAllowed, "method_not_allowed", "Only POST method is allowed")
		return
	}

	var req GetComplaintsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, "invalid_json", "Invalid JSON in request body")
		return
	}

	// Authenticate user
	user, err := authenticateUser(req.SecretCode)
	if err != nil {
		sendError(w, http.StatusUnauthorized, "authentication_failed", err.Error())
		return
	}

	// Check if user is admin
	if !isAdmin(user) {
		sendError(w, http.StatusForbidden, "access_denied", "Only administrators can access this endpoint")
		return
	}

	// Get all complaints
	var allComplaints []Complaint
	complaintsMutex.RLock()
	for _, complaint := range complaints {
		allComplaints = append(allComplaints, *complaint)
	}
	complaintsMutex.RUnlock()

	sendJSON(w, http.StatusOK, allComplaints)
}

// handleViewComplaint handles viewing a specific complaint
func handleViewComplaint(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		sendError(w, http.StatusMethodNotAllowed, "method_not_allowed", "Only POST method is allowed")
		return
	}

	var req ViewComplaintRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, "invalid_json", "Invalid JSON in request body")
		return
	}

	// Authenticate user
	user, err := authenticateUser(req.SecretCode)
	if err != nil {
		sendError(w, http.StatusUnauthorized, "authentication_failed", err.Error())
		return
	}

	// Get complaint
	complaint, err := getComplaintByID(req.ComplaintID)
	if err != nil {
		sendError(w, http.StatusNotFound, "complaint_not_found", err.Error())
		return
	}

	// Check if user can view this complaint
	if !canViewComplaint(user, complaint) {
		sendError(w, http.StatusForbidden, "access_denied", "You can only view your own complaints")
		return
	}

	sendJSON(w, http.StatusOK, complaint)
}

// handleResolveComplaint handles marking a complaint as resolved
func handleResolveComplaint(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		sendError(w, http.StatusMethodNotAllowed, "method_not_allowed", "Only POST method is allowed")
		return
	}

	var req ResolveComplaintRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, "invalid_json", "Invalid JSON in request body")
		return
	}

	// Authenticate user
	user, err := authenticateUser(req.SecretCode)
	if err != nil {
		sendError(w, http.StatusUnauthorized, "authentication_failed", err.Error())
		return
	}

	// Check if user is admin
	if !isAdmin(user) {
		sendError(w, http.StatusForbidden, "access_denied", "Only administrators can resolve complaints")
		return
	}

	// Get complaint
	complaint, err := getComplaintByID(req.ComplaintID)
	if err != nil {
		sendError(w, http.StatusNotFound, "complaint_not_found", err.Error())
		return
	}

	// Check if complaint is already resolved
	if complaint.Status == "resolved" {
		sendError(w, http.StatusBadRequest, "already_resolved", "Complaint is already resolved")
		return
	}

	// Update complaint status
	now := time.Now()
	complaintsMutex.Lock()
	complaint.Status = "resolved"
	complaint.ResolvedAt = &now
	complaintsMutex.Unlock()

	sendJSON(w, http.StatusOK, complaint)
}
