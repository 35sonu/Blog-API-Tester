package main

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"math/big"
	"strconv"
	"strings"
	"time"
)

func generateID() string {
	idMutex.Lock()
	defer idMutex.Unlock()
	idCounter++
	return strconv.Itoa(idCounter)
}

func generateSecretCode() string {
	bytes := make([]byte, 8)
	_, err := rand.Read(bytes)
	if err != nil {
		return fmt.Sprintf("SC%d", time.Now().UnixNano())
	}
	return strings.ToUpper(hex.EncodeToString(bytes))
}

func generateComplaintID() string {
	return "C" + generateID()
}

func authenticateUser(secretCode string) (*User, error) {
	if secretCode == "" {
		return nil, fmt.Errorf("secret code required")
	}

	usersMutex.RLock()
	user, exists := users[secretCode]
	usersMutex.RUnlock()

	if !exists {
		return nil, fmt.Errorf("invalid secret code")
	}
	return user, nil
}

func isAdmin(user *User) bool {
	return user.IsAdmin
}

// validateEmail performs basic email validation
func validateEmail(email string) bool {
	if email == "" {
		return false
	}
	// Basic email validation - contains @ and at least one dot after @
	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return false
	}
	if parts[0] == "" || parts[1] == "" {
		return false
	}
	return strings.Contains(parts[1], ".")
}

// validateName checks if name is valid (not empty and reasonable length)
func validateName(name string) bool {
	name = strings.TrimSpace(name)
	return len(name) > 0 && len(name) <= 100
}

// validateComplaintTitle validates complaint title
func validateComplaintTitle(title string) bool {
	title = strings.TrimSpace(title)
	return len(title) > 0 && len(title) <= 200
}

// validateComplaintSummary validates complaint summary
func validateComplaintSummary(summary string) bool {
	summary = strings.TrimSpace(summary)
	return len(summary) > 0 && len(summary) <= 1000
}

// validateRating validates severity rating (1-10)
func validateRating(rating int) bool {
	return rating >= 1 && rating <= 10
}

// emailExists checks if an email is already registered
func emailExists(email string) bool {
	usersMutex.RLock()
	defer usersMutex.RUnlock()
	
	for _, user := range users {
		if user.Email == email {
			return true
		}
	}
	return false
}

// getComplaintByID retrieves a complaint by ID
func getComplaintByID(complaintID string) (*Complaint, error) {
	complaintsMutex.RLock()
	complaint, exists := complaints[complaintID]
	complaintsMutex.RUnlock()
	
	if !exists {
		return nil, fmt.Errorf("complaint not found")
	}
	
	return complaint, nil
}

// canViewComplaint checks if a user can view a specific complaint
func canViewComplaint(user *User, complaint *Complaint) bool {
	// Admin can view all complaints
	if user.IsAdmin {
		return true
	}
	
	// User can only view their own complaints
	return complaint.UserID == user.ID
}

// generateRandomInt generates a random integer between min and max (for testing)
func generateRandomInt(min, max int) int {
	if min >= max {
		return min
	}
	
	diff := max - min + 1
	n, err := rand.Int(rand.Reader, big.NewInt(int64(diff)))
	if err != nil {
		// Fallback to time-based generation
		return min + int(time.Now().UnixNano())%diff
	}
	
	return min + int(n.Int64())
}