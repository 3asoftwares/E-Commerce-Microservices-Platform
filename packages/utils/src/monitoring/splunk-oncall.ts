/**
 * Splunk On-Call (VictorOps) Integration
 * Provides incident management and alerting for backend microservices
 */

export interface SplunkOnCallConfig {
  apiId: string;
  apiKey: string;
  routingKey: string;
  baseUrl?: string;
}

export interface IncidentPayload {
  messageType: 'CRITICAL' | 'WARNING' | 'ACKNOWLEDGEMENT' | 'INFO' | 'RECOVERY';
  entityId: string;
  entityDisplayName: string;
  stateMessage: string;
  stateStartTime?: number;
  monitoringTool?: string;
  alertUrl?: string;
  imageUrl?: string;
  ackMsg?: string;
  ackAuthor?: string;
  details?: Record<string, any>;
}

export interface SplunkOnCallResponse {
  result: string;
  entityId: string;
}

export class SplunkOnCallClient {
  private config: SplunkOnCallConfig;
  private baseUrl: string;

  constructor(config: SplunkOnCallConfig) {
    this.config = config;
    this.baseUrl =
      config.baseUrl || 'https://alert.victorops.com/integrations/generic/20131114/alert';
  }

  /**
   * Send an alert to Splunk On-Call
   */
  async sendAlert(payload: IncidentPayload): Promise<SplunkOnCallResponse> {
    const url = `${this.baseUrl}/${this.config.apiId}/${this.config.apiKey}/${this.config.routingKey}`;

    const body = {
      message_type: payload.messageType,
      entity_id: payload.entityId,
      entity_display_name: payload.entityDisplayName,
      state_message: payload.stateMessage,
      state_start_time: payload.stateStartTime || Math.floor(Date.now() / 1000),
      monitoring_tool: payload.monitoringTool || '3A Softwares E-Commerce',
      alert_url: payload.alertUrl,
      image_url: payload.imageUrl,
      ack_msg: payload.ackMsg,
      ack_author: payload.ackAuthor,
      ...payload.details,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Splunk On-Call API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send Splunk On-Call alert:', error);
      throw error;
    }
  }

  /**
   * Send a critical alert
   */
  async critical(
    entityId: string,
    displayName: string,
    message: string,
    details?: Record<string, any>
  ): Promise<SplunkOnCallResponse> {
    return this.sendAlert({
      messageType: 'CRITICAL',
      entityId,
      entityDisplayName: displayName,
      stateMessage: message,
      details,
    });
  }

  /**
   * Send a warning alert
   */
  async warning(
    entityId: string,
    displayName: string,
    message: string,
    details?: Record<string, any>
  ): Promise<SplunkOnCallResponse> {
    return this.sendAlert({
      messageType: 'WARNING',
      entityId,
      entityDisplayName: displayName,
      stateMessage: message,
      details,
    });
  }

  /**
   * Send an info alert
   */
  async info(
    entityId: string,
    displayName: string,
    message: string,
    details?: Record<string, any>
  ): Promise<SplunkOnCallResponse> {
    return this.sendAlert({
      messageType: 'INFO',
      entityId,
      entityDisplayName: displayName,
      stateMessage: message,
      details,
    });
  }

  /**
   * Send a recovery alert (resolves an incident)
   */
  async recovery(
    entityId: string,
    displayName: string,
    message: string,
    details?: Record<string, any>
  ): Promise<SplunkOnCallResponse> {
    return this.sendAlert({
      messageType: 'RECOVERY',
      entityId,
      entityDisplayName: displayName,
      stateMessage: message,
      details,
    });
  }

  /**
   * Acknowledge an incident
   */
  async acknowledge(
    entityId: string,
    displayName: string,
    message: string,
    author: string
  ): Promise<SplunkOnCallResponse> {
    return this.sendAlert({
      messageType: 'ACKNOWLEDGEMENT',
      entityId,
      entityDisplayName: displayName,
      stateMessage: message,
      ackMsg: message,
      ackAuthor: author,
    });
  }
}

/**
 * Create a pre-configured Splunk On-Call client from environment variables
 */
export function createSplunkOnCallClient(): SplunkOnCallClient {
  const config: SplunkOnCallConfig = {
    apiId: process.env.SPLUNK_ONCALL_API_ID || '',
    apiKey: process.env.SPLUNK_ONCALL_API_KEY || '',
    routingKey: process.env.SPLUNK_ONCALL_ROUTING_KEY || 'default',
    baseUrl: process.env.SPLUNK_ONCALL_BASE_URL,
  };

  if (!config.apiId || !config.apiKey) {
    console.warn('Splunk On-Call credentials not configured. Alerts will fail.');
  }

  return new SplunkOnCallClient(config);
}

/**
 * Singleton instance for convenience
 */
let defaultClient: SplunkOnCallClient | null = null;

export function getSplunkOnCallClient(): SplunkOnCallClient {
  if (!defaultClient) {
    defaultClient = createSplunkOnCallClient();
  }
  return defaultClient;
}

export default SplunkOnCallClient;
