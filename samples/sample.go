// Sample Go package demonstrating Carbonline syntax highlighting.
package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type WorkerMetrics struct {
	ProcessedJobs int64         `json:"processed_jobs"`
	TotalDuration time.Duration `json:"total_duration"`
	IsHealthy     bool          `json:"is_healthy"`
}

type Pipeline struct {
	id      string
	metrics *WorkerMetrics
	mu      sync.RWMutex
}

func NewPipeline(id string) *Pipeline {
	return &Pipeline{
		id: id,
		metrics: &WorkerMetrics{
			ProcessedJobs: 0,
			IsHealthy:     true,
		},
	}
}

func (p *Pipeline) Run(ctx context.Context, jobs <-chan string) error {
	defer fmt.Printf("[pipeline %s] terminated gracefully\n", p.id)

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case job, ok := <-jobs:
			if !ok {
				return nil
			}
			p.mu.Lock()
			p.metrics.ProcessedJobs++
			p.mu.Unlock()
			fmt.Printf("Processed: %s\n", job)
		}
	}
}

