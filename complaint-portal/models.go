package main

import "time"

type User struct {
	ID         string   `json:"id"`
	SecretCode string   `json:"secret_code"`
	Name       string   `json:"name"`
	Email      string   `json:"email"`
	Complaints []string `json:"complaints"`
	IsAdmin    bool     `json:"is_admin,omitempty"`
}

type Complaint struct {
	ID         string     `json:"id"`
	Title      string     `json:"title"`
	Summary    string     `json:"summary"`
	Rating     int        `json:"rating"`
	UserID     string     `json:"user_id"`
	UserName   string     `json:"user_name,omitempty"`
	Status     string     `json:"status"`
	CreatedAt  time.Time  `json:"created_at"`
	ResolvedAt *time.Time `json:"resolved_at,omitempty"`
}


type RegisterRequest struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type RegisterResponse struct {
	ID         string `json:"id"`
	SecretCode string `json:"secret_code"`
	Name       string `json:"name"`
	Email      string `json:"email"`
}

type LoginRequest struct {
	SecretCode string `json:"secret_code"`
}

type LoginResponse struct {
	ID         string   `json:"id"`
	SecretCode string   `json:"secret_code"`
	Name       string   `json:"name"`
	Email      string   `json:"email"`
	Complaints []string `json:"complaints"`
	IsAdmin    bool     `json:"is_admin,omitempty"`
}

type SubmitComplaintRequest struct {
	SecretCode string `json:"secret_code"`
	Title      string `json:"title"`
	Summary    string `json:"summary"`
	Rating     int    `json:"rating"`
}

type GetComplaintsRequest struct {
	SecretCode string `json:"secret_code"`
}

type ViewComplaintRequest struct {
	SecretCode   string `json:"secret_code"`
	ComplaintID  string `json:"complaint_id"`
}

type ResolveComplaintRequest struct {
	SecretCode   string `json:"secret_code"`
	ComplaintID  string `json:"complaint_id"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}