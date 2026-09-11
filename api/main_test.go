package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"testing"
	"time"
)

func TestVerifyPaddleSignature(t *testing.T) {
	now := time.Unix(1_777_000_000, 0)
	body := []byte(`{"event_id":"evt_123","event_type":"customer.created","data":{"id":"ctm_123"}}`)
	timestamp := "1777000000"
	mac := hmac.New(sha256.New, []byte("pdl_ntfset_test_secret"))
	_, _ = mac.Write([]byte(timestamp + ":"))
	_, _ = mac.Write(body)
	header := "ts=" + timestamp + ";h1=" + hex.EncodeToString(mac.Sum(nil))

	if err := verifyPaddleSignature("pdl_ntfset_test_secret", header, body, now); err != nil {
		t.Fatalf("expected valid signature: %v", err)
	}
	if err := verifyPaddleSignature("wrong", header, body, now); err == nil {
		t.Fatal("expected signature mismatch")
	}
	if err := verifyPaddleSignature("pdl_ntfset_test_secret", header, body, now.Add(6*time.Second)); err == nil {
		t.Fatal("expected expired signature")
	}
}
