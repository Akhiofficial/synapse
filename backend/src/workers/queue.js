/**
 * Simple in-memory queue simulation.
 * Replaces Redis/BullMQ for this implementation.
 */
import { EventEmitter } from 'events';

class QueueManager extends EventEmitter {
  constructor() {
    super();
    this.queues = {
      embedding: [],
      clustering: [],
      graph: []
    };
    this.isProcessing = {
      embedding: false,
      clustering: false,
      graph: false
    };
  }

  addJob(queueName, data) {
    if (!this.queues[queueName]) {
      console.error(`Queue ${queueName} does not exist`);
      return;
    }
    console.log(`[Queue] Added job to ${queueName}`);
    this.queues[queueName].push(data);
    this.processNext(queueName);
  }

  async processNext(queueName) {
    if (this.isProcessing[queueName] || this.queues[queueName].length === 0) {
      return;
    }

    this.isProcessing[queueName] = true;
    const jobData = this.queues[queueName].shift();

    try {
      console.log(`[Queue] Processing job in ${queueName}...`);
      // Emit event for workers to listen
      this.emit(`process:${queueName}`, jobData);
    } catch (error) {
      console.error(`[Queue] Error starting job in ${queueName}:`, error);
    } finally {
      // Logic for moving to next job will be handled by worker completion
    }
  }

  completeJob(queueName) {
    this.isProcessing[queueName] = false;
    this.processNext(queueName);
  }
}

export const queueManager = new QueueManager();
